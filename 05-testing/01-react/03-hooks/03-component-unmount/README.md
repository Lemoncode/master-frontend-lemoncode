# 03 Component unmount

In this example we will create a simple test over a custom hook that it will unsubscribe an event when component will unmount.

We will start from `02-fetch`.

# Steps

`npm install` to install previous sample packages:

```bash
npm install
```

Let's create an `usePolling` custom hook:

_./src/polling.hooks.ts_

```javascript
import React from 'react';

export const usePolling = (pollingTime: number) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    // Simulate calls to api and count it
    const interval = setInterval(() => {
      setCount((c) => c + 1);
    }, pollingTime);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { count };
};
```

> NOTE: [useState functional updates](https://reactjs.org/docs/hooks-reference.html#functional-updates)

Let's add some specs:

_./src/polling.hooks.spec.ts_

```javascript
import { renderHook } from '@testing-library/react';
import { usePolling } from './polling.hooks';

describe('usePolling specs', () => {
  it('', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

Should return count equals 0 when initialize the hook:

_./src/polling.hooks.spec.ts_

```diff
...
- it('', () => {
+ it('should return count equals 0 when initialize the hook', () => {
    // Arrange
+   const pollingTime = 500;

    // Act
+   const { result } = renderHook(() => usePolling(pollingTime));

    // Assert
+   expect(result.current.count).toEqual(0);
  });
});

```

Should return count equals 1 when it waits for next update:

_./src/polling.hooks.spec.ts_

```diff
- import { renderHook } from '@testing-library/react';
+ import { renderHook, waitFor } from '@testing-library/react';
import { usePolling } from './polling.hooks';

...

+ it('should return count equals 1 when it waits for next update', async () => {
+   // Arrange
+   const pollingTime = 500;

+   // Act
+   const { result } = renderHook(() => usePolling(pollingTime));

+   // Assert
+   await waitFor(() => {
+     expect(result.current.count).toEqual(1);
+   });
+ });

```

Should return count equals 3 when it waits 3 times for next update:

_./src/polling.hooks.spec.ts_

```diff
...

+ it('should return count equals 3 when it waits 3 times for next update', async () => {
+   // Arrange
+   const pollingTime = 500;

+   // Act
+   const { result } = renderHook(() => usePolling(pollingTime));

+   // Assert
+   await waitFor(() => {
+     expect(result.current.count).toEqual(3);
+   });
+ });

```

Could we wait until value is three?:

_./src/polling.hooks.spec.ts_

```diff
...
  it('should return count equals 3 when it waits 3 times for next update', async () => {
    // Arrange
    const pollingTime = 500;

    // Act
    const { result } = renderHook(() => usePolling(pollingTime));

    // Assert
    await waitFor(
      () => {
        expect(result.current.count).toEqual(3);
-     }
+     },
+     { timeout: 2000 }
    );
  });

```

Should call clearInterval when it unmounts the component:

_./src/polling.hooks.spec.ts_

```diff
...

+ it('should call clearInterval when it unmounts the component', () => {
+   // Arrange
+   const pollingTime = 500;
+   vi.spyOn(window, 'clearInterval');

+   // Act
+   const { unmount } = renderHook(() => usePolling(pollingTime));

+   // Assert
+   expect(clearInterval).not.toHaveBeenCalled();

+   unmount();
+   expect(clearInterval).toHaveBeenCalled();
+ });

```

If we don't want to wait all `ms` of the pollingTime, we can play with `fakeTimers`:

```diff
...

describe('usePolling specs', () => {
+ beforeEach(() => {
+   vi.useFakeTimers();
+ });

  it('should return count equals 0 when initialize the hook', () => {
...
```

> Using [fake timers](https://vitest.dev/guide/mocking.html#timers)
>
> There is an [issue with `vitest` timers and `react-testing-library`](https://github.com/testing-library/react-testing-library/issues/1197)
>
> [Here we can see a workaround](https://github.com/testing-library/react-testing-library/issues/1197#issuecomment-1693824628)

Update the `setup` file:

_./src/config/test/setup.ts_

```diff
import '@testing-library/jest-dom/vitest';

+ // Workaround to fix vitest timers for `waitFor` in `@testing-library/react`
+ // Issue: https://github.com/testing-library/react-testing-library/issues/1197
+ globalThis.jest = {
+   ...globalThis.jest,
+   advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
+ };

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
