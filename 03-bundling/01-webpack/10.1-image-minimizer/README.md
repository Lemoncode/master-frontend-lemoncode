# 11 Images optimization

In this demo we are going to optimize the images in our project using image compression, to do that we are going to use a new plugin:
[`ImageMinimizerWebpackPlugin`](https://webpack.js.org/plugins/image-minimizer-webpack-plugin/).

We will start from sample _10-images_.

Summary steps:

- Add four images to our project (.gif, .jpg, .png and .svg).
- Add all the images from JavaScript.
- Install [`ImageMinimizerWebpackPlugin`](https://webpack.js.org/plugins/image-minimizer-webpack-plugin/).
- Configure the plugin.

# Steps to build it

## Prerequisites

You will need to have nodejs installed in your computer (at least v 8.9.2). If you want to follow the steps of this guide you must take as starting point the sample _10-images_.

## Steps

- Run `npm install` to install previous sample packages:

```
npm install
```

- Let's start by cleaning up our _`index.html`_. We are going to remove all the body content and add four divs for our images:

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
-    <img src="./content/logo_2.png"/>
-    <div class="red-background">RedBackground stuff</div>

+   <div id="gifImg"></div>
+   <div id="jpgImg"></div>
+   <div id="pngImg"></div>
+   <div id="svgImg"></div>

-    Hello Webpack 4!
-    <div class="red-background">
-      RedBackground stuff
-    </div>
  </body>
</html>
```

- We will continue by deleting the content inside the **src** folder and adding four new images with differents formats:

  - [`lemon_gif.gif`](./src/content/lemon_gif.gif)
  - [`lemon_jpg.jpg`](./src/content/lemon_jpg.jpg)
  - [`lemon_png.png`](./src/content/lemon_png.png)
  - [`lemon_svg.svg`](./src/content/lemon_svg.svg)

- Let's jump into _`index.js`_ and import the images using JavaScript. Then, let's place it under a `<div>` with a given `id`.
  Don't forget to delete the previous image import.

_./src/index.js_

```diff
import {getAvg} from "./averageService";
- import logoImg from './content/logo_1.png';
+ import gifImage from "./content/lemon_gif.gif";
+ import jpgImage from "./content/lemon_jpg.jpg";
+ import pngImage from "./content/lemon_png.png";
+ import svgImage from "./content/lemon_svg.svg";

$('body').css('background-color', 'lightSkyBlue');

const scores = [90, 75, 60, 99, 94, 30];
const averageScore = getAvg(scores);

const messageToDisplay = `average score ${averageScore}`;

document.write(messageToDisplay);

- const img = document.createElement('img');
- img.src = logoImg;

- document.getElementById('imgContainer').appendChild(img);

+ const imageGif = document.createElement("img");
+ imageGif.src = gifImage;
+ const imagejpg = document.createElement("img");
+ imagejpg.src = jpgImage;
+ const imagePng = document.createElement("img");
+ imagePng.src = pngImage;
+ const imageSvg = document.createElement("img");
+ imageSvg.src = svgImage;

+ document.getElementById("gifImg").appendChild(imageGif);
+ document.getElementById("jpgImg").appendChild(imagejpg);
+ document.getElementById("pngImg").appendChild(imagePng);
+ document.getElementById("svgImg").appendChild(imageSvg);

```

- Now we need to add the _gif_ and the _svg_ extensions to the loader so that webpack can recognize the images,
  lets update our _`webpack.config.js`_.

_[webpack.config.js](webpack.config.js)_

```diff
  module: {
    rules: [
      ...
     {
-     test: /\.(png|jpg)$/,
+     test: /\.(png|jpg|gif|svg)$/,
      type: 'asset/resource',
     },
    ],
  },
```

- And run `npm start`. We should be able to view the images in the browser.

```bash
npm start
```

- Now stop the server, type _npm run build_ and watch the weight of the images inside _dist_ folder.

```bash
npm run build
```

- We are going to install and configure [`ImageMinimizerWebpackPlugin`](https://webpack.js.org/plugins/image-minimizer-webpack-plugin/),
  after doing that the weight of the images should have decreased.

```bash
npm install image-minimizer-webpack-plugin --save-dev
```

- There are two ways of compressing images, lossless or lossy optimization, we are going to use the lossless option.

```bash
npm install imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo --save-dev
```

- Now let's configure the `webpack.config.js`, for `imagemin-svgo` need use svgo [`configuration`](https://github.com/svg/svgo#configuration)

_[webpack.config.js](webpack.config.js)_

```diff
+ const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
+ const { extendDefaultPlugins } = require("svgo");

  plugins: [
    ...
+    new ImageMinimizerPlugin({
+      minimizerOptions: {
+        // Lossless optimization with custom option
+        // Feel free to experiment with options for better result for you
+        plugins: [
+          ["gifsicle", { interlaced: true }],
+          ["jpegtran", { progressive: true }],
+          ["optipng", { optimizationLevel: 5 }],
+          // Svgo configuration here https://github.com/svg/svgo#configuration
+          [
+            "svgo",
+            {
+              plugins: extendDefaultPlugins([
+                {
+                  name: "removeViewBox",
+                  active: false,
+                },
+                {
+                  name: "addAttributesToSVGElement",
+                  params: {
+                    attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
+                  },
+                },
+              ]),
+            },
+          ],
+        ],
+      },
+    }),
  ],

```

- TODO: solve problem

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
