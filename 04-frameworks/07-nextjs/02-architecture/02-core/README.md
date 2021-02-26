# 02 Core

Let's move functionality to `core` folder.

We will start from `01-config`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- Let's migrate theme to `core` folder,`common/theme` > `core/theme`:

_./src/components/car-item.styles.ts_

```diff
import { css } from '@emotion/css';
- import { theme } from '../core/theme';
+ import { theme } from 'core/theme';

...

```

_./src/components/car-list.styles.ts_

```diff
import { css } from '@emotion/css';
- import { theme } from '../core/theme';
+ import { theme } from 'core/theme';

...

```

_./src/components/car.styles.ts_

```diff
import { css } from '@emotion/css';
- import { theme } from '../core/theme';
+ import { theme } from 'core/theme';

...

```

_./src/pages/\_app.tsx_

```diff
import React from 'react';
import { AppProps } from 'next/app';
- import { ThemeProviderComponent } from '../core/theme';
+ import { ThemeProviderComponent } from 'core/theme';

...

```

- Move constants too, `common/constants` > `core/constants`:

_./src/api/car.api.ts_

```diff
import Axios from 'axios';
- import { envConstants } from '../core/constants';
+ import { envConstants } from 'core/constants';
...

```

_./src/components/car-item.component.tsx_

```diff
...
import AvailableIcon from '@material-ui/icons/CheckCircle';
import BookedIcon from '@material-ui/icons/Cancel';
- import { routeConstants } from '../core/constants';
+ import { routeConstants } from 'core/constants';
...

```

_./src/components/car.container.tsx_

```diff
...
import * as api from '../api';
- import { routeConstants } from '../core/constants';
+ import { routeConstants } from 'core/constants';
...

```

_./src/mappers/car.mappers.ts_

```diff
- import { envConstants } from '../core/constants';
+ import { envConstants } from 'core/constants';
import * as apiModel from '../api';
import * as viewModel from '../view-models';
...

```

- In this folder we could have `i18n`, `api` config, `redux` config, etc.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
