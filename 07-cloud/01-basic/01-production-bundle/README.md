# 01 Production bundle

In this example we are going to create a production bundle using webpack.

We will start from `00-boilerplate`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- First, we will check the current `base` and `dev` webpack configuration.

- Then, we need to add a new file `prod.js` using `production` mode:

_./config/webpack/prod.js_

```javascript
const { merge } = require('webpack-merge');
const base = require('./base');

module.exports = merge(base, {
  mode: 'production',
});

```

- As we did on `dev`, we have to configure the ouput:

_./config/webpack/prod.js_

```diff
const { merge } = require('webpack-merge');
const base = require('./base');
+ const helpers = require('./helpers');

module.exports = merge(base, {
  mode: 'production',
+ output: {
+   path: helpers.resolveFromRootPath('dist'),
+   filename: './js/[name].[chunkhash].js',
+   assetModuleFilename: "./images/[hash][ext][query]",
+ },
});

```

> NOTE: Remember to add `chunkhash` to avoid cache issues.

- Next one, it's apply optimization to split `node_modules` as different chunk from `app`:

_./config/webpack/prod.js_

```diff
...
  output: {
    path: helpers.resolveFromRootPath('dist'),
    filename: './js/[name].[chunkhash].js',
    assetModuleFilename: './images/[hash][ext][query]',
  },
+ optimization: {
+   runtimeChunk: 'single',
+   splitChunks: {
+     cacheGroups: {
+       vendor: {
+         chunks: 'all',
+         name: 'vendor',
+         test: /[\\/]node_modules[\\/]/,
+         enforce: true,
+       },
+     },
+   },
+ },
});

```

- Finally, we will provide a different env variables for `production`:

_./prod.env_

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
+   "build": "run-p -l type-check build:prod",
+   "build:prod": "npm run clean && webpack --config ./config/webpack/prod.js",
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
