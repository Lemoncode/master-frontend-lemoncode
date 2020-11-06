# 04 Server

In this sample we are going to enter into "dev mode". Working with files service
is not ideal when you are developing a web application, we will learn how to launch
a lite web server, how deploy our bundle into a dist folder (including `index.html`)
, how to debug our ES6 code directly into the browser debugger and minify
our `bundle.js`.

We will start from sample _03 Import_, install `webpack-dev-server`, setup our config
to deploy on config folder and support maps (debug), then we will minify
our `bundle.js` file via webpack cli params.

Summary steps:

- Install via npm webpack-dev-server.
- Execute webpack-dev-server with live reload.
- Add start command to `package.json`.

# Steps to build it

## Prerequisites

Prerequisites, you will need to have nodejs (at least v 8.9.2) installed in your computer. If you want to follow this step guides you will need to take as starting point sample _02 Import_.

## steps

- `npm install` to install previous sample packages:

```
npm install
```

- Let's install `webpack-dev-server`, this package ships with a lite server that we
  can use as dev web server.

```
npm install webpack-dev-server --save-dev
```

- Let's reconfigure our _package.json_ _start_ command and add a new custom command that we will call _build_.

### ./package.json

```diff
  "scripts": {
-   "start": "webpack --mode development"
+   "start": "webpack serve",
+   "build": "webpack --mode development"
  },
```

- Before running the project, we have to realize that this server runs in memory, and it won't dump info into the
  _dist_ folder, right now we will make a workaround, update the path on the index.html file for the _bundle.js_
  file, in later samples we will learn a better way to reference the bundled files into HTML (using HTMLWebpackPlugin)

_index.html_

```diff
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Webpack 4.x by sample</title>
  </head>
  <body>
    Hello Webpack 4!
-    <script src="./dist/main.js"></script>
+    <script src="main.js"></script>
  </body>
</html>

```

- Now if we type from the command prompt.

```bash
npm start
```

- If we open a browser we can point the url to http://localhost:8080 and we will browse our web app.

- One interesting feature that ships this dev server is **live reloading**, thus any changes introduced in any of the JavaScript files will be automatically detected and webpack dev server will launch the build process and once finished automatically refresh the page being display in the browser. In order to do this we don't need to do anything.

- If we want to run _webpack_ build, we only need to type from the command prompt:

```bash
npm run build
```

- Finally, we can configure this server in _`webpack.config.js`_:

_./webpack.config.js_

```diff
module.exports = {
  entry: ['./students.js'],
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
+ devServer: {
+   port: 8081,
+ },
};

```

- Now, it's running on 8081 port.

- We can restore default port:

_./webpack.config.js_

```diff
module.exports = {
  entry: ['./students.js'],
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  devServer: {
-   port: 8081,
+   port: 8080,
  },
};
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
