# 06 Client side rendering

Let's works with Nextjs using client side rendering.

We will start from `05-server-side-rendering`.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

# Client Side Rendering

If we don't need to pre-render the data and frequently updating data.

- Enalbe you to add client-side interactivity.
- Need to use `'use client'` directive.
- You cannot use Server Components inside a client-side component but you can use Server Components as children of a client-side component.
- [More info about Client Components](https://nextjs.org/docs/getting-started/react-essentials#client-components)

Let's look up the api method to book a car:

_./app/cars/\[carId\]/\_api/car.api.ts_

```javascript
...

export const bookCar = async (car: Car): Promise<boolean> => {
  await fetch(`${url}/${car.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car),
  });
  return true;
};

```

And how are we using it:

_./app/cars/\[carId\]/\_components/car.component.tsx_

```javascript
'use client';
import React from 'react';
...

const handleBook = async () => {
    try {
      const apiCar = mapCarFromVmToApi({ ...car, isBooked: !car.isBooked });
      await api.bookCar(apiCar);
      router.push(routeConstants.carList);
    } catch (error) {
      console.error({ error });
    }
  };
...

```

Run:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

> Check 404 on request `http://localhost:8080/cars/undefined/cars/1`
>
> The `image url` is working because we are using the `mapper` in a Server Component.

Why it doesn't work? Because we are using `use client` directive and the environment variable is only available on server side:

_./.env.local_

```diff
IMAGES_DOMAIN=localhost
- BASE_API_URL=http://localhost:3001/api
+ NEXT_PUBLIC_BASE_API_URL=http://localhost:3001/api
BASE_PICTURES_URL=http://localhost:3001

```

_./app/\_core/constants/env.constants.ts_

```diff
export const envConstants = {
- BASE_API_URL: process.env.BASE_API_URL,
+ BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL,
  BASE_PICTURES_URL: process.env.BASE_PICTURES_URL,
};

```

Run again:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

But we have another problem, the car list is not updated after booking a car, we need to refresh the page to see the changes. Let's use [router.refresh](https://nextjs.org/docs/app/api-reference/functions/use-router#userouter):


_./app/cars/\[carId\]/\_components/car.component.tsx_

```diff
...

  const handleBook = async () => {
    try {
      const apiCar = mapCarFromVmToApi({ ...car, isBooked: !car.isBooked });
      await api.bookCar(apiCar);
+     router.refresh();
      router.push(routeConstants.carList);
    } catch (error) {
      console.error({ error });
    }
  };

...

```

Run again:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

On the other hand, we cannot use client-side interactivity in a Server Component but how can we implement a global `React context`?:

_./app/layout.tsx_

```diff
import 'normalize.css';
import './material-icons.css';
import React from 'react';
import { Inter } from 'next/font/google';

+ const ThemeContext = React.createContext(null);

+ const ThemeProvider = ({ children }) => {
+   const darkTheme = {
+     primary: '#001e3c',
+     contrastText: '#ffffff',
+   };
+   const lightTheme = {
+     primary: '#ffffff',
+     contrastText: '#000000',
+   };
+   const [theme, setTheme] = React.useState(lightTheme);

+   const onToggleThemeMode = () => {
+     const newTheme =
+       theme.primary === lightTheme.primary ? darkTheme : lightTheme;
+     setTheme(newTheme);
+   };
+ 
+   return (
+     <ThemeContext.Provider value={{ theme, onToggleThemeMode }}>
+       {children}
+     </ThemeContext.Provider>
+   );
+ };

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

interface Props {
  children: React.ReactNode;
}

const RootLayout = (props: Props) => {
  const { children } = props;
  return (
    <html lang="en" className={inter.className}>
      <body>
-       {children}
+       <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;

```

It throws the error: `TypeError: createContext only works in Client Components. Add the "use client" directive`. But we can use like:

_./app/theme.context.tsx_

```jsx
'use client';
import React from 'react';

interface Context {
  theme: {
    primary: string;
    contrastText: string;
  };
  onToggleThemeMode: () => void;
}

export const ThemeContext = React.createContext<Context>(null);

export const ThemeProvider = ({ children }) => {
  const darkTheme = {
    primary: '#001e3c',
    contrastText: '#ffffff',
  };
  const lightTheme = {
    primary: '#ffffff',
    contrastText: '#000000',
  };
  const [theme, setTheme] = React.useState(lightTheme);

  const onToggleThemeMode = () => {
    const newTheme =
      theme.primary === lightTheme.primary ? darkTheme : lightTheme;
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, onToggleThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

```

> You cannot use a ServerComponent inside Client Component but [you can pass a Server Component as prop](https://nextjs.org/docs/getting-started/react-essentials#nesting-server-components-inside-client-components).

_./app/layout.tsx_

```diff
import 'normalize.css';
import './material-icons.css';
import React from 'react';
import { Inter } from 'next/font/google';
+ import { ThemeProvider } from './theme.context';

- const ThemeContext = React.createContext({});

- const ThemeProvider = ({ children }) => {
-   const darkTheme = {
-     primary: '#001e3c',
-     contrastText: '#ffffff',
-   };
-   const lightTheme = {
-     primary: '#ffffff',
-     contrastText: '#000000',
-   };
-   const [theme, setTheme] = React.useState(lightTheme);

-   const onToggleThemeMode = () => {
-     const newTheme =
-       theme.primary === lightTheme.primary ? darkTheme : lightTheme;
-     setTheme(newTheme);
-   };
- 
-   return (
-     <ThemeContext.Provider value={{ theme, onToggleThemeMode }}>
-       {children}
-     </ThemeContext.Provider>
-   );
- };

...
```

Run again:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

Using theme:

_./app/cars/\_components/nav.component.tsx_

```jsx
'use client';
import { ThemeContext } from '@/theme.context';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Nav: React.FC<Props> = (props) => {
  const { children, className } = props;
  const { theme, onToggleThemeMode } = React.useContext(ThemeContext);
  return (
    <nav
      className={className}
      style={{ backgroundColor: theme.primary, color: theme.contrastText }}
    >
      {children}
      <button style={{ marginLeft: 'auto' }} onClick={onToggleThemeMode}>
        Toggle theme
      </button>
    </nav>
  );
};

```

_./app/cars/\_components/index.ts_

```diff
export * from './car-list.component';
+ export * from './nav.component';

```

_./app/cars/layout.tsx_

```diff
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
+ import { Nav } from './_components';
import classes from './layout.module.css';

interface Props {
  children: React.ReactNode;
}

const CarsLayout = (props: Props) => {
  const { children } = props;
  return (
    <>
-     <nav className={classes.nav}>
+     <Nav className={classes.nav}>
        <Link href="/" className={classes.link}>
          <Image src="/home-logo.png" alt="logo" width="32" height="23" />
        </Link>
        <h1 className={classes.title}>Rent a car</h1>
-     </nav>
+     </Nav>
      <main className={classes.content}>{children}</main>
    </>
  );
};

export default CarsLayout;

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
