# CSS Modules

Let's check how easy is to integrate css modules in your bundle.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (min v8.9) if they are not already installed on your computer.

> Verify that you are running at least node v8.x.x and npm 5.x.x by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from _07-react_. Just copy the project and execute _npm install_

```bash
npm install
```

- Let's install _postcss-modules_

```bash
npm install postcss-modules --save-dev
```

- Let's add postcssrc file

_./.postcssrc_

```javascript
{
  "modules": true,
  "plugins": {
    "postcss-modules": {
      "generateScopedName": "_[name]__[local]"
    }
  }
}
```

- Let's add some styles in the [_mystyles.scss_] file

```css
.hello {
  background-color: $blue-color;

  .logo {
    width: 150px;
  }
}
```

- Now let's modify the component called **HelloComponent** in the [_hello.tsx_] file. Let's import scss file and use the classes module

```javascript
import React from "react";
import logo from "./content/logo_1.png";
import * as classes from "./mystyles.scss";

export const HelloComponent: React.FC = () => {
  return (
    <div className={classes.hello}>
      <img src={logo} className={classes.logo} />
      <h2>Hello from React</h2>
    </div>
  );
};
```

> If you get a warning about using required, try: npm i @types/node --save-dev

- Visual Studio Code gives us errors because it doesn't know how to import _png_ and _scss_ files, let's declare them as modules.

_./src/declaration.d.ts_

```typescript
declare module "*.scss";
declare module "*.png";
```

- Let's run the sample.

```bash
npm start
```
