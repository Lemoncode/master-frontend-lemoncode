import axios from 'axios';

export const setHeader = (header: string, value: string) => {
  axios.defaults.headers.common[header] = value;
  sessionStorage.setItem(header, value);
};

export const restoreHeader = (header: string) => {
  const value = sessionStorage.getItem(header);
  if (value) {
    axios.defaults.headers.common[header] = value;
  }
};
