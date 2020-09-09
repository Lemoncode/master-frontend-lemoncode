import Axios from 'axios';
import { setHeader, headerConstants } from 'core/api';

const url = '/api/security/logout';

export const logout = async (): Promise<boolean> => {
  await Axios.post(url);
  setHeader(headerConstants.authorization, '');
  return true;
};
