Start from **02-svelte-emit-css**

```
npm install typescript --save-dev
npm install svelte-preprocess svelte-check --save
npm install @babel/core @babel/preset-typescript babel-loader --save-dev
```

Now, _package.json_ looks like the following:

````diff
```diff
{
  "name": "svelte-getting-started",
  "version": "1.0.0",
  "description": "Getting started with Svelte",
  "main": "index.js",
  "scripts": {
    "build": "webpack --mode production --node-env production",
    "start": "webpack serve --mode development",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Victor Borrego Perez",
  "license": "ISC",
  "devDependencies": {
    "@babel/cli": "^7.13.16",
    "@babel/core": "^7.13.16",
    "@babel/preset-env": "^7.13.15",
+    "@babel/preset-typescript": "^7.13.0",
    "babel-loader": "^8.2.2",
    "css-loader": "^5.1.3",
    "html-webpack-plugin": "^5.3.1",
    "mini-css-extract-plugin": "^1.3.9",
    "style-loader": "^2.0.0",
    "svelte": "^3.35.0",
+   "svelte-check": "^1.2.5",
    "svelte-loader": "^3.0.0",
+   "svelte-preprocess": "^4.6.9",
+   "typescript": "^4.2.3",
    "webpack": "^5.26.2",
    "webpack-cli": "^4.5.0",
    "webpack-dev-server": "^3.11.2"
  }
}
````

_src/typings/index.d.ts_

```js
declare module "*.svelte" {
  const value: any;
  export default value;
}
```

_.babelrc_

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-typescript"]
}
```

_webpack.config.js_

```diff
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const mode = process.env.NODE_ENV || "development";

module.exports = {
  context: path.resolve(__dirname, "./src"),
- entry: "./index.js",
+ entry: "./index.ts",
+ resolve: {
+   extensions: [".ts", ".js", ".svelte"],
+ },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index.js",
  },
  module: {
    rules: [
+     {
-       test: /\.js$/,
+       test: /\.(t|j)s?$/,
+       exclude: /node_modules/,
+       loader: "babel-loader",
+     },
      {
        test: /\.svelte$/,
        use: [
          { loader: "babel-loader" },
          {
            loader: "svelte-loader",
            options: {
              emitCss: true,
+             preprocess: require("svelte-preprocess")({}),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          mode === "production" ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
        ],
      },
    ],
  },
  devServer: {
    stats: "errors-only",
  },
  mode,
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      scriptLoading: "blocking",
    }),
    new MiniCssExtractPlugin(),
  ],
};
```

_tsconfig.json_

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "target": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "noImplicitAny": false
  },
  "exclude": ["./node_modules"]
}
```

_package.json_

```diff
{
  "name": "svelte-getting-started",
  "version": "1.0.0",
  "description": "Getting started with Svelte",
  "main": "index.js",
  "scripts": {
    "build": "webpack --mode production --node-env production",
-   "start": "webpack serve --mode development",
+   "start": "npm run svelte-check & npm run tsc & webpack serve --mode development",
+   "tsc": "tsc --noEmit",
+   "svelte-check": "svelte-check",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Victor Borrego Perez",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.13.10",
    "@babel/preset-typescript": "^7.13.0",
    "babel-loader": "^8.2.2",
    "css-loader": "^5.1.3",
    "html-webpack-plugin": "^5.3.1",
    "mini-css-extract-plugin": "^1.3.9",
    "style-loader": "^2.0.0",
    "svelte": "^3.35.0",
    "svelte-check": "^1.2.5",
    "svelte-loader": "^3.0.0",
    "svelte-preprocess": "^4.6.9",
    "typescript": "^4.2.3",
    "webpack": "^5.26.2",
    "webpack-cli": "^4.5.0",
    "webpack-dev-server": "^3.11.2"
  }
}
```

_app.svelte_

```diff
- <script>
+ <script lang="ts">
-	let name = "Svelte";
+	let name: string = "Svelte";
</script>

<style>
	h1 {
	  color: blue;
	}
</style>

<h1>Hello {name}!</h1>
```
