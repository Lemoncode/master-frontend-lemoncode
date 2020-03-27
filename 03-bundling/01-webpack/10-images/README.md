# 10 Handling Images

In this demo we are going to include images in our project in two flavours: via JavaScript and via HTML.
On the JavaScript side we will see it's something straightforward (using the same plugins we used for fonts), for the HTML we will use a new loader: [`html-loader`](https://github.com/webpack-contrib/html-loader).

We will start from sample _09-refactor-src_.

Summary steps:

- Add two images to our project.
- Add first image from JavaScript.
- Add second image from HTML.
- Install [`html-loader`](https://github.com/webpack-contrib/html-loader).
- Configure the loader.

# Steps to build it

## Prerequisites

You will need to have nodejs installed in your computer (at least v 8.9.2). If you want to follow the steps of this guide you must take as starting point the sample _03 SASS_.

## Steps

- Run `npm install` to install previous sample packages:

```
npm install
```

- Let's start by cleaning up our _`index.html`_. We are going to remove the Bootstrap's _jumbotron_ component and add a `<div>` element with a given `id`:

_./src/index.html_

```diff
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Webpack 3.x by sample</title>
  </head>
  <body>
-   <div class="jumbotron">
-     <h1>Testing Bootstrap</h1>
-     <p>
-       Bootstrap is the most popular ...
-     </p>
-   </div>
+   <div id="imgContainer"></div>
    Hello Webpack 4!
    <div class="red-background">
      RedBackground stuff
    </div>
  </body>
</html>
```

- We will continue by creating a folder named **content** inside the **src** folder, and adding two images there: [`logo_1`](./src/content/logo_1.png) and [`logo_2`](./src/content/logo_2.png).

- Let's jump into _`index.js`_ and import [`logo_1`](./src/content/logo_1.png) using JavaScript.
  Then, let's place it under a `<div>` with a given `id`:

_./src/index.js_

```diff
import {getAvg} from "./averageService";
+ import logoImg from './content/logo_1.png';

$('body').css('background-color', 'lightSkyBlue');

const scores = [90, 75, 60, 99, 94, 30];
const averageScore = getAvg(scores);

const messageToDisplay = `average score ${averageScore}`;

document.write(messageToDisplay);

+ const img = document.createElement('img');
+ img.src = logoImg;

+ document.getElementById('imgContainer').appendChild(img);
```

- Let's install _url-loader_ this will let us include in the bundle or split into a separate file a given file
  depending on it's size and _file-loader_ this loader will let us manage with raw folder.

```bash
npm install url-loader file-loader --save-dev
```

- Now that we have already installed _url-loader_ plugin, we only need to configure the extension png/jpeg in the _`webpack.config.js`_ loaders section. One thing to note down is that we are adding an additional parameter to the url-loader called **limit**. By using this parameter we are telling the loader to encode the image if its size is less than 5KB approx and embed it directly in the HTML file.

_[webpack.config.js](webpack.config.js)_

```diff
  module: {
    rules: [
      ...
+     {
+       test: /\.(png|jpg)$/,
+       exclude: /node_modules/,
+       loader: 'url-loader?limit=5000',
+     },
    ],
  },
```

- Next, we will add some styles for the images in our CSS file:

_./src/mystyles.scss_

```diff
$blue-color: teal;

.red-background {
 background-color: $blue-color;
}

+ img {
+   display: block;
+   width: 200px;
+ }
```

- And run `npm start`. We should be able to view the image in the browser.

```bash
npm start
```

- That's fine but what if we had already the image referenced inside a HTML `<img>` tag? Let's add [`logo_2.png`](./src/content/logo_2.png) into the index.html file:

### ./index.html

```diff
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Webpack 3.x by sample</title>
  </head>
  <body>
    <div id="imgContainer"></div>
    Hello Webpack 4!
+   <img src="./src/content/logo_2.png"/>
    <div class="red-background">
      RedBackground stuff
    </div>
  </body>
</html>
```

- Now if run the app (`npm start`) we can check that both logo images are being shown.

```bash
npm start
```

- Finally, if we open the developer tools in our browser we can see that a `<img>` has been inserted under the `<div>` element, and also that its `src` attribute has changed:

- But we are referencing [`logo_2`](./src/content/logo_2.png) from `./src..` path. Whats if we upload to production? We loose the reference so we need to process this kind of files using `html-loader`:

```bash
npm install html-loader --save-dev
```

- And configure the loader for the _.html_ files

_webpack.config.js_

```diff
      {
        test: /\.(png|jpg)$/,
        exclude: /node_modules/,
        loader: 'url-loader?limit=5000',
      },
+     {
+      test: /\.html$/,
+      loader: 'html-loader',
+     },
    ],
  },
```

- And remember that the webpack `context` is over `./src` so:

_./src/index.html_

```diff
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Webpack 3.x by sample</title>
  </head>
  <body>
    <div id="imgContainer"></div>
    Hello Webpack 4!
-   <img src="./src/content/logo_2.png" />
+   <img src="./content/logo_2.png" />
    <div class="red-background">
      RedBackground stuff
    </div>
  </body>
</html>
```

- We can see now that image is auto referenced (F12 developer tools...).

- Let's check that this is working fine in our generated bundle.

- We are going to install a lite web server globally (lite-server).

```bash
npm install lite-server -g
```

- Let's generate the bundle:

```
npm run build
```

- Let's open the terminal, hop in to _dist_ folder

```bash
cd dist
```

- Let's run connect and open a browser to check if the image is shown or not (lite server is running under http://localhost:3000).

```bash
lite-server
```

# Appendix - Organize dist folder into subfolders

It will be possible to organize `dist` folder into subfolders.

To do this we will need to modify the _webpack.config.js_ file.

We have to modify the loader for `.png` and `.jpg` files to add a parameter called **name** to especify the subfolder:

_webpack.config.js_

```diff
      {
       test: /\.(png|jpg)$/,
       exclude: /node_modules/,
-      loader: 'url-loader?limit=5000',
+      use: {
+        loader: 'url-loader',
+        options: {
+          limit: 5000,
+          name: './img/[hash].[name].[ext]',
+        },
+      },
      },
```

It's also possible to organize the `.js` and `.css` files into their own subfolders.

In the case of the `.js` files we will have to add the subfolder name in the **filename** parameter:

```diff
  output: {
-    filename: '[name].[chunkhash].js',
+    filename: './js/[name].[chunkhash].js',
  },
```

For the `.css` files we need to modify the **filename** parameter in the MiniCssExtractPlugin:

```diff
new MiniCssExtractPlugin({
- filename: "[name].[chunkhash].css",
+ filename: "./css/[name].[chunkhash].css",
  chunkFilename: "[id].css"
})
```

- Important to replace optimization splitChunks by:

```diff
...
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'all',
          name: 'vendor',
-         test: /[\\/]node_modules[\\/]$/,
+         test: /[\\/]node_modules[\\/]((?!s?css).)*$/,
          enforce: true,
        },
      },
    },
  },
...
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
