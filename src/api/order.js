import { APIService, publicApi } from './api';

export const createOrder = (boothId, idempotencyKey, orderData) =>
  APIService.public.post(`/booths/${boothId}/orders`, orderData, {
    headers: { 'Idempotency-Key': idempotencyKey },
  });

export const getWaitingMenu = async () => {
  const res = await APIService.private.get('/orders/waiting');

  return res;
};

// SSE 구독: 호출자는 반환된 EventSource에 이벤트 리스너를 붙이고,
// 언마운트/탭 변경 시 .close()로 정리해야 함.
// axios 인터셉터를 타지 않으므로, 인증 실패(예: 401)로 연결이 닫히면
// 직접 리프레시를 시도하고, 실패 시 로그인 페이지로 보냄.
export const subscribeOrder = (sseSubscribeType) => {
  const url = `/api/orders/subscribe?sseSubscribeType=${encodeURIComponent(sseSubscribeType)}`;
  const eventSource = new EventSource(url, { withCredentials: true });

  eventSource.addEventListener('error', async () => {
    if (eventSource.readyState !== EventSource.CLOSED) return;
    eventSource.close();
    try {
      await publicApi.post('/auth/refresh');
    } catch {
      window.location.href = '/login';
    }
  });

  return eventSource;
};

export const patchChangeOrderStatus = async (orderId, orderStatus) => {
  const res = APIService.private.patch(
    `/orders/${orderId}/status`,
    {},
    { params: { orderStatus: orderStatus } }
  );

  return res;
};

export const patchCanCelOrder = async (orderId, orderCancelReason) => {
  const res = APIService.private.patch(
    `/orders/${orderId}/cancel`,
    {},
    { params: { orderCancelReason: orderCancelReason } }
  );

  return res;
};

export const getCookingMenu = async () => {
  const res = await APIService.private.get('/orders/cooking');

  return res;
};

export const patchServedMenu = async (orderItemUnitId, isServed) => {
  const res = await APIService.private.patch(`/order-item-units/${orderItemUnitId}`, {
    isServed,
  });

  return res;
};

export const getCompleteMenu = async () => {
  const res = await APIService.private.get('/orders/completed');

  return res;
};

export const getSales = async (date) => {
  const res = await APIService.private.get('/orders/sales', { params: { date: date } });

  return res;
};

export const getCancelMenu = async () => {
  const res = await APIService.private.get('/orders/canceled');

  return res;
};
