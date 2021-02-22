# 08 Context

Let's works with Nextjs using React Context.

We will start from `07-client-side-rendering`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- Let's create a `user context` which we need to use as global context:

_./src/common/contexts/user.context.tsx_

```javascript
import React from 'react';

interface Context {
  user: string;
  setUser: (user: string) => void;
}

export const UserContext = React.createContext<Context>(null);

export const UserProvider: React.FunctionComponent = (props) => {
  const [user, setUser] = React.useState('');

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
};

```

- Add barrel file:

_./src/common/contexts/index.ts_

```javascript
export * from './user.context';

```

- We want to use `user` value in App bar:

_./src/components/app.layout.ts_

```diff
...
import IconButton from '@material-ui/core/IconButton';
+ import { UserContext } from '../common/contexts';
import * as classes from './app.layout.styles';

export const AppLayout: React.FunctionComponent = (props) => {
  const { children } = props;
+ const { user } = React.useContext(UserContext);
...
          <Typography variant="h6" color="inherit">
            Rent a car
          </Typography>
+         <Typography variant="h6" color="inherit">
+           {user}
+         </Typography>
        </Toolbar>
...

```

_./src/components/app.layout.styles.ts_

```diff
...

export const toolbar = css`
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
  row-gap: 1rem;

+ & > :nth-child(3) {
+   margin-left: auto;
+ }
`;
...
```

- Where we should place the `UserProvider` to keep state? As we did with theme, the [_app](https://nextjs.org/docs/advanced-features/custom-app) is the component  to keep state when navigate between pages:

_./src/pages/\_app.tsx_

```diff
import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProviderComponent } from '../common/theme';
+ import { UserProvider } from '../common/contexts';

const App: React.FunctionComponent<AppProps> = (props) => {
  const { Component, pageProps } = props;

  return (
    <ThemeProviderComponent>
+     <UserProvider>
        <Component {...pageProps} />
+     </UserProvider>
    </ThemeProviderComponent>
  );
};

export default App;

```

- The idea is after user login on `index` page, we want to keep user state as global state:

_./src/pages/index.tsx_

```diff
...

const HomePage = () => {
+ const { setUser } = React.useContext(UserContext);

+ React.useEffect(() => {
+   // After login
+   setUser('John');
+ }, []);

  return (
    <>
      <Head>
...

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
