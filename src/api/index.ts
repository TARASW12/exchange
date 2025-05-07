import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
  } from 'axios';
import Constants from 'expo-constants';

export const {
  COIN_LAYER_ACCESS_KEY,
  API_BASE_URL,
  API_TIMEOUT
} = Constants.expoConfig!.extra as {
  COIN_LAYER_ACCESS_KEY: string,
  API_BASE_URL: string,
  API_TIMEOUT: string
};


const parsedTimeout = parseInt(API_TIMEOUT, 10);

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: !isNaN(parsedTimeout) ? parsedTimeout : 10000,
});

if (COIN_LAYER_ACCESS_KEY) {
  axiosInstance.defaults.params = axiosInstance.defaults.params || {};
  axiosInstance.defaults.params['access_key'] = COIN_LAYER_ACCESS_KEY;
} else {
  console.warn('COIN_LAYER_ACCESS_KEY is not defined. API calls may fail.');
}

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

export const ApiUtil = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config).then(responseBody),

  post: <T>(url: string, body: any, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, body, config).then(responseBody),
};


export default axiosInstance;
