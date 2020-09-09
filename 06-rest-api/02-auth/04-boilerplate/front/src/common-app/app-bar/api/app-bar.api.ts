import Axios from 'axios';

const url = '/api/security/logout';

export const logout = async (): Promise<boolean> => {
  await Axios.post(url);

  return true;
};
