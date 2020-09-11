import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    service = new AuthService();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('login() return true if credentials are correct', () => {
    const credentials = {
      username: 'master',
      password: 'lemoncode',
    };
    expect(service.login(credentials)).toBeTruthy();
  });

  it('login() return false if credentials are incorrect', () => {
    const credentials = {
      username: 'master',
      password: 'incorrect',
    };
    expect(service.login(credentials)).toBeFalsy();
  });

  it('isLogged() returns true when user logged', () => {
    localStorage.setItem('token', 'some_token');
    expect(service.isLogged()).toBeTruthy();
  });

  it('isLogged() returns false when user not logged', () => {
    expect(service.isLogged()).toBeFalsy();
  });

  it('logout() cleans the localStorage', () => {
    localStorage.setItem('token', 'some_token');
    service.logout();
    expect(localStorage.getItem('token')).toBeFalsy();

  });
});
