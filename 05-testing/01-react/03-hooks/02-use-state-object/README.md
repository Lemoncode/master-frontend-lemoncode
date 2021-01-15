# 02 Use State Object

In this example we will create a simple test over a custom hook passing an object.

We will start from `01-use-state`.

# Steps

- `npm install` to install previous sample packages:

```bash
npm install
```

- Let's create a custom hook passing an object:

### ./src/model.ts

```javascript
export interface User {
  name: string;
  surname: string;
}

```

### ./src/user.hooks.ts

```javascript
import * as React from 'react';
import { User } from './model';

export const useUser = (initialUser: User) => {
  const [user, setUser] = React.useState(initialUser);

  return {
    user,
    setUser,
  };
};

```

- Let's add some specs:

### ./src/user.hooks.spec.ts

```javascript
import { renderHook, act } from '@testing-library/react-hooks';
import { useUser } from './user.hooks';

describe('useUser specs', () => {
  it('', () => {
    // Arrange

    // Act

    // Assert

  });
});

```

- should return user with initial values and setUser method when it calls it:

### ./src/user.hooks.spec.ts

```diff
import { renderHook, act } from '@testing-library/react-hooks';
+ import { User } from './model';
import { useUser } from './user.hooks';

describe('useUser specs', () => {
- it('', () => {
+ it('should return user with initial values and setUser method when it calls it', () => {
    // Arrange
+   const initialUser: User = {
+     name: 'John',
+     surname: 'Doe',
+   };

    // Act
+   const { result } = renderHook(() => useUser(initialUser));

    // Assert
+   expect(result.current.user).toEqual(initialUser);
+   expect(result.current.setUser).toEqual(expect.any(Function));
  });
});

```

- should update user when it calls setUser:

### ./src/user.hooks.spec.ts

```diff
...
+ it('should update user when it calls setUser', () => {
+   // Arrange
+   const initialUser: User = {
+     name: 'John',
+     surname: 'Doe',
+   };

+   // Act
+   const { result } = renderHook(() => useUser(initialUser));

+   act(() => {
+     result.current.setUser({
+       name: 'updated name',
+       surname: 'updated surname',
+     });
+   });

+   // Assert
+   expect(result.current.user).toEqual({
+     name: 'updated name',
+     surname: 'updated surname',
+   });
+ });
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
