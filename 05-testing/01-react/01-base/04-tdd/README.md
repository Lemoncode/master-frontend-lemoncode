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

- Let's remove all `calculator` stuff and create a simple `app` to retrieve data from `github`:

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
  Axios.get(url).then(({ data }) => data);
```

- Let's use it:

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

- Run it:

```bash
npm start
```

- We are retrieving too many properties, let's create a `view-model`:

### ./src/view-model.ts

```javascript
export interface Member {
  id: string;
  login: string;
  avatarUrl: string;
}
```

- What do we need now? We need a `mapper` to map from `api-model` to `view-model`. Since, we are going to apply TDD, we will start from `spec` before:

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

- should return empty array when it feeds undefined:

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
+   const result: viewModel.Member[] = mapToMemberVMList(members);

    // Assert
+   expect(result).toEqual([]);
  });
});

```

- Create the minimum implementation to pass the test:

### ./src/mapper.ts

```javascript
import * as apiModel from './api-model';
import * as viewModel from './view-model';

export const mapToMemberVMList = (
  members: apiModel.Member[]
): viewModel.Member[] => [];
```

- Let's update the spec:

### ./src/mapper.spec.ts

```diff
import * as apiModel from './api-model';
import * as viewModel from './view-model';
+ import { mapToMemberVMList } from './mapper';
...

```

- should return empty array when it feeds null:

### ./src/mapper.spec.ts

```diff
...

+ it('should return empty array when it feeds null', () => {
+   // Arrange
+   const members: apiModel.Member[] = null;

+   // Act
+   const result: viewModel.Member[] = mapToMemberVMList(members);

+   // Assert
+   expect(result).toEqual([]);
+ });
});

```

- should return empty array when it feeds empty array:

### ./src/mapper.spec.ts

```diff
...

+ it('should return empty array when it feeds empty array', () => {
+   // Arrange
+   const members: apiModel.Member[] = [];

+   // Act
+   const result: viewModel.Member[] = mapToMemberVMList(members);

+   // Assert
+   expect(result).toEqual([]);
+ });
});

```

- Yep, we are ready to deploy to production :^). Should return array one mapped item when it feed array with one item:

### ./src/mapper.spec.ts

```diff
...

+ it('should return array one mapped item when it feed array with one item', () => {
+   // Arrange
+   const members: apiModel.Member[] = [
+     { id: 1, login: 'test login', avatar_url: 'test avatar' },
+   ];

+   // Act
+   const result: viewModel.Member[] = mapToMemberVMList(members);

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

- Let's update the implementation:

### ./src/mapper.ts

```diff
import * as apiModel from './api-model';
import * as viewModel from './view-model';

export const mapToMemberVMList = (
  members: apiModel.Member[]
- ): viewModel.Member[] => [];
+ ): viewModel.Member[] => members.map(member => mapToMemberVM(member));

+ const mapToMemberVM = (member: apiModel.Member): viewModel.Member => ({
+   id: member.id.toString(),
+   login: member.login,
+   avatarUrl: member.avatar_url,
+ });

```

- We've break two specs! How to solve this one?. Let's start with undefined:

### ./src/mapper.ts

```diff

export const mapToMemberVMList = (
  members: apiModel.Member[]
- ): viewModel.Member[] => members.map(member => mapToMemberVM(member));
+ ): viewModel.Member[] =>
+   members !== undefined
+   ? members.map(member => mapToMemberVM(member))
+   : [];
...

```

- Let's continue with null:

### ./src/mapper.ts

```diff
...

export const mapToMemberVMList = (
  members: apiModel.Member[]
): viewModel.Member[] =>
- members !== undefined ? members.map(member => mapToMemberVM(member)) : [];
+ members !== undefined && members !== null
    ? members.map(member => mapToMemberVM(member))
    : [];
...

```

- Or if we know about JavaScript Array [isArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray) method:

### ./src/mapper.ts

```diff
...

export const mapToMemberVMList = (
  members: apiModel.Member[]
): viewModel.Member[] =>
- members !== undefined && members !== null
+ Array.isArray(members)
    ? members.map(member => mapToMemberVM(member))
    : [];
...

```

- It's time to use it:

### ./src/app.tsx

```diff
import * as React from 'react';
import { getMembers } from './api';
+ import { mapToMemberVMList } from './mapper';

export const App: React.FunctionComponent = () => {
  React.useEffect(() => {
    getMembers().then(members => {
-     console.log(members);
+     console.log(mapToMemberVMList(members));
    });
  });

  return <h1>React testing by sample</h1>;
};

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
