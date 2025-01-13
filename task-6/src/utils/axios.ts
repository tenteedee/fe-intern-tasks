import axios, { AxiosError, AxiosResponse } from 'axios';

export const VITE_APP_API = 'https://nestjs-vercel-197.vercel.app';

export const axiosInstance = axios.create({
  baseURL: VITE_APP_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedRequestQueue: Array<(token: string) => void> = [];

const processQueue = (token: string | null) => {
  if (token) {
    failedRequestQueue.forEach((callback) => {
      callback(token);
    });
  } else {
    failedRequestQueue = [];
  }
  failedRequestQueue = [];
};

axiosInstance.interceptors.request.use(
  async (config: any) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    config.headers['Accept'] = 'application/json';
    //console.log('Request Config:', config); // Kiểm tra cấu hình request
    return config;
  },
  (error: Error) => {
    return Promise.reject(error);
  }
);

const successHandler = async (response: AxiosResponse) => {
  //console.log('Response Data:', response.data);
  return response;
};

const errorHandler = (error: AxiosError) => {
  const resError: AxiosResponse<any> | undefined = error.response;
  console.error('Response Error:', error.response?.data || error.message);
  return Promise.reject({ ...resError?.data });
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => successHandler(response),
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (!originalRequest.__retry && error.response?.status === 401) {
      originalRequest.__retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token found');
          }

          const response = await axios.post(
            `${VITE_APP_API}/auth/refresh-token`,
            {
              refreshToken,
            }
          );

          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);

          axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;

          isRefreshing = false;
          processQueue(accessToken);
        } catch (err) {
          isRefreshing = false;
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        failedRequestQueue.push((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    return errorHandler(error);
  }
);

export default axiosInstance;
