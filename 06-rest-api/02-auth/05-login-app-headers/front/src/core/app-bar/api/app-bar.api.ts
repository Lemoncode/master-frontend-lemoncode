import axios from 'axios';
import { setHeader, headerConstants } from '#core/api';

const url = 'http://localhost:3000/api/security/logout';

export const logout = async (): Promise<boolean> => {
  await axios.post(url);
  setHeader(headerConstants.authorization, '');

  return true;
};
