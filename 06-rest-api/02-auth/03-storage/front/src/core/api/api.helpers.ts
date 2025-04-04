import axios from 'axios';

export const setHeader = (header: string, value: string) => {
  axios.defaults.headers.common[header] = value;
  localStorage.setItem(header, value);
};

export const restoreHeader = (header: string) => {
  const value = localStorage.getItem(header);
  if (value) {
    axios.defaults.headers.common[header] = value;
  }
};
