import axios from 'axios';

axios.interceptors.request.use(
  (config) => {
    const prefix = window.blocklet ? window.blocklet.prefix : '/';
    config.baseURL = prefix || '';
    config.timeout = 200000;

    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => {
    if (response?.data?.code === 0) {
      return Promise.resolve(response?.data);
    }

    throw new Error(response?.data?.error);
  },
  (error) => {
    throw new Error(error?.message);
  }
);

export default axios;
