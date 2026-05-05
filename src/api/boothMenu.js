import { APIService } from './api';

export const getOrderAvailableMenus = (boothId) => {
  const lang = sessionStorage.getItem('language') || 'KO';
  return APIService.public.get(`/booths/${boothId}/menus/order-available`, { params: { lang } });
};
