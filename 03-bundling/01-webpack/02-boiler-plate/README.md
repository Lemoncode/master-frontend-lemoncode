# 02 Boilerplate

In this sample we are going to setup a web project that can be easily managed
by webpack.

We will setup an initial npm project, give support to ES6, and install webpack.
Then we will create a `helloworld.js` sample.

Summary steps:

- Prerequisites: Install Node.js
- Initialize `package.json` (npm init)
- Create a simple HTML file.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (min v8.9) if they are not already installed on your computer.

> Verify that you are running at least node v8.x.x and npm 5.x.x by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## steps

- Navigate to the folder where you are going to create the empty project.

- Execute `npm init`, you will be prompted to answer some information request about the project (once you have successfully fulfilled them a **`package.json`** file we will generated).

```bash
npm init -y
```

> by using "y" we agree with the default values the init ask for (beware if you have
> created a folder name that contains uppercase characters or blank spaces it will fail).

- Install **webpack** and **webpack-cli** locally, as a development dependency (the reason to install it locally and not globally is to be easy to setup, e.g. can be launched on a clean machine without having to install anything globally but nodejs).

```bash
npm install webpack webpack-cli --save-dev
```

- In order to launch webpack, modify the **`package.json`** file an add the following property `"start": "webpack"` under the scripts object. It allows us to launch webpack from the command line through npm typing `npm start`.

> In webpack 4 now is mandatory to inform the mode we are working on development or production (minified, etc...) in the command line where we call it.

Now, our **`package.json`** file should looks something like:

_./package.json_

```diff
{
...
  "scripts": {
+   "start": "webpack --mode development"
-   "test": "echo \"Error: no test specified\" && exit 1"
  },
...
}
```

> Webpack 4 offers a zero config entry point, this means: if you are not going to transpile your code
> and you have a default entry point under _./src/index.js_ it will work by default. This is nice to get
> some quick test code up and running, but on a real project is not enough, we will go the long way
> in this sample (create and configure the webpack.config.js).

- We will write es6 code but we need to transpile it to es5, in order to do that install `babel-core` plus `babel-preset-env` and save it as a dev dependency on the **`package.json`** file that has been previously generated.

We are going to start working with babel 7

```bash
npm install @babel/cli @babel/core @babel/preset-env --save-dev
```

- We need to install a "loader" (more on this in next modules) in order for webpack to be able to make use of `babel-core` transpiler.

```bash
npm install babel-loader --save-dev
```

Our **`package.json`** file should looks something like:

_./package.json_

```diff
{
...
  "devDependencies": {
+    "@babel/cli": "^7.12.1",
+    "@babel/core": "^7.12.3",
+    "@babel/preset-env": "^7.12.1",
+    "babel-loader": "^8.1.0",
+    "webpack": "^5.3.1",
+    "webpack-cli": "^4.1.0"
  }
}
```

- Now create a JavaScript file named **`students.js`** that will include ES6 syntax.

_./students.js_

```javascript
// Let's use some ES6 features
const averageScore = "90";
const messageToDisplay = `average score ${averageScore}`;

document.write(messageToDisplay);
```

- Now, it's time to add babel configuration file:

_./.babelrc_

```javascript
{
  "presets": ["@babel/preset-env"]
}
```

> More info about this config: https://babeljs.io/docs/en/babel-preset-env
> You can as well set this setting directly on webpack: https://blog.craftlab.hu/all-the-new-things-setting-up-webpack-4-with-babel-7-39a5225b8168

- We can continue with webpack configuration. Create an empty skeleton on a file named **`webpack.config.js`**, and indicate the js entry point.

_./webpack.config.js_

```javascript
module.exports = {
  entry: ["./students.js"],
};
```

- Now add support for es6, we will ask webpack to handle all js files under the project folder (excluding the `node_modules` sub-folder) and transpile them from es6 to es5 (using the `babel-loader`).

_./webpack.config.js_

```diff
module.exports = {
  entry: ['./students.js'],
+ module: {
+   rules: [
+     {
+       test: /\.js$/,
+       exclude: /node_modules/,
+       loader: 'babel-loader',
+     },
+   ],
+ },
};
```

- Let's run webpack from the command line, type `npm start` and press enter.

```bash
npm start
```

- We can check that a file named **`bundle.js`** has been generated.

- if we open the **`bundle.js`** file we can check that it contains (amongst other boiler plate code) the transpiled to es5 version of **`students.js`**.

_./dist/bundle.js_

```javascript
...
/***/ "./students.js":
/*!*********************!*\
  !*** ./students.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var averageScore = \"90\";\nvar messageToDisplay = \"average score \".concat(averageScore);\ndocument.write(messageToDisplay);\n\n//# sourceURL=webpack:///./students.js?");

/***/ }),
...
```

- Create now a simple HTML file, **`index.html`**, and include a script tag that will point to our generated **`bundle.js`** file.

_./index.html_

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Webpack by sample</title>
  </head>
  <body>
    Hello Webpack!
    <script src="./dist/main.js"></script>
  </body>
</html>
```

> IMPORTANT: This is not the best way to include an HTML file and link it with webpack,
> we will learn how to do this in a proper way later on.

- Now we can click on the html file and see our small piece of code up and running.

> **Note down** this is not the optimal solution, in next steps we will proper generate
> an HTML file and use a plugin to inject the starting scripts.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
