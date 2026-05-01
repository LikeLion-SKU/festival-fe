import { APIService } from '@/api/api';

export const getWaitingMenu = async () => {
  const res = await APIService.private.get('/orders/waiting');

  return res;
};
