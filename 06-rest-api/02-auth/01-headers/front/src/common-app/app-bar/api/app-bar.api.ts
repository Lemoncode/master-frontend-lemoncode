import Axios from 'axios';

const url = '/api/security/logout';

export const logout = async (): Promise<boolean> => {
  // const { data } = await Axios.post(url);
  // return data;
  return true;
};
