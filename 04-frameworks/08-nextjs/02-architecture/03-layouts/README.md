# 03 Layouts

Let's move functionality to `layouts` folder.

We will start from `02-core`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- Let's migrate `app.layout`:
  - `components/app.layout.styles.ts` > `layouts/app.layout.styles.ts`:
  - `components/app.layout.tsx` > `layouts/app.layout.tsx`:

_./src/components/index.ts_

```diff
export * from './car-list.container';
- export * from './app.layout';
export * from './car.container';

```

- Add barrel file:

_./src/layouts/index.ts_

```javascript
export * from './app.layout';

```

_./src/pages/cars.tsx_

```diff
import React from 'react';
import useSWR from 'swr';
import Head from 'next/head';
+ import { AppLayout } from 'layouts';
import * as api from '../api';
- import { AppLayout, CarListContainer } from '../components';
+ import { CarListContainer } from '../components';

...

```

_./src/pages/cars/\[carId\].tsx_

```diff
import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
+ import { AppLayout } from 'layouts';
import * as api from '../../api';
- import { AppLayout, CarContainer } from '../../components';
+ import { CarContainer } from '../../components';

...

```

- We can create more layouts, for example for `Login` page.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
