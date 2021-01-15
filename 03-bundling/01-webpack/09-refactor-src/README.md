# 09 Refactor SRC

So far we have doing progress without following conventions, this time
we are going to setup our project structure following naming and folder
conventions.

We will start from sample _08-sass_.

Summary steps:

- Move _js_ and _css_ file under a new folder called _src_
- Configure _webpack.config_ to set _src_ as working folder.

# Steps to build it

## Prerequisites

Prerequisites, you will need to have nodejs installed in your computer (at least v 8.9.2). If you want to follow this step guides you will need to take as starting point sample _02 Twitter Bootstrap_.

## steps

- `npm install` to install previous sample packages:

```bash
npm install
```

- It's time to refactor a bit our solution to make it more maintaneable.

- To keep maintainable our source code, let's create a `src` folder and move the following files into:

  - Move to `./src/averageService.js`.
  - Move to `./src/index.html`.
  - Move to `./src/mystyles.scss`.
  - Move to `./src/students.js` and rename it to `./src/index.js`

- After this, we must modify the path into our _webpack.config.js_ file, for these files to be found.

```diff
...

+ const basePath = __dirname;

module.exports = {
+ context: path.join(basePath, 'src'),
  entry: {
-    app: ['./students.js'],
+    app: ['./index.js'],
    appStyles: ['./mystyles.scss'],
    vendorStyles: [
-     './node_modules/bootstrap/dist/css/bootstrap.css',
+     '../node_modules/bootstrap/dist/css/bootstrap.css',
    ],
  },
```

- Let's check that the app is still working after this folder structure refactor.

```bash
npm start
```

- We did it!

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
