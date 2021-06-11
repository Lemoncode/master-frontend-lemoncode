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
...
-  devtool: "eval-source-map",
-  devServer: {
-    port: 8080,
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
  devtool: "eval-source-map",
  devServer: {
    port: 8080,
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
-   "start:dev": "webpack serve",
+   "start:dev": "webpack serve --config webpack.dev.js",
-   "build": "webpack --mode development"
+   "build:dev": "npm run type-check && webpack --config webpack.dev.js",
+   "build:prod": "npm run type-check && webpack --config webpack.prod.js"
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

- Fix app:

_averageService.ts_

```diff
...
- const a: number = "this is a string"

```

- Another important change is to use [mini-css-extract-plugin in production](https://webpack.js.org/plugins/mini-css-extract-plugin/#common-use-case) because we can use style-loader in dev mode which it's faster:

_webpack.common.js_

```diff
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
- const MiniCssExtractPlugin = require("mini-css-extract-plugin");
...
module: {
    rules: [
      ...
-     {
-       test: /\.scss$/,
-       exclude: /node_modules/,
-       use: [
-         MiniCssExtractPlugin.loader,
-         {
-           loader: "css-loader",
-           options: {
-             modules: {
-               exportLocalsConvention: "camelCase",
-               localIdentName: "[path][name]__[local]--[hash:base64:5]",
-               localIdentContext: path.resolve(__dirname, "src"),
-               localIdentHashPrefix: "my-custom-hash",
-             },
-           },
-         },
-         {
-           loader: "sass-loader",
-           options: {
-             implementation: require("sass"),
-           },
-         },
-       ],
-     },
-     {
-       test: /\.css$/,
-       use: [MiniCssExtractPlugin.loader, "css-loader"],
-     },
      {
        test: /\.(png|jpg)$/,
        type: "asset/resource",
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
    ],
  },
  plugins: [
    //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: "index.html", //Name of file in ./dist/
      template: "index.html", //Name of template in ./src
    }),
    new CleanWebpackPlugin(),
-   new MiniCssExtractPlugin({
-     filename: "[name].css",
-     chunkFilename: "[id].css",
-   }),
  ],
```

_webpack.dev.js_

```diff
const { merge } = require("webpack-merge");
+ const path = require("path");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    port: 8080,
    stats: "errors-only",
  },
+ module: {
+   rules: [
+     {
+       test: /\.scss$/,
+       exclude: /node_modules/,
+       use: [
+         "style-loader",
+         {
+           loader: "css-loader",
+           options: {
+             modules: {
+               exportLocalsConvention: "camelCase",
+               localIdentName: "[path][name]__[local]--[hash:base64:5]",
+               localIdentContext: path.resolve(__dirname, "src"),
+               localIdentHashPrefix: "my-custom-hash",
+             },
+           },
+         },
+         {
+           loader: "sass-loader",
+           options: {
+             implementation: require("sass"),
+           },
+         },
+       ],
+     },
+     {
+       test: /\.css$/,
+       use: ["style-loader", "css-loader"],
+     },
+   ],
+ },
});

```

_webpack.prod.js_

```diff
const { merge } = require("webpack-merge");
+ const MiniCssExtractPlugin = require("mini-css-extract-plugin");
+ const path = require("path");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  stats: "verbose",
+ module: {
+   rules: [
+     {
+       test: /\.scss$/,
+       exclude: /node_modules/,
+       use: [
+         MiniCssExtractPlugin.loader,
+         {
+           loader: "css-loader",
+           options: {
+             modules: {
+               exportLocalsConvention: "camelCase",
+               localIdentName: "[path][name]__[local]--[hash:base64:5]",
+               localIdentContext: path.resolve(__dirname, "src"),
+               localIdentHashPrefix: "my-custom-hash",
+             },
+           },
+         },
+         {
+           loader: "sass-loader",
+           options: {
+             implementation: require("sass"),
+           },
+         },
+       ],
+     },
+     {
+       test: /\.css$/,
+       use: [MiniCssExtractPlugin.loader, "css-loader"],
+     },
+   ],
+ },
+ plugins: [
+   new MiniCssExtractPlugin({
+     filename: "[name].css",
+     chunkFilename: "[id].css",
+   }),
+ ],
});

```

- The `chunkhash` on file names are recommended to use only for production mode:

_webpack.common.js_

```diff
...
  output: {
-   filename: "[name].[chunkhash].js",
    path: path.resolve(process.cwd(), "dist"),
  },
...

```

_webpack.dev.js_

```diff
...
  devServer: {
    port: 8080,
    stats: "errors-only",
  },
+ output: {
+   filename: "[name].js",
+ },
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                exportLocalsConvention: "camelCase",
-               localIdentName: "[path][name]__[local]--[hash:base64:5]",
+               localIdentName: "[path][name]__[local]",
                localIdentContext: path.resolve(__dirname, "src"),
-               localIdentHashPrefix: "my-custom-hash",
              },
...
```

_webpack.prod.js_

```diff
...
module.exports = merge(common, {
  mode: "production",
  stats: "verbose",
+ output: {
+   filename: "[name].[chunkhash].js",
+ },
  module: {
...
  },
  plugins: [
    new MiniCssExtractPlugin({
-     filename: "[name].css",
+     filename: "[name].[chunkhash].css",
-     chunkFilename: "[id].css",
+     chunkFilename: "[id].[chunkhash].css",
    }),
  ],
});

```

- Even, we can group output files in folders, let's add an image to app:

_declaration.d.ts_

```diff
declare module "*.scss";
+ declare module "*.png";

```

_index.tsx_

```diff
import React from "react";
import ReactDOM from "react-dom";
import { AverageComponent } from "./averageComponent";
import { TotalScoreComponent } from './totalScoreComponent';
+ import logo from './content/logo_1.png';

ReactDOM.render(
  <div>
    <h1>Hello from React DOM</h1>
+   <img src={logo} />
    <AverageComponent />
    <TotalScoreComponent />
  </div>,
  document.getElementById("root")
);

```

- Group by folders:

_webpack.prod.js_

```diff
...
module.exports = merge(common, {
  mode: "production",
  output: {
-   filename: "[name].[chunkhash].js",
+   filename: "js/[name].[chunkhash].js",
+   assetModuleFilename: "images/[hash][ext][query]",
  },
...
  plugins: [
    new MiniCssExtractPlugin({
-     filename: "[name].[chunkhash].css",
+     filename: "css/[name].[chunkhash].css",
      chunkFilename: "[id].[chunkhash].css",
    }),
  ],
});

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
