import Axios from 'axios';
import { headerConstants } from './api.constants';
import { getHeader } from './api.helpers';

export const axiosClient = Axios.create();

axiosClient.interceptors.request.use((config) => {
  config.headers.set(
    headerConstants.authorization,
    getHeader(headerConstants.authorization)
  );
  return config;
});
