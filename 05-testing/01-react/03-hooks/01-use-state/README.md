# 01 Use State

In this example we will setup react-hooks-testing-library and create a simple test over a custom hook.

We will start from `00-boilerplate`.

# Steps

- `npm install` to install previous sample packages:

```bash
npm install
```

- Let's install [react-hooks-testing-library](https://github.com/testing-library/react-hooks-testing-library) and [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) as dependency.

```bash
npm install @testing-library/react-hooks react-test-renderer -D
```

- When to use this library? We are writing custom hooks outside components. So let's create a simple custom hook:

### ./src/model.ts

```javascript
export interface User {
  name: string;
  password: string;
}

```

### ./src/login.hooks.ts

```javascript
import React from 'react';
import { User } from './model';

export const useLogin = () => {
  const [user, setUser] = React.useState<User>({ name: '', password: '' });

  return {
    user,
    setUser,
  };
};

```

- It's simple hook, isn't it? Let's create the spec:

### ./src/login.hooks.spec.ts

```javascript
import { renderHook } from '@testing-library/react-hooks';
import { User } from 'model';
import { useLogin } from './login.hooks';

describe('useLogin specs', () => {
  it('', () => {
    // Arrange
    // Act
    // Assert
  });
});

```

- should return an object: user with default values and setUser a function when it calls it:

### ./src/login.hooks.spec.ts

```diff
...

- it('', () => {
+ it('should return an object: user with default values and setUser a function when it calls it', () => {
    // Arrange

    // Act
+   const { result } = renderHook(() => useLogin());

    // Assert
+   const defaultUser: User = { name: '', password: '' };
+   expect(result.current.user).toEqual(defaultUser);
+   expect(result.current.setUser).toEqual(expect.any(Function));
  });
});

```

- should update user when it calls setUser:

### ./src/login.hooks.spec.ts

```diff
...
+ it('should update user when it calls setUser', () => {
+   // Arrange
+   const newUser: User = { name: 'admin', password: 'test' };

+   // Act
+   const { result } = renderHook(() => useLogin());

+   result.current.setUser(newUser);

+   // Assert
+   expect(result.current.user).toEqual(newUser);
+ });

```

- The test passes but we see a warning about to use `act` method.

> [Read more](https://reactjs.org/docs/test-utils.html#act)

### ./src/login.hooks.spec.ts

```diff
- import { renderHook } from '@testing-library/react-hooks';
+ import { renderHook, act } from '@testing-library/react-hooks';
import { User } from 'model';
import { useLogin } from './login.hooks';

...

  it('should update user when it calls setUser', () => {
    // Arrange
    const newUser: User = { name: 'admin', password: 'test' };

    // Act
    const { result } = renderHook(() => useLogin());

+   act(() => {
      result.current.setUser(newUser);
+   });

    // Assert
    expect(result.current.user).toEqual(newUser);
  });

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
