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

### ./src/api-model.ts

```javascript
export interface Member {
  id: number;
  login: string;
  avatar_url: string;
}
```

### ./src/api.ts

```javascript
import Axios from 'axios';
import { Member } from './api-model';

const url = 'https://api.github.com/orgs/lemoncode/members';

export const getMembers = (): Promise<Member[]> =>
  Axios.get(url).then((response) => response.data)
```

Let's use it:

### ./src/app.tsx

```diff
import * as React from 'react';
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

### ./src/view-model.ts

```javascript
export interface Member {
  id: string;
  login: string;
  avatarUrl: string;
}
```

What do we need now? We need a `mapper` to map from `api-model` to `view-model`. Since, we are going to apply TDD, we will start from `spec` before:

### ./src/mapper.spec.ts

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

### ./src/mapper.spec.ts

```diff
+ import * as apiModel from './api-model';
+ import * as viewModel from './view-model';

describe('mapper specs', () => {
- it('', () => {
+ it('should return empty array when it feeds undefined', () => {
    // Arrange
+   const members: apiModel.Member[] = undefined;

    // Act
+   const result: viewModel.Member[] = mapMemberListFromApiToVm(members);

    // Assert
+   expect(result).toEqual([]);
  });
});

```

Create the minimum implementation to pass the test:

### ./src/mapper.ts

```javascript
import * as apiModel from './api-model';
import * as viewModel from './view-model';

export const mapMemberListFromApiToVm = (
  members: apiModel.Member[]
): viewModel.Member[] => [];
```

Let's update the spec:

### ./src/mapper.spec.ts

```diff
import * as apiModel from './api-model';
import * as viewModel from './view-model';
+ import { mapMemberListFromApiToVm } from './mapper';
...

```

Should return empty array when it feeds null:

### ./src/mapper.spec.ts

```diff
...

+ it('should return empty array when it feeds null', () => {
+   // Arrange
+   const members: apiModel.Member[] = null;

+   // Act
+   const result: viewModel.Member[] = mapMemberListFromApiToVm(members);

+   // Assert
+   expect(result).toEqual([]);
+ });
});

```

Should return empty array when it feeds empty array:

### ./src/mapper.spec.ts

```diff
...

+ it('should return empty array when it feeds empty array', () => {
+   // Arrange
+   const members: apiModel.Member[] = [];

+   // Act
+   const result: viewModel.Member[] = mapMemberListFromApiToVm(members);

+   // Assert
+   expect(result).toEqual([]);
+ });
});

```

Yep, we are ready to deploy to production :^). Should return array one mapped item when it feed array with one item:

### ./src/mapper.spec.ts

```diff
...

+ it('should return array one mapped item when it feed array with one item', () => {
+   // Arrange
+   const members: apiModel.Member[] = [
+     { id: 1, login: 'test login', avatar_url: 'test avatar' },
+   ];

+   // Act
+   const result: viewModel.Member[] = mapMemberListFromApiToVm(members);

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

### ./src/mapper.ts

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

### ./src/mapper.ts

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

### ./src/mapper.ts

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

### ./src/mapper.ts

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

Another tool provided by jest is the [each](https://jestjs.io/docs/api#testeachtablename-fn-timeout) method.

> We could have some issues typing arrays.
>
> That's why the `any` casting

### ./src/mapper.spec.ts

```diff
...

describe('mapper specs', () => {
+ it.each<apiModel.Member[]>([undefined, null, []])(
+   'should return empty array when it feeds members equals %p',
+   (members: any) => {
+     // Arrange

+     // Act
+     const result: viewModel.Member[] = mapMemberListFromApiToVm(members);

+     // Assert
+     expect(result).toEqual([]);
+   }
+ );

- it('should return empty array when it feeds undefined', () => {
-   // Arrange
-   const members: apiModel.Member[] = undefined;

-   // Act
-   const result: viewModel.Member[] = mapMemberListFromApiToVm(members);

-   // Assert
-   expect(result).toEqual([]);
- });

- it('should return empty array when it feeds null', () => {
-   // Arrange
-   const members: apiModel.Member[] = null;

-   // Act
-   const result: viewModel.Member[] = mapMemberListFromApiToVm(members);

-   // Assert
-   expect(result).toEqual([]);
- });

- it('should return empty array when it feeds empty array', () => {
-   // Arrange
-   const members: apiModel.Member[] = [];

-   // Act
-   const result: viewModel.Member[] = mapMemberListFromApiToVm(members);

-   // Assert
-   expect(result).toEqual([]);
- });

...

```


# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
