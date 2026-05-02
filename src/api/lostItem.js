import { APIService } from './api';

export const getLostItems = ({ date, keyword, page = 1, size = 10 }) =>
  APIService.public.get('/lost-items', {
    params: { date, keyword, page, size },
  });

export const getLostItemDetail = (id) => APIService.public.get(`/lost-items/${id}`);

export const createLostItem = (formData) =>
  APIService.public.post('/lost-items', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateLostItem = (id, formData) =>
  APIService.public.put(`/lost-items/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteLostItem = (id) => APIService.public.delete(`/lost-items/${id}`);
