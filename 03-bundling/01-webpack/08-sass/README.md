# 08 SASS

In this demo we rename our css file to scss extension and add a simple SASS variable. We will learn how to add a loader that can
make the SASS preprocess and then chain it to our css / style pipe.

We will start from sample _01 Styles/02 Twitter Bootstrap_.

Summary steps:

- Rename `mystyles.css` to scss.
- Add some SASS specific code.
- Install a SASS preprocessor loader.
- Add this preprocessor to the pipe (update `webpack.config.js`).

# Steps to build it

## Prerequisites

Prerequisites, you will need to have nodejs installed in your computer (at least v 8.9.2). If you want to follow this step guides you will need to take as starting point sample _02 Twitter Bootstrap_.

## steps

- `npm install` to install previous sample packages:

```bash
npm install
```

- Let's start by renaming `mystyles.css` to `mystyles.scss`

- Let's open `mystyles.scss` and add some sass simple code (in this case we will create a variable that will hold a blue background, this will introduce a change into our sample app, a blue background will be displayed instead of the former red one):

### ./mystyles.scss

```diff
+ $blue-color: teal;

.red-background {
- background-color: indianred;
+ background-color: $blue-color;
}

```

- Once we have changed the extension of the css file to scss, we have to update the `webpack.config.js` file.

### ./webpack.config.js

```diff
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

//...

module.exports = {
  entry: {
    app: ['regenerator-runtime/runtime', './students.js'],
    appStyles: [
-     './mystyles.css',
+     './mystyles.scss',
      ...
    ],
  },
  ...
};
```

- Now it's time to start with the webpack plumbing. Let's install a [sass-loader](https://github.com/webpack-contrib/sass-loader) that requires [sass](https://github.com/sass/sass) as dependency:

```bash
npm install sass sass-loader --save-dev
```

- We only need one more step. Open our `webpack.config.js` and add a new entry (scss) to the loaders that will use the just installed sass-loader. Interesting to note down: we are chaining loaders, first we preprocess the scss, then we apply the previous loaders to the resulting css.

- Important here, we need to split in two loaders, first one using `sass-loader` for appStyles and second one using previous configuration for vendorStyles:

```diff
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
+     {
+       test: /\.scss$/,
+       exclude: /node_modules/,
+       use: [
+         MiniCssExtractPlugin.loader,
+         "css-loader",
+         {
+           loader: "sass-loader",
+           options: {
+             implementation: require("sass")
+           }
+         },
+       ]
+     },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },
```

- If we run our app (`npm start`), we can check that now we are getting a blue background instead of a red one.

```bash
npm start
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
