import axios from 'axios';

// ─── 환경 변수 및 상수 ──────────────────────────────
const PUBLIC_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PRIVATE_API_BASE_URL = import.meta.env.VITE_APP_API_URL || PUBLIC_API_BASE_URL;
const REQUEST_TIMEOUT = 10000; // 10초
const REFRESH_ENDPOINT = '/auths/refresh';
const LOGIN_PATH = '/admin/login';

// ─── 토큰 관리 헬퍼 ─────────────────────────────────
const TokenManager = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setAccessToken: (token) => {
    if (token) localStorage.setItem('accessToken', token);
  },
  setTokens: ({ accessToken, refreshToken }) => {
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  },
  clear: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

// ─── Axios 인스턴스 생성 유틸 ────────────────────────
const createApiInstance = (baseURL, options = {}) =>
  axios.create({
    baseURL,
    timeout: REQUEST_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

/** 토큰이 필요 없는 기본 API 인스턴스 */
const publicApi = createApiInstance(PUBLIC_API_BASE_URL);

/** 토큰이 필요한 인증 API 인스턴스 */
const privateApi = createApiInstance(PRIVATE_API_BASE_URL);

// ─── 강제 로그아웃 처리 ────────────────────────────
const forceLogout = () => {
  TokenManager.clear();
  window.location.href = LOGIN_PATH;
};

// ─── privateApi: 요청 인터셉터 (토큰 자동 첨부) ─────
privateApi.interceptors.request.use(
  (config) => {
    const token = TokenManager.getAccessToken();
    if (token) {
      if (!config.headers) config.headers = {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── privateApi: 응답 인터셉터 (토큰 갱신 + 재요청) ─
let isRefreshing = false;
let pendingRequests = []; // 갱신 중 대기하는 요청 큐

const processQueue = (error, token = null) => {
  pendingRequests.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token);
  });
  pendingRequests = [];
};

privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config: originalRequest } = error;

    // 네트워크 오류 또는 응답 없음
    if (!response) return Promise.reject(error);

    // 401이 아니거나 이미 재시도한 요청이면 그대로 reject
    if (response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      forceLogout();
      return Promise.reject(error);
    }

    // 이미 리프레시 중이면 큐에 넣고 대기
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject });
      }).then((newToken) => {
        if (!originalRequest.headers) originalRequest.headers = {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return privateApi(originalRequest);
      });
    }

    // 리프레시 최초 진입
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // publicApi로 리프레시 호출 (인터셉터 재귀 방지)
      // Authorization 헤더에 refreshToken 전송
      const res = await publicApi.post(
        REFRESH_ENDPOINT,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      // 서버 응답 포맷에 맞게 수정하세요.
      // 예) { success, code, message, data: "<newAccessToken>" }
      // 또는 { accessToken, refreshToken }
      const payload = res?.data;
      const newAccessToken =
        typeof payload?.data === 'string'
          ? payload.data //서버에서 주는 토큰이 { success: true, data: "eyJhbG..." }이런 식일 떄
          : payload?.data?.accessToken || payload?.accessToken;
      //{ success: true, data: { accessToken: "...", refreshToken: "..." } }이거거나
      //{ accessToken: "...", refreshToken: "..." } data자체가 없을 때
      const newRefreshToken = payload?.data?.refreshToken || payload?.refreshToken;

      if (!newAccessToken) {
        throw new Error('리프레시 응답에 토큰이 없습니다.');
      }

      TokenManager.setTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });

      processQueue(null, newAccessToken);

      if (!originalRequest.headers) originalRequest.headers = {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return privateApi(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// ─── 응답 언래핑 유틸 ───────────────────────────────
// 인터셉터 대신 메서드 레이어에서 data 추출
// (인터셉터를 깨끗이 유지해 에러/재시도 흐름을 명확하게)
const unwrap = (promise) => promise.then((res) => res.data);

// ─── 요청 취소 헬퍼 (AbortController) ──────────────
// 사용법:
//   const controller = createCancelToken();
//   APIService.private.get('/users', { signal: controller.signal });
//   controller.abort(); // 요청 취소
export const createCancelToken = () => new AbortController();

// ─── 재시도 헬퍼 (네트워크 에러 시 자동 재시도) ─────
// 사용법:
//   APIService.retry.get('/important-data');
const withRetry = (fn, retries = 2, delay = 1000) => {
  return async (...args) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        const isLastAttempt = attempt === retries;
        // 서버 응답이 있는 에러(4xx/5xx)는 재시도 안 함
        const isRetryable = !error.response || error.code === 'ECONNABORTED';
        if (isLastAttempt || !isRetryable) throw error;
        await new Promise((r) => setTimeout(r, delay * (attempt + 1)));
      }
    }
  };
};

// ─── 통합 서비스 객체 ───────────────────────────────
export const APIService = {
  // 공용 API (토큰 불필요)
  public: {
    get: (url, config = {}) => unwrap(publicApi.get(url, config)),
    post: (url, data = {}, config = {}) => unwrap(publicApi.post(url, data, config)),
    put: (url, data = {}, config = {}) => unwrap(publicApi.put(url, data, config)),
    patch: (url, data = {}, config = {}) => unwrap(publicApi.patch(url, data, config)),
    delete: (url, config = {}) => unwrap(publicApi.delete(url, config)),
  },
  // 인증 API (토큰 자동 첨부 + 401 시 자동 갱신)
  private: {
    get: (url, config = {}) => unwrap(privateApi.get(url, config)),
    post: (url, data = {}, config = {}) => unwrap(privateApi.post(url, data, config)),
    put: (url, data = {}, config = {}) => unwrap(privateApi.put(url, data, config)),
    patch: (url, data = {}, config = {}) => unwrap(privateApi.patch(url, data, config)),
    delete: (url, config = {}) => unwrap(privateApi.delete(url, config)),
  },
  // 재시도가 필요한 중요 요청 (네트워크 불안정 대비)
  retry: {
    get: withRetry((url, config = {}) => unwrap(privateApi.get(url, config))),
    post: withRetry((url, data = {}, config = {}) => unwrap(privateApi.post(url, data, config))),
    put: withRetry((url, data = {}, config = {}) => unwrap(privateApi.put(url, data, config))),
    patch: withRetry((url, data = {}, config = {}) => unwrap(privateApi.patch(url, data, config))),
    delete: withRetry((url, config = {}) => unwrap(privateApi.delete(url, config))),
  },
};

// 토큰 관리자와 인스턴스를 직접 써야 할 경우 대비 export
export { publicApi, privateApi, TokenManager };

// 기본 export (인스턴스 직접 접근용)
export default { public: publicApi, private: privateApi };
