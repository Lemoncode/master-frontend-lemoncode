# 05 Router

In this example we will test components using react-router.

We will start from `04-fetch`.

# Steps

`npm install` to install previous sample packages:

```bash
npm install
```

Create a second page to navigate `user-edit.tsx`

### ./src/user-edit.tsx

```javascript
import React from 'react';
import { useParams } from 'react-router-dom';

type ParamProps = {
  name: string;
};

export const UserEdit: React.FC = (props) => {
  const params = useParams<ParamProps>();
  return <h1>User name: {params.name}</h1>;
};

```

Create `router`:

### ./src/router.tsx

```javascript
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { NameCollection } from './name-collection';
import { UserEdit } from './user-edit';

export const Router: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<NameCollection />} />
        <Route path="users/:name" element={<UserEdit />} />
      </Routes>
    </HashRouter>
  );
};

```

Use it:

### ./src/app.tsx

```diff
import React from 'react';
- import { NameEdit } from './name-edit';
- import { NameCollection } from './name-collection';
+ import { Router } from './router';

export const App: React.FunctionComponent = () => {
  return (
    <>
      <h1>05-Testing / 01 React</h1>
-     <NameEdit />
-     <NameCollection />
+     <Router />
    </>
  );
};

```

Add navigation from `name-collection` component:

### ./src/name-collection.tsx

```diff
import React from 'react';
+ import { Link } from 'react-router-dom';
import { getNameCollection } from './name-api';

...

  return (
    <ul>
      {nameCollection.length === 0 ? (
        <span>No data to display</span>
      ) : (
        nameCollection.map((name) => (
          <li key={name}>
-           {name}
+           <Link to={`/users/${name}`}>{name}</Link>
          </li>
        ))
      )}
    </ul>
  );
};

```

Let's run tests:

```bash
npm run test:watch
```

Why are they broken? Because we need to provide a `render with router` since as we know, `react-testing-library` mount all components:

### ./src/name-collection.spec.tsx

> Note: [testing with react-router](https://testing-library.com/docs/example-react-router)

```diff
import React from 'react';
+ import { HashRouter, Routes, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import * as api from './name-api';
+ import { UserEdit } from './user-edit';
import { NameCollection } from './name-collection';

+ const renderWithRouter = (component) =>
+   render(
+     <HashRouter>
+       <Routes>
+         <Route path="/" element={component} />
+         <Route path="users/:name" element={<UserEdit />} />
+       </Routes>
+     </HashRouter>
+   );

...
    // Act
-   render(<NameCollection />);
+   renderWithRouter(<NameCollection />);
    ...
  });

  it('should remove no data description when it mounts the component and it resolves the async call', async () => {
    ...

    // Act
-   render(<NameCollection />);
+   renderWithRouter(<NameCollection />);

    ...
  });
});

```

Should navigate to second user edit page when click in second user name:

### ./src/name-collection.spec.tsx

```diff
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
+ import userEvent from '@testing-library/user-event';
import * as api from './name-api';
import { UserEdit } from './user-edit';
import { NameCollection } from './name-collection';

...

+ it('should navigate to second user edit page when click in second user name', async () => {
+   // Arrange
+   const getStub = jest
+     .spyOn(api, 'getNameCollection')
+     .mockResolvedValue(['John Doe', 'Jane Doe']);

+   // Act
+   renderWithRouter(<NameCollection />);

+   const links = await screen.findAllByRole('link');

+   const secondUser = links[1];
+   await userEvent.click(secondUser);

+   const userEditElement = screen.getByRole('heading', {
+     name: 'User name: Jane Doe',
+   });

+   // Assert
+   expect(userEditElement).toBeInTheDocument();
+ });

...

```

> NOTE: we could use screen.debug() to check DOM changes:

```diff
...
    const links = await screen.findAllByRole('link');

+   screen.debug()

    const secondUser = links[1];
    await userEvent.click(secondUser);

+   screen.debug()

    const userEditElement = screen.getByRole('heading', {
      name: 'User name: Jane Doe',
    });
...
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
