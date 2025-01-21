import axios from 'axios';
import { UserSession } from './login.api-model';

const url = '/api/security/login';

export const isValidLogin = async (
  user: string,
  password: string
): Promise<UserSession> => {
  const { data } = await axios.post<UserSession>(url, { user, password });
  return data;
};
