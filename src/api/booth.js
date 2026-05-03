import { APIService } from './api';

export const getAllBooth = (location) =>
  APIService.public.get('/booths', {
    params: location ? { location } : {},
  });

export const getBoothInfo = (boothId, lang) =>
  APIService.public.get(`/booths/${boothId}`, { params: { lang } });
