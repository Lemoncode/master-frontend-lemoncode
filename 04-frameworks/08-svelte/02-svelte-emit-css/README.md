Start from **01-hello-svelte**

```
npm install mini-css-extract-plugin --save-dev
npm install css-loader style-loader --save-dev
```

_webpack.config.js_

```diff
const HtmlWebpackPlugin = require("html-webpack-plugin");
+ const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

+ const mode = process.env.NODE_ENV || "development";

module.exports = {
  context: path.resolve(__dirname, "./src"),
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index.js",
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
-           emitCss: false,
+           emitCss: true,
            hotReload: true,
          },
        },
      },
+      {
+        test: /\.css$/,
+        use: [
+          /**
+           * MiniCssExtractPlugin doesn't support HMR.
+           * For developing, use 'style-loader' instead.
+           * */
+          mode === "production" ? MiniCssExtractPlugin.loader : "style-loader",
+          "css-loader",
+        ],
+      },
    ],
  },
  devServer: {
    stats: "errors-only",
  },
+ mode,
  plugins: [
    new HtmlWebpackPlugin({
      scriptLoading: "blocking",
    }),
+   new MiniCssExtractPlugin(),
  ],
};
```

_package.json_

```diff
{
  "name": "svelte-getting-started",
  "version": "1.0.0",
  "description": "Getting started with Svelte",
  "main": "index.js",
  "scripts": {
-   "build": "webpack --mode production",
+   "build": "webpack --mode production --node-env production",
    "start": "webpack serve --mode development",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Victor Borrego Perez",
  "license": "ISC",
  "devDependencies": {
    "css-loader": "^5.1.3",
    "html-webpack-plugin": "^5.3.1",
    "mini-css-extract-plugin": "^1.3.9",
    "style-loader": "^2.0.0",
    "svelte": "^3.35.0",
    "svelte-loader": "^3.0.0",
    "webpack": "^5.26.2",
    "webpack-cli": "^4.5.0",
    "webpack-dev-server": "^3.11.2"
  }
}
```
