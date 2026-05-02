import { APIService } from './api';

export const getLostItems = ({ foundDate, name, page = 0, size = 4 }) =>
  APIService.public.get('/lost-items', {
    params: { foundDate, name, page, size },
  });

export const getLostItemDetail = (id) => APIService.public.get(`/lost-items/${id}`);

export const createLostItem = (formData) =>
  APIService.private.post('/lost-items', formData, {
    timeout: 60000,
    headers: { 'Content-Type': null },
  });

export const updateLostItem = (id, formData) =>
  APIService.private.put(`/lost-items/${id}`, formData, {
    timeout: 60000,
    headers: { 'Content-Type': null },
  });

export const updateLostItemStatus = (id, returned) =>
  APIService.private.patch(`/lost-items/${id}/status`, null, { params: { returned } });

export const deleteLostItem = (id) => APIService.private.delete(`/lost-items/${id}`);
