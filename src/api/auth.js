import { APIService } from './api';

export const login = ({ departmentName, password }) =>
  APIService.public.post('/auth/login', { departmentName, password });

export const logout = () => APIService.private.post('/auth/logout');
