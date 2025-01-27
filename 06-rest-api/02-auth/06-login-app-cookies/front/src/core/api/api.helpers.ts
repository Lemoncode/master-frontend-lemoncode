import axios from 'axios';

// https://github.com/axios/axios#config-defaults
export const setHeader = (header: string, value: string) => {
  axios.defaults.headers.common[header] = value;
};
