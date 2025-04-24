# 04 TDD

In this example we are going to apply Test Driven Development while we are implementing the app.

We will start from `03-debug`.

Summary steps:

- Create the unit test before implementation.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

Let's remove all `calculator` stuff.

- `./src/business/calculator.business.ts`
- `./src/business/index.ts`
- `./src/calculator.spec.ts`
- `./src/calculator.ts`
- `./src/second.spec.ts`

Create a simple `app` to retrieve data from `github`:

_./src/api-model.ts_

```javascript
export interface Member {
  id: number;
  login: string;
  avatar_url: string;
}
```

_./src/api.ts_

```javascript
import Axios from 'axios';
import { Member } from './api-model';

const url = 'https://api.github.com/orgs/lemoncode/members';

export const getMembers = (): Promise<Member[]> =>
  Axios.get(url).then((response) => response.data);
```

Let's use it:

_./src/app.tsx_

```diff
import React from 'react';
+ import { getMembers } from './api';

export const App: React.FunctionComponent = () => {
+ React.useEffect(() => {
+   getMembers().then(members => {
+     console.log(members);
+   });
+ }, []);

  return <h1>05-Testing / 01 React</h1>;
};

```

Run it:

```bash
npm start
```

We are retrieving too many properties, let's create a `view-model`:

_./src/view-model.ts_

```javascript
export interface Member {
  id: string;
  login: string;
  avatarUrl: string;
}
```

Run specs:

```bash
npm test
```

What do we need now? We need a `mapper` to map from `api-model` to `view-model`. Since, we are going to apply TDD, we will start from `spec` before:

_./src/mapper.spec.ts_

```javascript
describe('mapper specs', () => {
  it('', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

Should return empty array when it feeds undefined:

_./src/mapper.spec.ts_

```diff
+ import * as apiModel from './api-model';
+ import * as viewModel from './view-model';

describe('mapper specs', () => {
- it('', () => {
+ it('should return empty array when it feeds undefined', () => {
    // Arrange
+   const members: apiModel.Member[] = undefined;

    // Act
+   const result = mapMemberListFromApiToVm(members);

    // Assert
+   const expectedResult: viewModel.Member[] = [];
+   expect(result).toEqual(expectedResult);
  });
});

```

Create the minimum implementation to pass the test:

_./src/mapper.ts_

```javascript
import * as apiModel from './api-model';
import * as viewModel from './view-model';

export const mapMemberListFromApiToVm = (
  members: apiModel.Member[]
): viewModel.Member[] => [];
```

Let's update the spec:

_./src/mapper.spec.ts_

```diff
import * as apiModel from './api-model';
import * as viewModel from './view-model';
+ import { mapMemberListFromApiToVm } from './mapper';
...

```

Should return empty array when it feeds null:

_./src/mapper.spec.ts_

```diff
...

+ it('should return empty array when it feeds null', () => {
+   // Arrange
+   const members: apiModel.Member[] = null;

+   // Act
+   const result = mapMemberListFromApiToVm(members);

+   // Assert
+   const expectedResult: viewModel.Member[] = [];
+   expect(result).toEqual([]);
+ });
});

```

Should return empty array when it feeds empty array:

_./src/mapper.spec.ts_

```diff
...

+ it('should return empty array when it feeds empty array', () => {
+   // Arrange
+   const members: apiModel.Member[] = [];

+   // Act
+   const result = mapMemberListFromApiToVm(members);

+   // Assert
+   const expectedResult: viewModel.Member[] = [];
+   expect(result).toEqual(expectedResult);
+ });
});

```

Yep, we are ready to deploy to production :^). Should return array one mapped item when it feed array with one item:

_./src/mapper.spec.ts_

```diff
...

+ it('should return array one mapped item when it feed array with one item', () => {
+   // Arrange
+   const members: apiModel.Member[] = [
+     { id: 1, login: 'test login', avatar_url: 'test avatar' },
+   ];

+   // Act
+   const result = mapMemberListFromApiToVm(members);

+   // Assert
+   const expectedResult: viewModel.Member[] = [
+     {
+       id: '1',
+       login: 'test login',
+       avatarUrl: 'test avatar',
+     },
+   ];
+   expect(result).toEqual(expectedResult);
+ });
});

```

Let's update the implementation:

_./src/mapper.ts_

```diff
import * as apiModel from './api-model';
import * as viewModel from './view-model';

export const mapMemberListFromApiToVm = (
  members: apiModel.Member[]
- ): viewModel.Member[] => [];
+ ): viewModel.Member[] => members.map(member => mapMemberFromApiToVm(member));

+ const mapMemberFromApiToVm = (member: apiModel.Member): viewModel.Member => ({
+   id: member.id.toString(),
+   login: member.login,
+   avatarUrl: member.avatar_url,
+ });

```

We've break two specs! How to solve this one?. Let's start with undefined:

_./src/mapper.ts_

```diff

export const mapMemberListFromApiToVm = (
  members: apiModel.Member[]
- ): viewModel.Member[] => members.map(member => mapMemberFromApiToVm(member));
+ ): viewModel.Member[] =>
+   members !== undefined
+   ? members.map(member => mapMemberFromApiToVm(member))
+   : [];
...

```

Let's continue with null:

_./src/mapper.ts_

```diff
...

export const mapMemberListFromApiToVm = (
  members: apiModel.Member[]
): viewModel.Member[] =>
-  members !== undefined
+  members !== undefined && members !== null
    ? members.map(member => mapMemberFromApiToVm(member))
    : [];
...

```

Or if we know about JavaScript Array [isArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray) method:

_./src/mapper.ts_

```diff
...

export const mapMemberListFromApiToVm = (
  members: apiModel.Member[]
): viewModel.Member[] =>
- members !== undefined && members !== null
+ Array.isArray(members)
    ? members.map(member => mapMemberFromApiToVm(member))
    : [];
...

```

Another tool provided by vitest is the [each](https://vitest.dev/api/#test-each) method.

> We could have some issues typing arrays.
>
> That's why the `any` casting

_./src/mapper.spec.ts_

```diff
...

describe('mapper specs', () => {
+ it.each<{ members: apiModel.Member[] }>([
+   { members: undefined },
+   { members: null },
+   { members: [] },
+ ])(
+   'should return empty array when it feeds members equals $members',
+   ({ members }) => {
+     // Arrange

+     // Act
+     const result = mapMemberListFromApiToVm(members);

+     // Assert
+     expect(result).toEqual([]);
+   }
+ );

- it('should return empty array when it feeds undefined', () => {
-   // Arrange
-   const members: apiModel.Member[] = undefined;

-   // Act
-   const result = mapMemberListFromApiToVm(members);

-   // Assert
-   const expectedResult: viewModel.Member[] = [];
-   expect(result).toEqual([]);
- });

- it('should return empty array when it feeds null', () => {
-   // Arrange
-   const members: apiModel.Member[] = null;

-   // Act
-   const result = mapMemberListFromApiToVm(members);

-   // Assert
-   const expectedResult: viewModel.Member[] = [];
-   expect(result).toEqual([]);
- });

- it('should return empty array when it feeds empty array', () => {
-   // Arrange
-   const members: apiModel.Member[] = [];

-   // Act
-   const result = mapMemberListFromApiToVm(members);

-   // Assert
-   const expectedResult: viewModel.Member[] = [];
-   expect(result).toEqual([]);
- });

...

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
