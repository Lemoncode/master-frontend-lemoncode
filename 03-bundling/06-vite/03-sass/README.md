# SASS

So far so good. Now it's time to use a more powerful CSS preprocessor like [SASS](https://sass-lang.com/). Will `vite` handle it? Let's check it out!

📌 We start from sample `02-custom-css`.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (14.18+ / 16+) if they are not already installed on your computer.

> ⚠ Verify that you are running at least latest Node LTS version and npm. You can check your current version by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from `02-custom-css`. Just copy the project and install:

  ```bash
  npm install
  ```

- Let's rename `mystyles.css` to `mystyles.scss` and update the content:

  _src/mystyles.scss_

  ```diff
  + $blue-color: teal;

  .red-background {
  - background-color: indianred;
  + background-color: $blue-color;
  }
  ```

- Now remember to update `index.js` to point out our new `sass` file:

  _src/index.js_

  ```diff
  - import './mystyles.css';
  + import './mystyles.scss';

  const user = "John Doe";

  console.log(`Hello ${user}!`);
  console.log("This app is using Vite");
  ```

- Will it work? Let's start the dev server with:

  ```bash
  npm start
  ```

  💥 Notice we got an error here:

  ```cmd
  [vite] Internal server error: Preprocessor dependency "sass" not found. Did you install it?
    Plugin: vite:css
  ```

  👍🏼 In fact is a `vite` reminder to install `sass` preprocessor dependency. We forgot to do it!

- Let's go then! Just add `sass` to our project as development dependency. First, stop the server and then run:

  ```bash
  npm install sass --save-dev
  ```

- Now run the dev server again:

  ```bash
  npm start
  ```

  🔍 Check the style is modified according to changes.

- Let's build the project with:

  ```bash
  npm run build
  ```

  🔍 Notice in `dist/assets/index.<hash>.css` the file has been transpiled correctly.

  ```css
  .red-background {
    background-color: teal;
  }
  ```

  👍🏼 `vite` supports `sass` with not as much hassle.
