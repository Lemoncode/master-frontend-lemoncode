# 04 Fetch

Let's hop into testing components that get involved asynchronous call execution.

We will start from `03-integration`.

# Steps

- `npm install` to install previous sample packages:

```bash
npm install
```

- Now we will create a file that it will contain a call a remote api that returns a list of names.

### ./src/name-api.ts

```javascript
import Axios from 'axios';

const url = 'https://jsonplaceholder.typicode.com/users';

export const getNameCollection = (): Promise<string[]> =>
  Axios.get(url).then(({ data }) => data.map(user => user.name));
```

- Let's create a component that make use of this api and display that list.

### ./src/name-collection.tsx

```javascript
import * as React from 'react';
import { getNameCollection } from './name-api';

export const NameCollection: React.FunctionComponent = () => {
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

- Now let's use it in the _app.tsx_ file.

### ./src/app.tsx

```diff
import * as React from 'react';
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

- Time to test this async piece :), let's create a file called _name-collection.spec.tsx_

### ./src/name-collection.spec.tsx

```javascript
import * as React from 'react';
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

- should display a list with one item when it mounts the component and it resolves the async call:

### ./src/name-collection.spec.tsx

```diff
import * as React from 'react';
import { render, screen } from '@testing-library/react';
+ import * as api from './name-api';
import { NameCollection } from './name-collection';

describe('NameCollection component specs', () => {
- it('', () => {
+ it('should display a list with one item when it mounts the component and it resolves the async call', async () => {
    // Arrange
+   const getStub = jest
+     .spyOn(api, 'getNameCollection')
+     .mockResolvedValue(['John Doe']);

    // Act
+   render(<NameCollection />);

+   const items = await screen.findAllByRole('listitem');

    // Assert
+   expect(items).toHaveLength(1);
+   expect(getStub).toHaveBeenCalled();
  });
});

```

- How to check if there is no element?

### ./src/name-collection.spec.tsx

```diff
...
  it('should display a list with one item when it mounts the component and it resolves the async call', async () => {
    // Arrange
    const getStub = jest
      .spyOn(api, 'getNameCollection')
      .mockResolvedValue(['John Doe']);

    // Act
    render(<NameCollection />);

+   const itemsBeforeWait = screen.getAllByRole('listitem');
+   expect(itemsBeforeWait).toHaveLength(0);

    const items = await screen.findAllByRole('listitem');

    // Assert
    expect(items).toHaveLength(1);
    expect(getStub).toHaveBeenCalled();
  });
});

```

- If we know it could be null element, we should use `query...` instead of `get...`:

### ./src/name-collection.spec.tsx

```diff
...
-   const itemsBeforeWait = screen.getAllByRole('listitem');
+   const itemsBeforeWait = screen.queryAllByRole('listitem');
    expect(itemsBeforeWait).toHaveLength(0);

    const items = await screen.findAllByRole('listitem');

    // Assert
    expect(items).toHaveLength(1);
    expect(getStub).toHaveBeenCalled();
  });

```

- should display a list with two items when it mounts the component and it resolves the async call:

### ./src/name-collection.spec.tsx

```diff
...

+ it('should display a list with two items when it mounts the component and it resolves the async call', async () => {
+   // Arrange
+   const getStub = jest
+     .spyOn(api, 'getNameCollection')
+     .mockResolvedValue(['John Doe', 'Jane Doe']);

+   // Act
+   render(<NameCollection />);

+   const items = await screen.findAllByRole('listitem');

+   // Assert
+   expect(items).toHaveLength(2);
+   expect(items[0].textContent).toEqual('John Doe');
+   expect(items[1].textContent).toEqual('Jane Doe');
+   expect(getStub).toHaveBeenCalled();
+ });

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
