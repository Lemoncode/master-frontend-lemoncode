# 01 Production bundle

In this example we are going to create a production bundle using vite.

We will start from `00-boilerplate`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

First, we will check the current `vite config`

_./vite.config.js_

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  envPrefix: 'PUBLIC_',
  plugins: [
    react({
      babel: {
        plugins: ['@emotion'],
      },
    }),
  ],
  resolve: {
    alias: {
      common: path.resolve(__dirname, 'src/common'),
      core: path.resolve(__dirname, 'src/core'),
      layouts: path.resolve(__dirname, 'src/layouts'),
      pods: path.resolve(__dirname, 'src/pods'),
      scenes: path.resolve(__dirname, 'src/scenes'),
      'common-app': path.resolve(__dirname, 'src/common-app'),
    },
  },
});

```

> [Vite env variables](https://vitejs.dev/guide/env-and-mode.html)

Let's add a different env variables for `production`:

_./env.production_

```env
NODE_ENV=production
ORGANIZATION=facebook

```

- And use it:

_./config/webpack/prod.js_

```diff
const { merge } = require('webpack-merge');
+ const Dotenv = require('dotenv-webpack');
const base = require('./base');
...
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'all',
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          enforce: true,
        },
      },
    },
  },
+ plugins: [
+   new Dotenv({
+     path: 'prod.env',
+   }),
+ ],
});

```

- Now, we can add the `build` command:

_./package.json_

```diff
...
  "scripts": {
    "start": "run-p -l type-check:watch start:dev",
    "start:dev": "webpack-dev-server --config ./config/webpack/dev.js",
+   "build": "npm run type-check && npm run clean && build:prod",
+   "build:prod": "webpack --config ./config/webpack/prod.js",
    "type-check": "tsc --noEmit",
    ...
  },
```

- Run it:

```bash
npm run build
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
