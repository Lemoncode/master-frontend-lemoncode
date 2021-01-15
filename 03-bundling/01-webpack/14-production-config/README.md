# 14 Production config

In this demo we are going to create different builds for each environment. We will learn how to configure it and how to reduce bundle file sizes.

We will start from _13-typescript_

Summary steps:

- Install webpack merge
- Create a base webpack config.
- Create a development config.
- Create a production config.
- Add scripts to package.json

## Prerequisites

You will need to have nodejs installed in your computer (at least 8.9.2). If you want to follow this step-by-step guide you will need to take as starting point sample _13-typescript_.

## steps

- `npm install` to install previous sample packages:

```bash
npm install
```

- So now we want to split into development and production configurations, you will find that:

  - If we just create two configs, and copy and paste the common content it would be a nightmare
    to maintain, and on the other hand what if we need to create more specific configs?
  - We should find a way to keep the common config in one file and just create the specific
    configs taking as a base that common configuration.

- We will use a tool called _webpack-merge_, this tool allows as to have a _common_ webpack
  config file and merge it into specific ones.

```bash
npm install webpack-merge --save-dev
```

- Let's rename our _webpack.config.js_ file to _webpack.common.js_

- In this new _webpack.common.js_ let's remove the entry _stats: "errors-only"_ we want to
  be more specific here, in development we want to use the short stats version, in
  production we want to display the extended version.

_webpack.common.js_

```diff
module.exports = {
  context: path.join(basePath, "src"),
  resolve: {
    extensions: [".js", ".ts", ".tsx"]
  },
- devtool: "eval-source-map",
  entry: {
    app: "./index.tsx",
    appStyles: ["./mystyles.scss"],
    vendorStyles: ["../node_modules/bootstrap/dist/css/bootstrap.css"]
  },
-  devServer: {
-    stats: "errors-only",
-  },
```

- Now it's time to create our webpack config dev version, we will start by merging
  it form the base config, and then add / overwrite the setting specific for development.

_webpack.dev.js_

```javascript
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    stats: "errors-only",
  },
});
```

- Time to go for the production environment, we will follow similar steps
  as in dev:

_webpack.prod.js_

```javascript
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  stats: "verbose",
});
```

- Great we got both configuration, is time to update our package.json

_./package.json_

```diff
  "scripts": {
    "start": "run-p -l type-check:watch start:dev",
    "type-check": "tsc --noEmit",
    "type-check:watch": "npm run type-check -- --watch",
-    "start:dev": "webpack-dev-server --mode development --open",
+        "start:dev": "webpack serve --mode development --config webpack.dev.js",
-    "build": "rimraf dist && webpack --mode development"
+    "build:dev": "rimraf dist && webpack --config webpack.dev.js",
+    "build:prod": "rimraf dist && webpack --config webpack.prod.js"
  },
```

- If you want to give a try to the dev build just run

```bash
npm run build:dev
```

- If you want to give a try to the production build just run:

```bash
npm run build:prod
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
