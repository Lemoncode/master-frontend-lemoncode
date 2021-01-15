# 03 Component did mount

In this example we will create a simple test over a custom hook that it uses `React.useEffect`.

We will start from `02-use-state-object`.

# Steps

- `npm install` to install previous sample packages:

```bash
npm install
```

- Let's update `useUser` hook to use `React.useEffect`:

### ./src/user.hooks.ts

```diff
import * as React from 'react';
import { User } from './model';

export const useUser = (initialUser: User) => {
  const [user, setUser] = React.useState(initialUser);

+ React.useEffect(() => {
+   // Simulate async call
+   setTimeout(() => {
+     setUser({ name: 'Jane', surname: 'Smith' });
+   }, 500);
+ }, []);

  return {
    user,
    setUser,
  };
};

```

- Why does not current spec fail? Because we have to `wait` until async call will be resolved:

### ./src/user.hooks.spec.ts

```diff
...
- it('should return user with initial values and setUser method when it calls it', () => {
+ it('should return user with initial values and setUser method when it calls it', async () => {
    // Arrange
    const initialUser: User = {
      name: 'John',
      surname: 'Doe',
    };

    // Act
-   const { result } = renderHook(() => useUser(initialUser));
+   const { result, waitForNextUpdate } = renderHook(() =>
+     useUser(initialUser)
+   );

    // Assert
    expect(result.current.user).toEqual(initialUser);
    expect(result.current.setUser).toEqual(expect.any(Function));

+   await waitForNextUpdate();

+   const updatedUser: User = {
+     name: 'Jane',
+     surname: 'Smith',
+   };
+   expect(result.current.user).toEqual(updatedUser);
  });
  ...

```

- Update second spec:

### ./src/user.hooks.spec.ts

```diff
...
- it('should update user when it calls setUser', () => {
+ it('should update user when it calls setUser', async () => {
    // Arrange
    const initialUser: User = {
      name: 'John',
      surname: 'Doe',
    };

    // Act
-   const { result } = renderHook(() => useUser(initialUser));
+   const { result, waitForNextUpdate } = renderHook(() =>
+     useUser(initialUser)
+   );

+   await waitForNextUpdate();

    act(() => {
      result.current.setUser({
        name: 'updated name',
        surname: 'updated surname',
      });
    });

    // Assert
    expect(result.current.user).toEqual({
      name: 'updated name',
      surname: 'updated surname',
    });
  });
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
