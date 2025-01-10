import axiosInstance from './../../utils/axios';

export interface LoginParams {
  username: string;
}

export const login = async ({ username }: LoginParams) => {
  const response = await axiosInstance.post('/auth/login', { username });
  const { accessToken, refreshToken } = response.data;

  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);

  return response.data;
};
