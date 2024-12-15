# 04 Fetch

Let's hop into testing components that get involved asynchronous call execution.

We will start from `03-integration`.

# Steps

`npm install` to install previous sample packages:

```bash
npm install
```

Now we will create a file that it will contain a call a remote api that returns a list of names.

_./src/name-api.ts_

```javascript
import Axios from 'axios';

const url = 'https://jsonplaceholder.typicode.com/users';

export const getNameCollection = (): Promise<string[]> =>
  Axios.get(url).then(({ data }) => data.map(user => user.name));
```

Let's create a component that make use of this api and display that list.

_./src/name-collection.tsx_

```javascript
import React from 'react';
import { getNameCollection } from './name-api';

export const NameCollection: React.FC = () => {
  const [nameCollection, setNameCollection] = React.useState([]);

  React.useEffect(() => {
    getNameCollection().then(names => {
      setNameCollection(names);
    });
  }, []);

  return (
    <ul>
      {nameCollection.map(name => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
};
```

Now let's use it in the _app.tsx_ file.

_./src/app.tsx_

```diff
import React from 'react';
import { NameEdit } from './name-edit';
+ import { NameCollection } from './name-collection';

export const App: React.FunctionComponent = () => {
  return (
    <>
      <h1>05-Testing / 01 React</h1>
      <NameEdit />
+     <NameCollection />
    </>
  );
};

```

Time to test this async piece :), let's create a file called _name-collection.spec.tsx_

_./src/name-collection.spec.tsx_

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { NameCollection } from './name-collection';

describe('NameCollection component specs', () => {
  it('', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

Should display a list with one item when it mounts the component and it resolves the async call:

_./src/name-collection.spec.tsx_

```diff
import React from 'react';
import { render, screen } from '@testing-library/react';
+ import * as api from './name-api';
import { NameCollection } from './name-collection';

describe('NameCollection component specs', () => {
- it('', () => {
+ it('should display a list with one item when it mounts the component and it resolves the async call', async () => {
    // Arrange
+   vi.spyOn(api, 'getNameCollection').mockResolvedValue(['John Doe']);

    // Act
+   render(<NameCollection />);

+   const items = await screen.findAllByRole('listitem');

    // Assert
+   expect(items).toHaveLength(1);
+   expect(api.getNameCollection).toHaveBeenCalled();
  });
});

```

> [Find queries](https://testing-library.com/docs/dom-testing-library/api-async#findby-queries)

How to check if there is no element?

_./src/name-collection.spec.tsx_

```diff
...
  it('should display a list with one item when it mounts the component and it resolves the async call', async () => {
    // Arrange
    vi.spyOn(api, 'getNameCollection').mockResolvedValue(['John Doe']);

    // Act
    render(<NameCollection />);

+   const itemsBeforeWait = screen.getAllByRole('listitem');
+   expect(itemsBeforeWait).toHaveLength(0);

    const items = await screen.findAllByRole('listitem');

    // Assert
    expect(items).toHaveLength(1);
    expect(api.getNameCollection).toHaveBeenCalled();
  });
});

```

If we know it could be null element, we should use `query...` instead of `get...`:

_./src/name-collection.spec.tsx_

```diff
...
-   const itemsBeforeWait = screen.getAllByRole('listitem');
+   const itemsBeforeWait = screen.queryAllByRole('listitem');
    expect(itemsBeforeWait).toHaveLength(0);

    const items = await screen.findAllByRole('listitem');

    // Assert
    expect(items).toHaveLength(1);
    expect(api.getNameCollection).toHaveBeenCalled();
  });

```

> [Query](https://testing-library.com/docs/guide-disappearance/#asserting-elements-are-not-present)

Sometimes, we need to wait for some element to be removed and check it:

_./src/name-collection.tsx_

```diff
...

  return (
    <ul>
-     {nameCollection.map(name => (
-       <li key={name}>{name}</li>
-     ))}
+     {nameCollection.length === 0 ? (
+       <span>No data to display</span>
+     ) : (
+       nameCollection.map((name) => <li key={name}>{name}</li>)
+     )}
    </ul>
  );
};

```

_./src/name-collection.spec.tsx_

```diff
import React from 'react';
- import { render, screen } from '@testing-library/react';
+ import { render, screen, waitFor } from '@testing-library/react';
import * as api from './name-api';
import { NameCollection } from './name-collection';
...

+ it('should remove no data description when it mounts the component and it resolves the async call', async () => {
+     // Arrange
+     vi.spyOn(api, 'getNameCollection').mockResolvedValue(['John Doe']);

+     // Act
+     render(<NameCollection />);

+     expect(screen.getByText('No data to display')).toBeInTheDocument();

+     // Assert
+     await waitFor(() => {
+       expect(screen.queryByText('No data to display')).not.toBeInTheDocument();
+     });
+   });

```

> NOTE: we could use `waitFor` for async code inside components which we cannot check it with `findBy`.

Or using `waitForElementToBeRemoved`:

_./src/name-collection.spec.tsx_

```diff
import React from 'react';
import {
  render,
  screen,
- waitFor,
+ waitForElementToBeRemoved,
} from '@testing-library/react';
import * as api from './name-api';
import { NameCollection } from './name-collection';

...

it('should remove no data description when it mounts the component and it resolves the async call', async () => {
    // Arrange
    vi.spyOn(api, 'getNameCollection').mockResolvedValue(['John Doe']);

    // Act
    render(<NameCollection />);

    expect(screen.getByText('No data to display')).toBeInTheDocument();

    // Assert
-   await waitFor(() => {
-     expect(screen.queryByText('No data to display')).not.toBeInTheDocument();
-   });
+   await waitForElementToBeRemoved(screen.queryByText('No data to display'));
  });

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
