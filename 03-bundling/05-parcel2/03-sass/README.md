# SASS

Let's see how to add [SASS](https://sass-lang.com/) support

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (min v8.9) if they are not already installed on your computer.

> Verify that you are running at least node v8.x.x and npm 5.x.x by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from _03-custom-css_. Just copy the project and execute _npm install_

```bash
npm install
```

- Let's to replace css by sass files and delegate to Parcel installing dependencies.

- Now let's rename _mystyles.css_ to _mystyles.scss_ and update the content.

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

- Run sample:

```bash
npm start
```

- If Parcel could not install it, we need to install sass:

```bash
npm install sass --save-dev
```
