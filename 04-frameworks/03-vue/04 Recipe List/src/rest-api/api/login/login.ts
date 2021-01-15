import { Login } from '../../model';

export const loginRequest = (login: Login): Promise<boolean> => (
  isValidLogin(login) ?
    Promise.resolve(true) :
    Promise.reject('Not valid login')
);

const isValidLogin = (login: Login) => (
  login.name === 'admin' &&
  login.password === 'test'
);
