import { APIService } from '@/api/api';

export const postLogin = async (departmentName, password) => {
  try {
    const res = APIService.public.post('/auth/login', {
      departmentName,
      password,
    });

    return res;
  } catch (error) {
    console.log('로그인 실패' + error);
  }
};
