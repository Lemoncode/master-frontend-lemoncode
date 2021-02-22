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
import React from 'react';
import Image from 'next/image';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import * as classes from './app.layout.styles';

export const AppLayout: React.FunctionComponent = (props) => {
  const { children } = props;

  return (
    <>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar} variant="dense">
          <IconButton className={classes.iconButton}>
            <Image src="/home-logo.png" layout="fill" objectFit="contain" />
          </IconButton>
          <Typography variant="h6" color="inherit">
            Rent a car
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <Toolbar variant="dense" />
        {children}
      </main>
    </>
  );
};

```

- Where we should place the `UserProvider` to keep state? As we did with theme, the `_app` is the component with the initial 


# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
