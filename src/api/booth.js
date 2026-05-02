import { APIService } from './api';

export const getBoothInfo = (boothId, lang) =>
  APIService.public.get(`/booths/${boothId}`, { params: { lang } });
