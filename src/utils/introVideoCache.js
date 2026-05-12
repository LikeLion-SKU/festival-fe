/** MP4 파일명이 바뀌면 버전도 올려서 오래된 캐시와 구분 */
const CACHE_NAME = 'intro-main-mp4-v1';
export const INTRO_VIDEO_PATH = '/video/main-animation-no-audio.mp4';

let memoPlayableUrl = null;
let inflight = null;

function requestKey() {
  return new Request(new URL(INTRO_VIDEO_PATH, globalThis.location.href).toString(), {
    cache: 'default',
    credentials: 'same-origin',
  });
}

/** 같은 JS 세션에서 이미 준비된 `blob:` 또는 폴백 경로 */
export function getIntroVideoPlayableUrlSync() {
  return memoPlayableUrl;
}

/**
 * Cache Storage에 전체 MP4를 넣고 `blob:` URL로 재생.
 * 새로고침·메인 재진입 후에도 `cache.match`로 디스크 캐시에서 꺼내 네트워크 재전송을 막음.
 * `caches` 미지원·오류 시에는 원본 URL로 폴백.
 */
export function ensureIntroVideoPlayableUrl() {
  if (memoPlayableUrl) return Promise.resolve(memoPlayableUrl);
  if (inflight) return inflight;

  const p = (async () => {
    try {
      if (!('caches' in globalThis)) {
        memoPlayableUrl = INTRO_VIDEO_PATH;
        return memoPlayableUrl;
      }
      const cache = await caches.open(CACHE_NAME);
      const key = requestKey();
      let res = await cache.match(key, { ignoreSearch: true });
      if (!res || !res.ok) {
        res = await fetch(key);
        if (!res.ok) {
          memoPlayableUrl = INTRO_VIDEO_PATH;
          return memoPlayableUrl;
        }
        await cache.put(key, res.clone());
      }
      const blob = await res.blob();
      memoPlayableUrl = URL.createObjectURL(blob);
      return memoPlayableUrl;
    } catch {
      memoPlayableUrl = INTRO_VIDEO_PATH;
      return memoPlayableUrl;
    }
  })();

  inflight = p.finally(() => {
    inflight = null;
  });
  return inflight;
}
