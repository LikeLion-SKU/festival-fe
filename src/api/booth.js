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

export const getBoothBusinessInfo = (date) =>
  APIService.private.get('/booths/business-info', { params: date ? { date } : {} });

export const getBoothOperations = (boothId) =>
  APIService.private.get(`/booths/${boothId}/operations`);

export const openBoothStatus = () => APIService.private.patch('/booths/status/open', {});

export const closeBoothStatus = (boothStatus) =>
  APIService.private.patch('/booths/status/close', {}, { params: { boothStatus } });

export const updateBoothOperatingStatus = (status) =>
  APIService.private.patch('/booths/operating-status', { status });
