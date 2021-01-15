# 04 Component did update

In this example we will create a simple test over a custom hook that it uses `React.useEffect` and updated by param.

We will start from `03-component-did-mount`.

# Steps

- `npm install` to install previous sample packages:

```bash
npm install
```

- Let's create an `api` to retrieve users by filter:

### ./src/api.ts

```javascript
import Axios from 'axios';

const url = 'https://jsonplaceholder.typicode.com/users?name_like=';

export const getUsersByFilter = filter =>
  Axios.get(`${url}${filter}`).then(({ data }) => data);
```

- We will create a new custom hook:

### ./src/filter-user.hooks.ts

```javascript
import * as React from 'react';
import { getUsersByFilter } from './api';

export const useFilterUsers = initialFilter => {
  const [users, setUsers] = React.useState([]);
  const [filter, setFilter] = React.useState(initialFilter);

  React.useEffect(() => {
    getUsersByFilter(filter).then(newUsers => {
      setUsers(newUsers);
    });
  }, [filter]);

  return {
    users,
    setFilter,
  };
};
```

- Let's add some specs:

### ./src/filter-user.hooks.spec.ts

```javascript
import { renderHook, act } from '@testing-library/react-hooks';
import * as api from './api';
import { useFilterUsers } from './filter-user.hooks';

describe('useFilterUsers specs', () => {
  it('', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

- should call getUsersByFilter and update users when it feeds filter equals "doe":

### ./src/filter-user.hooks.spec.ts

```diff
...
- it('', () => {
+ it('should call getUsersByFilter and update users when it feeds filter equals "doe"', async () => {
    // Arrange
+   const filter = 'doe';
+   const getUsersByFilterSpy = jest
+     .spyOn(api, 'getUsersByFilter')
+     .mockResolvedValue(['John Doe', 'Jane Doe']);

    // Act
+   const { result, waitForNextUpdate } = renderHook(() =>
+     useFilterUsers(filter)
+   );

    // Assert
+   expect(result.current.users).toEqual([]);

+   await waitForNextUpdate();

+   expect(getUsersByFilterSpy).toHaveBeenCalledWith('doe');
+   expect(result.current.users).toEqual(['John Doe', 'Jane Doe']);
  });
});

```

- should call getUsersByFilter only one time when it calls filterUsers with same filter two times:

### ./src/filter-user.hooks.spec.ts

```diff
...
+ it('should call getUsersByFilter only one time when it calls filterUsers with same filter two times', async () => {
+   // Arrange
+   const filter = 'doe';
+   const getUsersByFilterSpy = jest
+     .spyOn(api, 'getUsersByFilter')
+     .mockResolvedValue(['John Doe', 'Jane Doe']);

+   // Act
+   const { result, waitForNextUpdate } = renderHook(() =>
+     useFilterUsers(filter)
+   );

+   // Assert
+   expect(result.current.users).toEqual([]);

+   act(() => result.current.setFilter(filter));
+   await waitForNextUpdate();

+   expect(getUsersByFilterSpy).toHaveBeenCalledWith('doe');
+   expect(getUsersByFilterSpy).toHaveBeenCalledTimes(1);
+   expect(result.current.users).toEqual(['John Doe', 'Jane Doe']);
+ });
```

- should call getUsersByFilter two times when it calls filterUsers with different filters:

### ./src/filter-user.hooks.spec.ts

```diff
...
+ it('should call getUsersByFilter two times when it calls filterUsers with different filters', async () => {
+   // Arrange
+   const filter = 'doe';
+   const getUsersByFilterSpy = jest
+     .spyOn(api, 'getUsersByFilter')
+     .mockResolvedValue(['John Doe', 'Jane Doe']);

+   // Act
+   const { result, waitForNextUpdate } = renderHook(() =>
+     useFilterUsers(filter)
+   );

+   // Assert
+   expect(result.current.users).toEqual([]);

+   act(() => result.current.setFilter('smith'));
+   await waitForNextUpdate();

+   expect(getUsersByFilterSpy).toHaveBeenCalledWith('doe');
+   expect(getUsersByFilterSpy).toHaveBeenCalledWith('smith');
+   expect(getUsersByFilterSpy).toHaveBeenCalledTimes(2);
+   expect(result.current.users).toEqual(['John Doe', 'Jane Doe']);
+ });

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
