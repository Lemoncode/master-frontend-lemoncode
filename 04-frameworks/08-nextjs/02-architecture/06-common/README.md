# 06 Common

Let's move functionality to `common` folder.

We will start from `05-common-app`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- In `common` folder we place stuff that we could move to an external library in the future. For example `common/mappers`:

_./common/mappers/collection.mappers.ts_

```javascript
export const mapToCollection = <A, B>(
  collection: A[],
  mapItemFn: (item: A, index: number) => B
): B[] => (Array.isArray(collection) ? collection.map(mapItemFn) : []);

```

- Add barrel file:

_./common/mappers/index.ts_

```javascript
export * from './collection.mappers';

```

- Use in `car-list` mappers:

_./pods/car-list/car-list.mappers.ts_

```diff
+ import { mapToCollection } from 'common/mappers';
import { envConstants } from 'core/constants';
import * as apiModel from './api';
import * as viewModel from './car-list.vm';

export const mapCarListFromApiToVm = (
  carList: apiModel.Car[]
- ): viewModel.Car[] =>
-   Array.isArray(carList) ? carList.map(mapCarFromApiToVm) : [];
+ ): viewModel.Car[] => mapToCollection(carList, mapCarFromApiToVm);

...

```

- More on this folder:

  - `components`
  - `helpers`
  - `hooks`
  - `testing tools`
  - etc.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
