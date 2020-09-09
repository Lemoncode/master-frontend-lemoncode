export const setHeader = (header: string, value: string) => {
  localStorage.setItem(header, value);
};

export const getHeader = (header: string) => localStorage.getItem(header);
