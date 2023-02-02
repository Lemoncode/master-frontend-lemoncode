import { AuthService, UserCredentials } from './auth.service';

xdescribe('AuthService', () => {

  let service: AuthService;

  beforeEach( () => {
    service = new AuthService();
  });

  afterEach( () => {
  });

  it('isLogged() returns true when user logged', () => {
    
  });

  it('isLogged() returns false when user not logged', () => {
    
  });

  it('logout() cleans the localStorage', () => {

  });

  it('login() return true if credentials are correct', () => {
    
  });

  it('login() return false if credentials are incorrect', () => {
    
  });

});
