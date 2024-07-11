# 03 Webpack React

## Summary

This example takes the _02-webpack-boiler_ example as a starting point.

We will go step by step adding the necessary configuration so that we integrate
**React** into our build process.

# Step by Step guide

- First we copy the previous example, and do a _npm install_

```bash
npm install
```

- Let's install _react_ and _react-dom_

```bash
npm install react react-dom --save
```

- Let's install _react_ and _react-dom_ typings

```bash
npm install @types/react @types/react-dom --save-dev
```

This way we have the React library and the bindings to integrate with a web browser.

- In the index.html we are going to put the _div_ that will serve as entry point to instantiate our React application. our React application.

_./src/index.html_

```diff
  <body>
-    <h1 class="my-text">Hello World !</h1>
+    <div id="root"></div>
  </body>
```

- Let's create our first React component.

_./src/app.tsx_

```tsx
import React from "react";

export const App = () => {
  return <h1>Hello React !!</h1>;
};
```

- It's time to instantiate that main component, to be able to integrate it with the browser we have to make use of _createRoot_.

_./src/index.tsx_

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(<App />);
```

- We are on the right track, but if we try to run this it will fail, since _babel_ does not know how to transform the _jsx_ (remember that this was a sugar, which was actually an XML) into javaScript, in order for babel to be able to understand this we have to install the _preset_ _@babel/preset-react_

First we install it and the configure it.

```bash
npm install @babel/preset-react --save-dev
```

_.babelrc_

```diff
{
  "presets": [
      "@babel/preset-env",
      "@babel/preset-typescript",
+     "@babel/preset-react"
  ]
}
```

> By the way the _rc_ suffix is pretty usual in linux it's stands for "runcom"
> (CTSS system 1962-63) Script file containing startup instructions for an application program.
> In other words, "rc" is just something that stuck from back in the sixties, and has been used quite often for configuration files in different sorts of programs since, including Node, Babel and many, many others.
> More info [on stackoverflow](https://stackoverflow.com/questions/36212256/what-are-rc-files-in-nodejs).

> Another curiosity... what is a _preset_ ... let's start with what is a babel plugin: babel transformations are
> enabled by applying plugins, there are plenty of plugins and if you have to go adding one by one it can become a nightmare,
> in order to make this easier, babel has grouped common sets of plugins in _presets_, for instance @babel-preset-react
> includes the following plugins:

- @babel/plugin-syntax-jsx
- @babel/plugin-transform-react-jsx
- @babel/plugin-transform-react-display-name

- Is time to double check the _webpack.config.js_

- We can make sure that we have _ts_ and _tsx_ as valid extensions.
- Also that in the loader we accept both _ts_ and _tsx_.
- And in the app we have as entry point _index.tsx_.

* Let's check that things are working as expected:

```bash
npm start
```
