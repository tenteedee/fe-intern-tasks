import axios, { AxiosError, AxiosResponse } from 'axios';

export const VITE_APP_API = 'https://nestjs-vercel-197.vercel.app';

export const axiosInstant = axios.create({
  baseURL: VITE_APP_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstant.interceptors.request.use(
  async (config: any) => {
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken);

    // config.headers = {
    //   Authorization: `Bearer ${accessToken}`,
    //   Accept: 'application/json',
    // };
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      console.log('No access token found');
    }
    config.headers['Accept'] = 'application/json';
    return config;
  },
  (error: Error) => {
    Promise.reject(error);
  }
);

const successHandler = async (response: AxiosResponse) => {
  return response;
};

const errorHandler = (error: AxiosError) => {
  const resError: AxiosResponse<any> | undefined = error.response;

  return Promise.reject({ ...resError?.data });
};

let isRefreshing = false;
let failedRequestQueue: Array<(token: string) => void> = [];

const processQueue = (token: string) => {
  failedRequestQueue.forEach((callback) => {
    callback(token);
  });

  failedRequestQueue = [];
};

axiosInstant.interceptors.response.use(
  (response: AxiosResponse) => successHandler(response),
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (!originalRequest.__retry && error.response?.status === 401) {
      originalRequest.__retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const response = await axios.post(
            `${VITE_APP_API}/auth/refresh-token`,
            {
              refreshToken,
            }
          );

          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          axios.defaults.headers.Authorization = `Bearer ${accessToken}`;

          isRefreshing = false;
          processQueue(accessToken);
        } catch (error) {
          isRefreshing = false;
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          errorHandler(error as AxiosError);
        }
      }

      return new Promise((resolve) => {
        failedRequestQueue.push((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axios(originalRequest));
        });
      });
    }
  }
);
