# 02 Fetch

In this example we will create a simple test over a custom hook that it uses `React.useEffect`.

We will start from `01-use-state`.

# Steps

`npm install` to install previous sample packages:

```bash
npm install
```

Now, we will simulate the `login` method, but first let's create the user's model:

_./src/model.ts_

```diff
export interface Credential {
  name: string;
  password: string;
}

+ export interface User {
+   email: string;
+   role: string;
+ }

```

Create api method:

_./src/api.ts_

```javascript
import { Credential, User } from './model';

// TODO: Implement real login method on backend server
export const login = (credential: Credential): Promise<User> => {
  return Promise.reject('Pending to implement');
};
```

Let's update `useLogin` hook to use `React.useEffect`:

_./src/login.hooks.ts_

```diff
import React from 'react';
+ import * as api from './api';
- import { Credential } from './model';
+ import { Credential, User } from './model';

export const useLogin = () => {
  const [credential, setCredential] = React.useState<Credential>({
    name: '',
    password: '',
  });
+ const [user, setUser] = React.useState<User>(null);

+ const onLogin = () => {
+   api.login(credential).then((newUser) => {
+     setUser(newUser);
+   });
+ };

  return {
    credential,
    setCredential,
+   user,
+   onLogin,
  };
};

```

Should return user equals null and onLogin function:

_./src/login.hooks.spec.ts_

```diff
...

+ it('should return user equals null and onLogin function', () => {
+   // Arrange

+   // Act
+   const { result } = renderHook(() => useLogin());

+   // Assert
+   expect(result.current.user).toBeNull();
+   expect(result.current.onLogin).toEqual(expect.any(Function));
+ });

```

Should update user when it send valid credentials using onLogin:

_./src/login.hooks.spec.ts_

```diff
import { renderHook, act } from '@testing-library/react';
+ import * as api from './api';
- import { Credential } from './model';
+ import { Credential, User } from './model';
import { useLogin } from './login.hooks';

...

+ it('should update user when it send valid credentials using onLogin', () => {
+   // Arrange
+   const adminUser: User = { email: 'admin@email.com', role: 'admin' };
+   vi.spyOn(api, 'login').mockResolvedValue(adminUser);

+   // Act
+   const { result } = renderHook(() => useLogin());

+   act(() => {
+     result.current.onLogin();
+   });

+   // Assert
+   expect(api.login).toHaveBeenCalled();
+   expect(result.current.user).toEqual(adminUser);
+ });

```

Why does current spec fail? Because we have to `wait` until async call will be resolved:

_./src/login.hooks.spec.ts_

```diff
- import { renderHook, act } from '@testing-library/react';
+ import { renderHook, act, waitFor } from '@testing-library/react';
import * as api from './api';
import { Credential, User } from './model';
import { useLogin } from './login.hooks';
...

- it('should update user when it send valid credentials using onLogin', () => {
+ it('should update user when it send valid credentials using onLogin', async () => {
    // Arrange
    const adminUser: User = { email: 'admin@email.com', role: 'admin' };
    vi.spyOn(api, 'login').mockResolvedValue(adminUser);

    // Act
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.onLogin();
    });

    // Assert
    expect(api.login).toHaveBeenCalled();
+   await waitFor(() => {
      expect(result.current.user).toEqual(adminUser);
+   });
  });
  ...

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
