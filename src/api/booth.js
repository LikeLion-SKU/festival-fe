import { APIService } from './api';

export const getAllBooth = (location) =>
  APIService.public.get('/booths', {
    params: location ? { location } : {},
  });

export const getBoothInfo = (boothId, lang) =>
  APIService.public.get(`/booths/${boothId}`, { params: { lang } });

export const getBoothOrderMenus = () => APIService.private.get('/booth-menus/all');

export const updateMenuSoldOut = (menuId, soldOut) =>
  APIService.private.patch(`/booth-menus/${menuId}/sold-out`, { soldOut });

export const updateMenuPrice = (menuId, price) =>
  APIService.private.patch(`/booth-menus/${menuId}/price`, { price });
