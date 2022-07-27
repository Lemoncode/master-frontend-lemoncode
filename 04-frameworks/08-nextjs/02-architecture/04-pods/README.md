# 04 Pods

Let's move functionality to `pods` folder.

We will start from `03-layouts`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- Let's start with `car-list` pod:

```
./src/pods
└───car-list
    │   car-list.component.tsx
    │   car-list.container.tsx
    │   car-list.mappers.ts
    │   car-list.styles.ts
    │   car-list.vm.ts
    │
    ├───api
    │       car-list.api-model.ts
    │       car-list.api.ts
    │       index.ts
    │
    └───components
            car-item.component.tsx
            car-item.styles.ts
            index.ts
```

- Move to `api` funcitionality:

_./src/pods/car-list/api/car-list.api-model.ts_

```javascript
export interface Car {
  id: string;
  name: string;
  imageUrl: string;
  features: string[];
  isBooked: boolean;
}

```

_./src/pods/car-list/api/car-list.api.ts_

```javascript
import Axios from 'axios';
import { envConstants } from 'core/constants';
import { Car } from './car-list.api-model';

export const url = `${envConstants.BASE_API_URL}/cars`;

export const getCarList = async (): Promise<Car[]> => {
  const { data } = await Axios.get<Car[]>(url);
  return data;
};
```

- Add barrel file:

_./src/pods/car-list/api/index.ts_

```javascript
export * from './car-list.api-model';
export * from './car-list.api';

```

- Add `view-model`:

_./src/pods/car-list/car-list.vm.ts_

```javascript
export interface Car {
  id: string;
  name: string;
  imageUrl: string;
  isBooked: boolean;
}

```

- Add `mappers`:

_./src/pods/car-list/car-list.mappers.ts_

```javascript
import { envConstants } from 'core/constants';
import * as apiModel from './api';
import * as viewModel from './car-list.vm';

export const mapCarListFromApiToVm = (
  carList: apiModel.Car[]
): viewModel.Car[] =>
  Array.isArray(carList) ? carList.map(mapCarFromApiToVm) : [];

const mapCarFromApiToVm = (car: apiModel.Car): viewModel.Car => ({
  id: car.id,
  name: car.name,
  imageUrl: `${envConstants.BASE_PICTURES_URL}${car.imageUrl}`,
  isBooked: car.isBooked,
});

```

- Update `components`:

_./src/pods/car-list/components/car-item.component.tsx_

```diff
...
import { routeConstants } from 'core/constants';
- import { Car } from '../view-models';
+ import { Car } from '../car-list.vm';
...
```

- Add barrel file:

_./src/pods/car-list/components/index.ts_

```javascript
export * from './car-item.component';

```

- Update `component` and `container`:

_./src/pods/car-list/car-list.component.tsx_

```diff
import React from 'react';
- import { Car } from '../view-models';
+ import { Car } from './car-list.vm';
- import { CarItem } from './car-item.component';
+ import { CarItem } from './components';
import * as classes from './car-list.styles';
...

```

_./src/pods/car-list/car-list.container.tsx_

```diff
import React from 'react';
- import * as api from '../../api';
+ import * as api from './api';
- import { mapCarListFromApiToVm } from '../../mappers';
+ import { mapCarListFromApiToVm } from './car-list.mappers'
import { CarListComponent } from './car-list.component';
...

```

- Add barrel file:

_./src/pods/car-list/index.ts_

```javascript
export * from './car-list.container';
import * as api from './api';
export { api };

```

- Update `page` component:


_./src/pages/cars.tsx_

```diff
import React from 'react';
import useSWR from 'swr';
import Head from 'next/head';
import { AppLayout } from 'layouts';
- import * as api from '../api';
- import { CarListContainer } from '../components';
+ import { api, CarListContainer } from 'pods/car-list';

...
```

- Let's apply same approach for `car`:

```
./src/pods
└───car
    │   car.component.tsx
    │   car.container.tsx
    │   car.mappers.ts
    │   car.styles.ts
    │   car.vm.ts
    │
    └───api
          car.api-model.ts
          car.api.ts
          index.ts
```

- Move to `api` funcitionality:

_./src/pods/car/api/car.api-model.ts_

```javascript
export interface Car {
  id: string;
  name: string;
  imageUrl: string;
  features: string[];
  isBooked: boolean;
}

```

_./src/pods/car/api/car.api.ts_

```javascript
export interface Car {
  id: string;
  name: string;
  imageUrl: string;
  features: string[];
  isBooked: boolean;
}

```

- Add barrel file:

_./src/pods/car/api/index.ts_

```javascript
export * from './car.api-model';
export * from './car.api';

```

- Add `view-model`:

_./src/pods/car/car.vm.ts_

```javascript
export interface Car {
  id: string;
  name: string;
  imageUrl: string;
  features: string[];
  isBooked: boolean;
}

export const createEmptyCar = (): Car => ({
  id: '',
  name: '',
  imageUrl: '',
  features: [],
  isBooked: false,
});

```

- Add `mappers`:

_./src/pods/car/car.mappers.ts_

```javascript
import { envConstants } from 'core/constants';
import * as apiModel from './api';
import * as viewModel from './car.vm';

export const mapCarFromApiToVm = (car: apiModel.Car): viewModel.Car =>
  Boolean(car)
    ? {
        id: car.id,
        name: car.name,
        imageUrl: `${envConstants.BASE_PICTURES_URL}${car.imageUrl}`,
        features: car.features,
        isBooked: car.isBooked,
      }
    : viewModel.createEmptyCar();

export const mapCarFromVmToApi = (car: viewModel.Car): apiModel.Car => ({
  id: car.id,
  name: car.name,
  imageUrl: car.imageUrl.split(envConstants.BASE_PICTURES_URL)[1],
  features: car.features,
  isBooked: car.isBooked,
});

```

- Update `component` and `container`:

_./src/pods/car/car.component.tsx_

```diff
import React from 'react';
import Image from 'next/image';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
- import { Car } from '../../view-models';
+ import { Car } from './car.vm';
import * as classes from './car.styles';
...

```

 > Improvement: Create some internal components.

 
_./src/pods/car/car.container.tsx_

```diff
import React from 'react';
import { useRouter } from 'next/router';
- import * as api from '../api';
import { routeConstants } from 'core/constants';
+ import * as api from './api';
- import { mapCarFromApiToVm, mapCarFromVmToApi } from '../mappers';
+ import { mapCarFromApiToVm, mapCarFromVmToApi } from './car.mappers';
import { CarComponent } from './car.component';
...

```

- Add barrel file:

_./src/pods/car/index.ts_

```javascript
export * from './car.container';
import * as api from './api';
export { api };

```

- Update `page` component:


_./src/pages/cars/\[carId\].tsx_

```diff
import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { AppLayout } from 'layouts';
- import * as api from '../../api';
- import { CarContainer } from '../../components';
+ import { api, CarContainer } from 'pods/car';
...
```

- Remove `./src/api`, `./src/components`, `./src/mappers`, `./src/view-models` folders.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
