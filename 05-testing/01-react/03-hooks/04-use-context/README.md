# 06 Use context

In this example we will create a simple test over a custom hook that it will use the `React Context API`.

We will start from `05-component-unmount`.

# Steps

- `npm install` to install previous sample packages:

```bash
npm install
```

- Let's create `languageContext`:

### ./src/language.context.tsx

```javascript
import React from 'react';

interface Context {
  language: string;
  setLanguage: (language: string) => void;
}

export const LanguageContext = React.createContext<Context>({
  language: '',
  setLanguage: () => {
    console.warn('Provider is not initialized');
  },
});

export const LanguageProvider: React.FunctionComponent = props => {
  const [language, setLanguage] = React.useState('es');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {props.children}
    </LanguageContext.Provider>
  );
};

```

- If we want to use this `context`, we have to write something like this on top of our app:

```
<LanguageProvider>
....
</LanguageProvider>
```

- And then use it like:

### ./src/language.hooks.ts

```javascript
import React from 'react';
import { LanguageContext } from './language.context';

export const useLanguage = () => {
  const [message, setMessage] = React.useState('');
  const { language, setLanguage } = React.useContext(LanguageContext);

  React.useEffect(() => {
    setMessage(`The current language is: ${language}`);
  }, [language]);

  return {
    message,
    setLanguage,
  };
};

```

- Let's add some specs:

### ./src/language.hooks.spec.ts

```javascript
import { renderHook } from '@testing-library/react-hooks';
import { useLanguage } from './language.hooks';

describe('useLanguage specs', () => {
  it('', () => {
    // Arrange

    // Act

    // Assert

  });
});

```

- should return a message with language equals "en" when it renders the hook:

### ./src/language.hooks.spec.ts

```diff
- import { renderHook } from '@testing-library/react-hooks';
+ import { renderHook, act } from '@testing-library/react-hooks';
...
- it('', () => {
+ it('should return a message with language equals "en" when it renders the hook', () => {
    // Arrange

    // Act
+   const { result } = renderHook(() => useLanguage());

+   act(() => {
+     result.current.setLanguage('en');
+   })

    // Assert
+   expect(result.current.message).toEqual('The current language is: en');
  });
});

```

- What is going on? That is because we have to initialize the `Provider` when we use a `Context`. IMPORTANT, rename to `tsx`:

### ./src/language.hooks.spec.tsx

```diff
+ import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
+ import { LanguageProvider } from './language.context';
import { useLanguage } from './language.hooks';

describe('useLanguage specs', () => {
  it('should return a message with language equals "en" when it renders the hook', () => {
    // Arrange
+   const provider: React.FunctionComponent = props => (
+     <LanguageProvider>{props.children}</LanguageProvider>
+   );

    // Act
-   const { result } = renderHook(() => useLanguage());
+   const { result } = renderHook(() => useLanguage(), { wrapper: provider });

    act(() => {
      result.current.setLanguage('en');
    });

    // Assert
    expect(result.current.message).toEqual('The current language is: en');
  });
});

```

> Maybe you could have some error due to file rename. Stop and run it again (npm run test:watch).

- Or using LanguageProvider. We can rename to `.ts` again:

### ./src/language.hooks.spec.tsx

```diff
- import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { LanguageProvider } from './language.context';
import { useLanguage } from './language.hooks';

describe('useLanguage specs', () => {
  it('should return a message with language equals "en" when it renders the hook', () => {
    // Arrange
-   const provider: React.FunctionComponent = props => (
-     <LanguageProvider>{props.children}</LanguageProvider>
-   );

    // Act
-   const { result } = renderHook(() => useLanguage(), { wrapper: provider });
+   const { result } = renderHook(() => useLanguage(), { wrapper: LanguageProvider });

    act(() => {
      result.current.setLanguage('en');
    });

    // Assert
    expect(result.current.message).toEqual('The current language is: en');
  });
});

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
