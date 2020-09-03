import Axios from 'axios';
import { UserSession } from './login.api-model';

const url = '/api/security/login';

export const isValidLogin = async (
  user: string,
  password: string
): Promise<UserSession> => {
  // const { data } = await Axios.post(url, { user, password });
  // return data;
  // TODO: Add header
  return {
    firstname: 'Francisco',
    lastname: 'Perez',
    token: 'token value',
  };
};
