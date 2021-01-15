# Testeo de servicios

Los servicios en Angular tambien son clases con lo que la técnica de testeo será la habitual en testeo unitario en programación orientada a objetos.

Las dificultades suelen estar en que la mayoría de servicios que programamos en Angular tienen muchas funciones impuras y muchas dependencias de otras clases/servicios.

## Ejemplo

Vamos a testear el servicio _AuthService. Este es su código.

_src/app/services/auth.service.ts_

```typescript
import { Injectable } from '@angular/core';

interface UserCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private lastLoginErrorMessage: string;

  constructor() {}

  login(user: UserCredentials): boolean {
    if (user.username === 'master' && user.password === 'lemoncode') {
      localStorage.setItem('username', user.username);
      localStorage.setItem('token', 'token_simulado');
      return true;
    } else {
      this.lastLoginErrorMessage = 'Credenciales incorrectas';
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  }

  isLogged(): boolean {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }

  getUsername(): string {
    return localStorage.getItem('username');
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  getLastLoginErrorMessage(): string {
    return this.lastLoginErrorMessage;
  }
}

```

Se puede apreciar que todos los métodos interactuan con el exterior (localStorage en este caso) pero que incluso el método getLastLoginErrorMessage() que no interactúa con el exterior tampoco es una función pura.

Hay mucho trabajo de mockeo y de setup.

En este caso para no complicar, no se ha mockeado el localStorage, pero sería buena práctica hacerlo.

_src/app/services/auth.service.spec.ts_

```typescript
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
```

Iríamos añadiendo más tests hasta cubrir todas las especificaciones.

Cuando haya dependencias con otros servicios que haya que mockear, la técnica será siempre la misma:

- mockear las dependencias
- inyectar los mocks en el constructor