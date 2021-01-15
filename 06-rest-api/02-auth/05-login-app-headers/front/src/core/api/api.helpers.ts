import Axios from 'axios';

// https://github.com/axios/axios#config-defaults
export const setHeader = (header: string, value: string) => {
  Axios.defaults.headers.common[header] = value;
};
