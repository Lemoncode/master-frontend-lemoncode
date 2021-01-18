# 05 Output

In this sample we are going to use webpack default _dist_ config and
copy our main HTML page to that distribution path.

> Note down by default webpack uses _dist_ folder as default configuration.

We will start from sample _04 Server_,

Summary steps:

- Redirect output (`bundle.js`) to "dist" folder.
- Include into the build proccess: copying the `index.html` file to "dist" folder
- Let webpack include the `bundle.js` script into the `index.html` file.
- Add map support in order to enable ES6 files to be debugged directly on the browser.
- Generate a minified version of the `bundle.js`.

## Prerequisites

You will need to have nodejs installed in your computer (at least 8.9.2). If you want to follow this step-by-step guide you will need to take as starting point sample _00 Intro/03 Server_.

## steps

- `npm install` to install previous sample packages:

```bash
npm install
```

- If we run an npm build we will see that automatically the generated bundle is copied under the
  _dist_ folder (we can add plumbing into our webpack.config to change this folder if needed).

```bash
npm run build
```

- That's fine, but we need to copy as well the HTML to the dist folder, and... wouldn't it
  be nice that webpack could be able to automatically inject the bundle script into the dist
  copy of the HTML file? There's a plugin that will do that for you _html-webpack-plugin_, let's
  start by installing it.

```bash
npm install html-webpack-plugin --save-dev
```

- Let's remove from our base `index.html` the script tag:

_./index.html_

```diff
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
-   <script src="./main.js"></script>
  </body>
</html>

```

- This plugin (html-webpack-plugin) will take as template input our `index.html`, and we will point an output destination (`index.html` under dist folder). The plugin will copy `index.html` into destination and inject the script tag including a hash tag to avoid browser caching when new versions are being deployed. Once we have installed it, we need to require it on top of our `webpack.config.js` file:

```diff
+ const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['./students.js'],
  output: {
    filename: 'bundle.js',
  },
```

- In order to configure it we have to add the following section
  on our `webpack.config.js` (right after modules definition).

_webpack.config.js_

```diff
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ]
  },
+ plugins: [
+   //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
+   new HtmlWebpackPlugin({
+     filename: 'index.html', //Name of file in ./dist/
+     template: 'index.html', //Name of template in ./src
+    }),
+ ],
```

- Now if we run webpack we will realize that `index.html` is copied under the dist folder and the script tag is automatically being generated. There is only one caveat... we are not getting any additional hash param to avoid browser caching, we can do that by setting the option hash to true:

```bash
npm run build
```

- Let's add an additional param that will add a hash value to the generatd script entry in the HTML.

```diff
  plugins: [
    //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html', //Name of file in ./dist/
      template: 'index.html', //Name of template in ./src
+     hash:true,
    }),
  ],
```

- Let's run the build and check that now we get a hash on our script.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
