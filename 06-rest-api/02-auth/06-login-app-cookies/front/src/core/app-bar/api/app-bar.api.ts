import axios from 'axios';
import { setHeader, headerConstants } from '#core/api';

const url = '/api/security/logout';

export const logout = async (): Promise<boolean> => {
  await axios.post(url);
  setHeader(headerConstants.authorization, '');

  return true;
};
