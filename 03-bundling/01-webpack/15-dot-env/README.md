# 15 Environment variables

In this demo we are going to setup environment variable each type of build
(e.g. rest api base url), we will make use of _dotenv_

We will start from sample _14-production_.

Summary steps:

- Install webpackdotenv.
- Generate env files.
- Add base config.
- Add dev config.
- Add prod config.

# Steps to build it

## Prerequisites

Prerequisites, you will need to have nodejs installed in your computer. If you want to follow this step guides you will need to take as starting point sample _14 production config_.

## steps

- `npm install` to install previous sample packages:

```bash
npm install
```

- Let's install dotenv-webpack

```bash
npm install dotenv-webpack --save-dev
```

- Let's create two simple environment files.

_dev.env_

```
API_BASE=http://localhost:8081/
```

_prod.env_

```
API_BASE=https://myapp.api/
```

- Let's setup the plugin dev config.

_./webpack.dev.js_

```diff
const { merge } = require("webpack-merge");
+ const Dotenv = require('dotenv-webpack');
...
```

_./webpack.dev.js_

```diff
...
+ plugins: [
+   new Dotenv({
+     path: './dev.env',
+   }),
+ ],
});
```

- Let's setup the plugin prod config.

_./webpack.prod.js_

```diff
const { merge } = require("webpack-merge");
+ const Dotenv = require('dotenv-webpack');
...

```

_./webpack.prod.js_

```diff
...
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[chunkhash].css",
      chunkFilename: "[id].[chunkhash].css",
    }),
+   new Dotenv({
+     path: "./prod.env",
+   }),
  ],
});
```

- Let's introduce a test in our code (console log).

_./src/averageService.ts_

```diff
+ console.log(`Api base: ${process.env.API_BASE}`);
```

- Let's add a config entry line in our package.json to start our
  server in production mode.

_./package.json_

```diff
  "scripts": {
    "start": "run-p -l type-check:watch start:dev",
    "type-check": "tsc --noEmit",
    "type-check:watch": "npm run type-check -- --watch",
    "start:dev": "webpack serve --config webpack.dev.js",
+   "start:prod": "webpack serve --config webpack.prod.js",
    "build:dev": "npm run type-check && webpack --config webpack.dev.js",
    "build:prod": "npm run type-check && webpack --config webpack.prod.js"
  },
```

- Let's test dev config, run the following command from terminal and open your browser
  console:

```bash
npm start
```

- Now let's test production:

```bash
npm run start:prod
```

- And let's check the code generated:

```bash
npm run build:dev
```

```bash
npm run build:prod
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
