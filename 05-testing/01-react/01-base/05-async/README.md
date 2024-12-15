# 05 Async

In this example we are going to learn test async code.

We will start from `04-tdd`.

Summary steps:

- Handle `getMembers` errors.
- Test async code.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

This time, we want to handle `getMembers` errors:

> 403: API rate limit exceeded
> 503: Service unavailable

_./src/api.ts_

```diff
- import Axios from 'axios';
+ import Axios, { AxiosError } from 'axios';
import { Member } from './api-model';

const url = 'https://api.github.com/orgs/lemoncode/members';

export const getMembers = (): Promise<Member[]> =>
- Axios.get(url).then(({ data }) => data);
+ Axios.get(url)
+   .then((response) => response.data)
+   .catch((error: AxiosError) => {
+     switch (error.response.status) {
+       case 403:
+         throw 'Too much Github API calls!';
+       case 503:
+         throw 'Unavailable service';
+     }
+   });

```

Update app:

_./src/app.tsx_

```diff
import React from 'react';
import { getMembers } from './api';
import { mapToMemberVMList } from './mapper';

export const App: React.FunctionComponent = () => {
  React.useEffect(() => {
    getMembers()
      .then(members => {
        console.log(mapToMemberVMList(members));
-     });
+     })
+     .catch(error => console.log(error));
  }, []);

  return <h1>React testing by sample</h1>;
};

```

Let's start to test it:

_./src/api.spec.ts_

```javascript
import { getMembers } from './api';

describe('api specs', () => {
  it('', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

Should return members when it resolves the request successfully:

_./src/api.spec.ts_

```diff
+ import Axios from 'axios';
+ import { Member } from './api-model';
import { getMembers } from './api';

describe('api specs', () => {
- it('', () => {
+ it('should return members when it resolves the request successfully', () => {
    // Arrange
+   const members: Member[] = [
+     {
+       id: 1,
+       login: 'test login',
+       avatar_url: 'test avatar_url',
+     },
+   ];

+   const getStub = vi.spyOn(Axios, 'get').mockResolvedValue({
+     data: members,
+   });

    // Act
+   const result = getMembers();

    // Assert
+   expect(getStub).toHaveBeenCalledWith(
+     'https://api.github.com/orgs/lemoncode/members'
+   );
+   expect(result).toEqual(members);
  });
});

```

Why is it failing? Because it's an async code and we have to tell `vitest` that it has to wait to resolve `promise`:

_./src/api.spec.ts_

```diff
import Axios from 'axios';
import { Member } from './api-model';
import { getMembers } from './api';

describe('api specs', () => {
- it('should return members when it resolves the request successfully', () => {
+ it('should return members when it resolves the request successfully', async () => {
    // Arrange
    const members: Member[] = [
      {
        id: 1,
        login: 'test login',
        avatar_url: 'test avatar_url',
      },
    ];

    const getStub = vi.spyOn(Axios, 'get').mockResolvedValue({
      data: members,
    });

    // Act
-   const result = getMembers();
+   const result = await getMembers();

    // Assert
    expect(getStub).toHaveBeenCalledWith(
      'https://api.github.com/orgs/lemoncode/members'
    );
    expect(result).toEqual(members);
  });
});

```

> Old way [Done callback](https://vitest.dev/guide/migration.html#done-callback)

Should throw an error with "Too much Github API calls!" when it rejects the request with 403 status code:

_./src/api.spec.ts_

```diff
- import Axios from 'axios';
+ import Axios, { AxiosError } from 'axios';
import { Member } from './api-model';
import { getMembers } from './api';
...

+ it('should throw an error with "Too much Github API calls!" when it rejects the request with 403 status code', async () => {
+   // Arrange
+   const getStub = vi.spyOn(Axios, 'get').mockRejectedValue({
+     response: {
+       status: 403,
+     },
+   } as AxiosError);

+   // Act
+   try {
+     const result = await getMembers();
+   } catch (error) {
+     // Assert
+     expect(getStub).toHaveBeenCalledWith(
+       'https://api.github.com/orgs/lemoncode/members'
+     );
+     expect(error).toEqual('Too much Github API calls!');
+   }
+ });
...

```

Should throw an error with "Unavailable service" when it rejects the request with 503 status code:

_./src/api.spec.ts_

```diff
...

+ it('should throw an error with "Unavailable service" when it rejects the request with 503 status code', async () => {
+   // Arrange
+   const getStub = vi.spyOn(Axios, 'get').mockRejectedValue({
+     response: {
+       status: 503,
+     },
+   } as AxiosError);

+   // Act
+   try {
+     const result = await getMembers();
+   } catch (error) {
+     // Assert
+     expect(getStub).toHaveBeenCalledWith(
+       'https://api.github.com/orgs/lemoncode/members'
+     );
+     expect(error).toEqual('Unavailable service');
+   }
+ });
...

```

Should return undefined when it rejects the request with different status code:

_./src/api.spec.ts_

```diff
...

+ it('should return undefined when it rejects the request with different status code', async () => {
+   // Arrange
+   const getStub = vi.spyOn(Axios, 'get').mockRejectedValue({
+     response: {
+       status: 404,
+     },
+   } as AxiosError);

+   // Act
+   const result = await getMembers();
+   // Assert
+   expect(getStub).toHaveBeenCalledWith(
+     'https://api.github.com/orgs/lemoncode/members'
+   );
+   expect(result).toBeUndefined();
+ });
...

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
