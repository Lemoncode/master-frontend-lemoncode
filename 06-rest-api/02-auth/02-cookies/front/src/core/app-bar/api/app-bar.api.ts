import axios from 'axios';

const url = '/api/security/logout';

export const logout = async (): Promise<boolean> => {
  await axios.post(url);

  return true;
};
