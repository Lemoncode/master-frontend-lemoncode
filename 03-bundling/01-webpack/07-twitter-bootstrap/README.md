# 07 Import Twitter Bootstrap

In this demo we will install and configure webpack to import the well known
[Bootstrap](https://getbootstrap.com/) CSS library.

We will start from sample _06-custom-css_.

Summary steps:

- Install Bootstrap.
- Import the CSS library.
- Use a jumbotron element from Bootstrap in our HTML.
- Check that we get errors when running webpack.
- Install additional loaders in order to manage fonts and other
  files required by Bootstrap.
- Check results.

# Steps to build it

## Prerequisites

Prerequisites, you will need to have nodejs (at least v 8.9.2) installed in your computer. If you want to follow this step guides you will need to take as starting point sample _01 Styles / 01 Custom CSS_.

## steps

- `npm install` to install previous sample packages:

```
npm install
```

- Let's start by installing Bootstrap:

```
npm install bootstrap --save
```

- Now, let's import the CSS library in order to include it in our project:

_webpack.config.js_

```diff
module.exports = {
  entry: {
    app: ['regenerator-runtime/runtime', './students.js'],
    appStyles: ['./mystyles.css'],
+   vendorStyles: ['./node_modules/bootstrap/dist/css/bootstrap.css'],
  },
```

- Let's modify our _index.html_ and include some specific Bootstrap component:

_index.html_

```diff
<body>
+    <div class="jumbotron">
+      <h1>Testing Bootstrap</h1>
+      <p>
+        Bootstrap is the most popular ...
+      </p>
+    </div>

  Hello Webpack 4!
  <div class="red-background">
    RedBackground stuff
  </div>
</body>
```

- Now that we are using bootstrap that is located
  under the _node_modules_ folder we need to
  dig into that

```diff
{
  test: /\.css$/,
-  exclude: /node_modules/,
  use: [MiniCssExtractPlugin.loader, "css-loader"]
}
```

- Try to run webpack now, just type in the command line:

```bash
npm start
```

> Bootstrap 4 does not ship glyphicons or other type of files, if you are working
> with version 3 you will need additional plumbing (check out the version 3)

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
