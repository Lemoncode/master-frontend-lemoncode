# 01 Config

Let's add import alias to get shortest imports.

We will start from `08-context`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- Import alias in Nextjs is similiar than client side apps with React + webpack. Nextjs is using webpack under the hood. But in this case, we only have to update `tsconfig`:

_./tsconfig.json_

```diff
...
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
+   "baseUrl": "./src/",
+   "paths": {
+     "common": ["common"],
+     "common-app": ["common-app"],
+     "core": ["core"],
+     "layouts": ["layouts"],
+     "pods": ["pods"],
+   }
  },
  "include": [
...

```

> [Import alias Nextjs](https://nextjs.org/docs/advanced-features/module-path-aliases)
> [Configuring alisases in webpack](https://www.basefactor.com/configuring-aliases-in-webpack-vs-code-typescript-jest)

- Let's try to use it:

_./src/components/car.container.tsx_

```diff
import React from 'react';
import { useRouter } from 'next/router';
import * as api from '../api';
- import { routeConstants } from '../common/constants';
+ import { routeConstants } from 'common/constants';
import { mapCarFromApiToVm, mapCarFromVmToApi } from '../mappers';
import { CarComponent } from './car.component';
...

```

- Run it:

```bash
npm start
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
