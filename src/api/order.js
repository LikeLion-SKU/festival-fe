import { APIService } from './api';

export const createOrder = (boothId, idempotencyKey, orderData) =>
  APIService.public.post(`/api/booths/${boothId}/orders`, orderData, {
    headers: { 'Idempotency-Key': idempotencyKey },
  });

export const getWaitingMenu = async () => {
  const res = await APIService.private.get('/orders/waiting');

  return res;
};
