import { APIService } from './api';

export const createOrder = (boothId, idempotencyKey, orderData) =>
  APIService.public.post(`/api/booths/${boothId}/orders`, orderData, {
    headers: { 'Idempotency-Key': idempotencyKey },
  });

export const getWaitingMenu = async () => {
  const res = await APIService.private.get('/orders/waiting');

  return res;
};

// SSE 구독: 호출자는 반환된 EventSource에 이벤트 리스너를 붙이고,
// 언마운트/탭 변경 시 .close()로 정리해야 함.
export const subscribeOrder = (sseSubscribeType) => {
  const url = `/api/orders/subscribe?sseSubscribeType=${encodeURIComponent(sseSubscribeType)}`;
  return new EventSource(url, { withCredentials: true });
};
