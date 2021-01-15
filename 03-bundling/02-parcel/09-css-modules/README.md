# 09 CSS Modules

Let's check how easy is to integrate css modules in your bundle.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (min v8.9) if they are not already installed on your computer.

> Verify that you are running at least node v8.x.x and npm 5.x.x by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from _08-react_. Just copy the project and execute _npm install_

```bash
npm install
```

- Let's install _@babel/core_, _@babel/preset-react_ and _@babel/preset-typescript_

```bash
npm install @babel/core @babel/preset-react @babel/preset-typescript --save-dev
```

- Now let's add babel configuration file
_./.babelrc_

```javascript
{
    "presets": [
      "@babel/preset-typescript",
      "@babel/preset-react"
    ]
  }
```
- Let's install _postcss-modules_

```bash
npm install postcss-modules --save-dev
```

- Let's add postcssrc file
_./.postcssrc_

```javascript
{
  "modules": true
}
```

- Let's add some styles in the [_mystyles.scss_] file

```css
$blue-color: teal;

.hello {
  background-color: $blue-color;

  .logo{
    width:150px;
  }
}
```

- Now let's modify the  component called **HelloComponent** in the [_hello.tsx_] file. Let's import scss file and use the classes module

```javascript
import React from "react";
const logo = require("./content/logo_1.png");
const classes = require("./mystyles.scss");

export const HelloComponent: React.FC = () => {
  return (
    <div className={classes.hello}>
      <img src={logo} className={classes.logo}/>
      <h2>Hello from React</h2>      
    </div>
  );
};
```

> If you get a warning about using required, try: npm i @types/node --save-dev

- Let's run the sample.

```bash
npm start
```
