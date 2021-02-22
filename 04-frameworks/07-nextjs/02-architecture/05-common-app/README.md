# 05 Common App

Let's move functionality to `common-app` folder.

We will start from `04-pods`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- In this example, we could move `user` functionality to `common-app`, grouping user stuff like:

  - `common/user.context.tsx` > `common-app/user/user.context.tsx`

- Add user `api`:

_./src/common-app/user/user.api.ts_

```javascript
export const login = async (
  email: string,
  password: string
): Promise<string> => {
  if (email === 'john@email.com' && password === 'test') {
    return 'John Doe';
  } else {
    throw new Error('Invalid credentials');
  }
};
```

- Add custom hook:

_./src/common-app/user/user.vm.ts_

```javascript
export interface UserCredential {
  email: string;
  password: string;
}

export const createEmptyUserCredential = (): UserCredential => ({
  email: '',
  password: '',
});

```

_./src/common-app/user/user.hooks.ts_

```javascript
import React from 'react';
import * as api from './user.api';
import { UserContext } from './user.context';
import { UserCredential, createEmptyUserCredential } from './user.vm';

export const useUser = () => {
  const { setUser } = React.useContext(UserContext);
  const [credentials, setCredentials] = React.useState<UserCredential>(
    createEmptyUserCredential()
  );
  const onLogin = async () => {
    const user = await api.login(credentials.email, credentials.password);
    setUser(user);
  };

  return { credentials, setCredentials, onLogin };
};

```

- Add barrel file:

_./src/common-app/user/index.ts_

```javascript
export * from './user.context';
export * from './user.vm';
export * from './user.hooks';

```

- Update `app.layout`:

_./src/layouts/app.layout.tsx_

```diff
...
import IconButton from '@material-ui/core/IconButton';
- import { UserContext } from '../common/contexts';
+ import { UserContext } from 'common-app/user';
...

```

- Update `_app_`:

_./src/pages/\_app_.tsx\_

```diff
import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProviderComponent } from 'core/theme';
- import { UserProvider } from '../common/contexts';
+ import { UserProvider } from 'common-app/user';
...

```

- Update `index` page:

_./src/pages/index.tsx_

```diff
import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
- import { UserContext } from '../common/contexts';
+ import { useUser } from 'common-app/user';

const HomePage = () => {
- const { setUser } = React.useContext(UserContext);
+ const { credentials, setCredentials, onLogin } = useUser();

- React.useEffect(() => {
-   // After login
-   setUser('John');
- }, []);
+ const handleCredentials = () => {
+   setCredentials({
+     email: 'john@email.com',
+     password: 'test',
+   });
+ };

  return (
    <>
      <Head>
        <title>Rent a car - Home</title>
      </Head>
-     <h2>Hello from Nextjs</h2>
+     <h2>Hello {credentials.email}</h2>
+     <button onClick={() => handleCredentials()}>Add credentials</button>
+     <button onClick={() => onLogin()}>Login</button>
      <Link href="/cars">Navigate to car list</Link>
    </>
  );
};

export default HomePage;

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
