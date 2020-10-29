# 06 Custom CSS

Let's get started working with styles.

In this demo will create a custom CSS file (it will contain a simple css class
that will setup a background color to red).

We will start from sample _05 Output_.

Summary steps:

- Create a custom css file.
- Install style loader and css loader packages.
- Configure webpackconfig.

# Steps to build it

## Prerequisites

Prerequisites, you will need to have nodejs (at least v 8.9.2) installed in your computer. If you want to follow this step guides you will need to take as starting point sample _05-output_.

## steps

- `npm install` to install previous sample packages:

```
npm install
```

- Now let's create a simple CSS file that will add a red background when
  used on some e.g. div. (we will name it `mystyles.css`):

_./mystyles.css_

```css
.red-background {
  background-color: indianred;
}
```

- And now we can just use this style directly in our HTML file (so far so good, if we run this project now we won't see this styles applied, we have to go through some webpack configuration), let's update `index.html`

_./index.html_

```diff
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Webpack by sample</title>
</head>

<body>
  Hello Webpack!
+  <div class="red-background">
+   RedBackground stuff
+  </div>
</body>
</html>

```

- Let's start installing `style-loader` and `css-loader` as dev dependencies.
  - `css-loader` will allow us load `.css` files.
  - `style-loader` is to insert styles in html file, so we can use these styles.

```bash
npm install style-loader css-loader --save-dev
```

- Let's add this style to our entry point, first our entry point will hold more
  entries, but in this case we will define it as named entries.

_webpack.config.js_

```diff
module.exports = {
-  entry: ['./students.js'],
+ entry: ['./students.js', './mystyles.css'],
  output: {
    filename: 'bundle.js',
  },
```

- If we launch a webpack build this will throw errors, that's because we haven't
  defined any loader to handle the css extension. To configure webpack
  properly let's add to the loader section a css entry and execute first
  the css-loader extension (handle css files), then the style-loader (add CSS to the down by injecting a styler class).

_webpack.config.js_

```diff
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
+     {
+       test: /\.css$/,
+       exclude: /node_modules/,
+       use: [
+         {
+           loader: 'style-loader',
+         },
+         {
+           loader: 'css-loader',
+         },
+       ],
+     },
    ],
  },
```

> Remember to stop and start your light server whenver you make changes on your _webpack.config_ file.

- Now we can just execute the app (npm start) and check how the red background is
  being displayed on the div we have chosen.

```bash
npm start
```

- So far so good, if we make an _npm run build_ we can check that myStyles.css has been embedded
  into the _bundle.js_ file. In some case we may preffer divide the application into several
  bundle files, let' see how can we chop this.

> We will create three main groups: app, appStyles and vendor (for third partie libraries)

- On the entry side let's create two groups

_webpack.config.js_

```diff
module.exports = {
-  entry: ['./students.js', './mystyles.css'],
+  entry: {
+    app: './students.js',
+    appStyles: [
+      './mystyles.css',
+    ],
+  },

  output: {
```

- In the output section let's create define a pattern for the output filenames (chunks)

_webpack.config.json_

```diff
  entry: {
    app: "./students.js",
    appStyles: ["./mystyles.css"],
  },
+ output: {
+   filename: '[name].[chunkhash].js',
+},
```

- As we notice, we don't need to use `hash` flag from `HtmlWebpackPlugin` because all chunks has same value, the `chunkhash` is the best due to it changes when content does it.

_webpack.config.json_

```diff
...
  plugins: [
    //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html', //Name of file in ./dist/
      template: 'index.html', //Name of template in ./src
-     hash: true,
    }),
  ],
```

- Check the build:

```bash
npm run build
```

- Before running a build let's ensure we clear the dist folder.

```bash
npm install clean-webpack-plugin --save-dev
```

- Let's add this webpack plugin in it's config section

_webpack.config.json_

```diff
const HtmlWebpackPlugin = require("html-webpack-plugin");
+ const {CleanWebpackPlugin} = require('clean-webpack-plugin')
+ const path = require('path')
```

```diff
  output: {
    filename: "[name].[chunkhash].js",
+    path: path.resolve(process.cwd(), 'dist'),
  },
```

```diff
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html", //Name of file in ./dist/
      template: "index.html", //Name of template in ./src
    }),
+    new CleanWebpackPlugin(),
  ],
```

- Now if we run a build

```
npm run build
```

- We can check that we get two chunks app and appStyles.

- Now we can see tha the styles are enclosed in a js file, what if we want to keep it as a separated
  css file? We can make use of MiniCssExtractPlugin.

```bash
npm install mini-css-extract-plugin --save-dev
```

> In the webpack roadmap (versions 4.x or 5) it supposed that the core webpack functionallity will
> implement the functionallity of this plugin.

- Let's to configure loader:

- Reference the plugin.

_webpack.config.js_

```diff
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
+ const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const webpack = require('webpack');

module.exports = {
```

- Configure the loader for the _.css_ extension

```diff
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
         exclude: /node_modules/,
-        use: [
-          {
-            loader: 'style-loader',
-          },
-          {
-            loader: 'css-loader',
-          },
-         ],
+       use: [
+          MiniCssExtractPlugin.loader,
+         "css-loader"
+        ]
      },
    ],
  },
```

- Finally, add the plugin object for this package:

```diff
  plugins: [
    //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html', //Name of file in ./dist/
      template: 'index.html', //Name of template in ./src
    }),
+   new MiniCssExtractPlugin({
+     filename: "[name].css",
+     chunkFilename: "[id].css"
+   }),
  ],
```

- Running `webpack` again, it split into two files `appStyles.js` and `appStyles.css` and how to size decrease:

- Now if we run a build, we will see that dist folder is wiped and we get only the new generated fresh
  content.

```bash
npm run build
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
