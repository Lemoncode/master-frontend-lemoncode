import { axiosClient } from 'core/api';
import { setHeader, headerConstants } from 'core/api';

const url = '/api/security/logout';

export const logout = async (): Promise<boolean> => {
  await axiosClient.post(url);
  setHeader(headerConstants.authorization, '');

  return true;
};
