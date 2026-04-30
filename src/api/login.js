import { APIService } from '@/api/api';

export const postLogin = async (departmentName, password) => {
  const res = await APIService.public.post('/auth/login', {
    departmentName,
    password,
  });

  return res;
};
