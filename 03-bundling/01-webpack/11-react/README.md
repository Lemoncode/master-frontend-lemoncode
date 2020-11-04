# 11 React

In this demo we add support for [React](https://reactjs.org/).

We start from sample _10-images_, install React locally, rename students.js to students.jsx and include some basic rendering.

Summary steps:

- Install [React](https://facebook.github.io/react/) as a local dependency.
- Update `students.js` to `students.jsx` and update its content accordingly.
- Resolve the `jsx` extensions and point out that the entry point has changed.
- Configure the `webpack.config.js` to support `jsx`.

# Steps to build it

## Prerequisites

You need to have [Node.js](https://nodejs.org/en/) installed in your computer. If you want to follow this step guide you need to take sample _10 Images_ as starting point.

## Steps

- Let's start by doing some cleanup in our starting example:

- Let's remove the image tag, the image div containter, red-background div, in our HTML file:

_./index.html_

```diff
  <body>
-    <div id="imgContainer"></div>
    Hello Webpack!
-    <img src="./content/logo_2.png" />
-    <div class="red-background">
-      RedBackground stuff
-    </div>
  </body>
```

- `npm install` to install previous sample packages:

```bash
 npm install
```

- React is an quite popular open source library for building user interfaces. Let's start by installing the library which is splitted into 2: [react](https://www.npmjs.com/package/react) as the core library and [react-dom](https://www.npmjs.com/package/react-dom) as the glue between React and the DOM.

```bash
npm install react react-dom --save
```

- In the _`index.html`_ file let's add a `<div>` element that will be the entry point for our React app.

### ./src/index.html

```diff
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Webpack 4.x by sample</title>
  </head>
  <body>
    Hello Webpack 4!
+   <div id="root"></div>
  </body>
</html>

```

- Let's create our first React component under `src` folder called `AverageComponent`:

### ./src/averageComponent.jsx

```javascript
import React from "react";
import { getAvg } from "./averageService";

export const AverageComponent = () => {
  const [average, setAverage] = React.useState(0);

  React.useEffect(() => {
    const scores = [90, 75, 60, 99, 94, 30];
    setAverage(getAvg(scores));
  }, []);

  return (
    <div>
      <span>Students average: {average}</span>
    </div>
  );
};
```

- Let's rename `index.js` to `index.jsx` anf fully replace the content:

### ./src/index.jsx

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { AverageComponent } from "./averageComponent";

ReactDOM.render(
  <div>
    <h1>Hello from React DOM</h1>
    <AverageComponent />
  </div>,
  document.getElementById("root")
);
```

- For _Babel_ to parse React `jsx` files we need to install [_babel-preset-react_](https://github.com/babel/babel/tree/master/packages/babel-preset-react).

```bash
npm install @babel/preset-react --save-dev
```

- Add it to `.babelrc` config:

### ./.babelrc

```diff
{
- "presets": ["@babel/preset-env"]
+ "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

- It's time to update _`webpack.config.js`_. We start by adding the resolve `jsx` extension:

### ./webpack.config.js

```diff
  ...
  module.exports = {
    context: path.join(basePath, 'src'),
+   resolve: {
+     extensions: ['.js', '.jsx'],
+   },
    entry: {
-     app: ['./index.js'],
+     app: ['./index.jsx'],
      ...
    },
    ...
  };
```

- Next, in the loaders section, we need to indicate to _babel-loader_ that it should not operate on `js` files but on **`jsx`** files, and that it should take into account React preset.

### ./webpack.config.js

```diff
  ...
  module.exports = {
    ...
    module: {
      rules: [
        {
-         test: /\.js$/,
+         test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        ...
      ],
    },
    ...
  };

```

- Finally, when we run the app, we see React in action.

```bash
  npm start
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
