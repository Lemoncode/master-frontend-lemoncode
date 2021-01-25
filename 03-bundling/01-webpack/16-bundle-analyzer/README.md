# 16 Bundle Analyzer

In this demo we are going to configure Webpack Bundle Analyzer plugin, this is a plugin that help us to visualize size of webpack output files with an interactive zoomable treemap.

We will start from sample _15-dotenv_.

Summary steps:

- Install Webpack Bundle Analyzer plugin.
- Add performance config file.
- Add the configuration to performance config file.
- Create execution script.

# Steps to build it

## Prerequisites

Prerequisites, you will need to have nodejs installed in your computer. If you want to follow this step guides you will need to take as starting point sample _15-dotenv_.

## Steps

- `npm install` to install previous sample packages:

```
npm install
```

- Let's go with the plugin installation

```
npm install webpack-bundle-analyzer --save-dev
```

- Now it's time to create performance configuration file, this will use our production configuration file as a base(prod.webpack.config.js).

_./webpack.perf.js_

We will use `webpack-merge` to combine `webpack.prod.js` with performance specific config settings.

- Our performance config file look like:

_./webpack.perf.js_

```javascript
const { merge } = require("webpack-merge");
const prod = require("./webpack.prod.js");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = merge(prod, {
  plugins: [new BundleAnalyzerPlugin()],
});
```

Finally, we need to update command script:

_./package.json_

```diff
...
    "build:prod": "npm run type-check && webpack --config webpack.prod.js",
+   "build:perf": "npm run type-check && webpack --config webpack.perf.js"
  },
```

- Now we can see our interactive treemap working! Simply execute the command `npm run build:perf`

```bash
npm run build:perf
```

- As we can see, we have mixed `app` code with `vendor` code. We can use [Code Splitting](https://webpack.js.org/guides/code-splitting/#splitchunksplugin) webpack feature. Let's try all vendors in one bundle:

_webpack.prod.js_

```diff
...
  output: {
    filename: "js/[name].[chunkhash].js",
    assetModuleFilename: "images/[hash][ext][query]",
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
```

- Each vendor on its own bundle (nice with HTTP 2):

_webpack.prod.js_

```diff
...
  output: {
    filename: "js/[name].[chunkhash].js",
    assetModuleFilename: "images/[hash][ext][query]",
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'all',
-         name: 'vendor',
+         name: (module) => {
+           const packageName = module.context.match(
+             /[\\/]node_modules[\\/](.*?)([\\/]|$)/
+           )[1];
+           // npm package names are URL-safe, but some servers don't like @ symbols
+           return `vendor/${packageName.replace("@", "")}`;
+         },
          test: /[\\/]node_modules[\\/]/,
          enforce: true,
        },
      },
    },
  },
```


> References:
>
> [Webpack SplitChunks](https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks)
>
> https://medium.com/hackernoon/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
