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

### ./src/name.hooks.ts

```javascript
import * as React from 'react';

export const useName = () => {
  const [name, setName] = React.useState('John Doe');

  return {
    name,
    setName,
  };
};
```

- It's simple hook, isn't it? Let's create the spec:

### ./src/name.hooks.spec.ts

```javascript
import { renderHook } from '@testing-library/react-hooks';
import { useName } from './name.hooks';

describe('useName specs', () => {
  it('', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

- should return an object with name equals "John Doe" and setName a function when it calls it:

### ./src/name.hooks.spec.ts

```diff
...

- it('', () => {
+ it('should return an object with name equals "John Doe" and setName a function when it calls it', () => {
    // Arrange

    // Act
+   const { result } = renderHook(() => useName());

    // Assert
+   expect(result.current.name).toEqual('John Doe');
+   expect(result.current.setName).toEqual(expect.any(Function));
  });
});

```

- should update name when it calls setName:

### ./src/name.hooks.spec.ts

```diff
...
+ it('should update name when it calls setName', () => {
+   // Arrange
+   const newName = 'updated name';

+   // Act
+   const { result } = renderHook(() => useName());

+   result.current.setName(newName);

+   // Assert
+   expect(result.current.name).toEqual('updated name');
+ });

```

- The test passes but we see a warning about to use `act` method.

> [Read more](https://reactjs.org/docs/test-utils.html#act)

### ./src/name.hooks.spec.ts

```diff
- import { renderHook } from '@testing-library/react-hooks';
+ import { renderHook, act } from '@testing-library/react-hooks';
import { useName } from './useName';

...
  it('should update name when it calls setName', () => {
    // Arrange
    const newName = 'updated name';

    // Act
    const { result } = renderHook(() => useName());

+   act(() => {
      result.current.setName(newName);
+   });

    // Assert
    expect(result.current.name).toEqual('updated name');
  });

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
