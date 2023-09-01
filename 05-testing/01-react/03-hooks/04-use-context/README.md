# 04 Use context

In this example we will create a simple test over a custom hook that it will use the `React Context API`.

We will start from `03-component-unmount`.

# Steps

`npm install` to install previous sample packages:

```bash
npm install
```

Let's create `ThemeContext`:

### ./src/theme.context.tsx

```javascript
import React from 'react';

interface Theme {
  primaryColor: string;
}

interface Context {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = React.createContext<Context>({
  theme: null,
  setTheme: () => {
    console.warn('Provider is not initialized');
  },
});

interface Props {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<Props> = (props) => {
  const [theme, setTheme] = React.useState<Theme>({
    primaryColor: 'white',
  });

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

```

If we want to use this `context`, we have to write something like this on top of our app:

```
<ThemeProvider>
....
</ThemeProvider>
```

And then use it like:

### ./src/theme.hooks.ts

```javascript
import React from 'react';
import { ThemeContext } from './theme.context';

export const useTheme = () => {
  const { theme, setTheme } = React.useContext(ThemeContext);

  const onChangeLightTheme = () => {
    setTheme({ primaryColor: 'white' });
  };

  const onChangeDarkTheme = () => {
    setTheme({ primaryColor: 'black' });
  };

  return {
    theme,
    onChangeLightTheme,
    onChangeDarkTheme,
  };
};

```

Let's add some specs:

### ./src/theme.hooks.spec.ts

```javascript
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './theme.hooks';

describe('useTheme specs', () => {
  it('', () => {
    // Arrange

    // Act

    // Assert

  });
});

```

Should return a theme equals `{ primaryColor: "black" }` when it renders the hook and calls to onChangeDarkTheme:

### ./src/theme.hooks.spec.ts

```diff
...
- it('', () => {
+ it('should return a theme equals { primaryColor: "black" } when it renders the hook and calls to onChangeDarkTheme', () => {
    // Arrange

    // Act
+   const { result } = renderHook(() => useTheme());

+   act(() => {
+     result.current.onChangeDarkTheme();
+   })

    // Assert
+   expect(result.current.theme).toEqual({ primaryColor: 'black' });
  });
});

```

What is going on? That is because we have to initialize the `Provider` when we use a `Context`. IMPORTANT, rename to `tsx` and stop/start tests again (npm run test:watch):

### ./src/theme.hooks.spec.tsx

```diff
+ import React from 'react';
import { renderHook, act } from '@testing-library/react';
+ import { ThemeProvider } from './theme.context';
import { useTheme } from './theme.hooks';

describe('useTheme specs', () => {
  it('should return a theme equals { primaryColor: "black" } when it renders the hook and calls to onChangeDarkTheme', () => {
    // Arrange
+   const provider = props => (
+     <ThemeProvider>{props.children}</ThemeProvider>
+   );

    // Act
-   const { result } = renderHook(() => useTheme());
+   const { result } = renderHook(() => useTheme(), { wrapper: provider });

    act(() => {
      result.current.onChangeDarkTheme();
    });

    // Assert
    expect(result.current.theme).toEqual({ primaryColor: 'black' });
  });
});

```

> Maybe you could have some error due to file rename. Stop and run it again (npm run test:watch).

Or using ThemeProvider. We can rename to `.ts` again:

### ./src/theme.hooks.spec.ts

```diff
- import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider } from './theme.context';
import { useTheme } from './theme.hooks';

describe('useTheme specs', () => {
  it('should return a theme equals { primaryColor: "black" } when it renders the hook and calls to onChangeDarkTheme', () => {
    // Arrange
-   const provider = props => (
-     <ThemeProvider>{props.children}</ThemeProvider>
-   );

    // Act
-   const { result } = renderHook(() => useTheme(), { wrapper: provider });
+   const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });

    act(() => {
      result.current.onChangeDarkTheme();
    });

    // Assert
    expect(result.current.theme).toEqual({ primaryColor: 'black' });
  });
});

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
