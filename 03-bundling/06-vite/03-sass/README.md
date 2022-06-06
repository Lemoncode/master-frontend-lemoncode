# SASS

Let's see how to add [SASS](https://sass-lang.com/) support

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (min >=12.2.0) if they are not already installed on your computer.

> Verify that you are running at least latest Node LTS version and npm. You can check your current version by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from _02-custom-css_. Just copy the project and execute _npm install_

```bash
npm install
```

- Let's rename _mystyles.css_ to _mystyles.scss_ and update the content.

_mystyles.scss_

```diff
+ $blue-color: teal;

.red-background {
- background-color: indianred;
+ background-color: $blue-color;
}
```

- Let's update _index.js_ to point out the sass file

_./src/index.js_

```diff
- import './mystyles.css';
+ import './mystyles.scss';

const user = "John Doe";
console.log(`Hello ${user}!`);
```

- Let's start the dev server with:

```bash
npm start
```

Notice we got an error here:

```
[vite] Internal server error: Preprocessor dependency "sass" not found. Did you install it?
  Plugin: vite:css
```

That means we need to install `sass` into our project. Stop the server and run:

```bash
npm install sass --save-dev
```

Let's start the server again:

```bash
npm start
```

Let's build the project with:

```bash
npm run build
```

Notice in `dist/assets/index.<hash>.css` the file has been transpiled correctly.

```css
.red-background{background-color:teal}
```
