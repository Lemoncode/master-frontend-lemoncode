# Custom CSS

Let's work with styles. In this demo, we create a custom CSS file which contains a simple demo style for our app.

📌 We start from sample `01-basic`.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (14.18+ / 16+) if they are not already installed on your computer.

> ⚠ Verify that you are running at least latest Node LTS version and npm. You can check your current version by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- Just copy/paste seed project `01-basic` and install:

  ```cmd
  npm install
  ```

- Let's create the file `mystyles.css`:

  _src/mystyles.css_

  ```css
  .red-background {
    background-color: indianred;
  }
  ```

- Import the css from our `index.js` file:

  _src/index.js_

  ```diff
  + import "./mystyles.css";

    const user = "John Doe";

    console.log(`Hello ${user}!`);
    console.log("This app is using Vite");
  ```

- Now we can use our new style classes directly in our html index file, let's update it:

  _src/index.html_

  ```diff
    <body>
      <h1>Check the console log</h1>
  +   <div class="red-background">RedBackground stuff</div>
      <script type="module" src="/index.js"></script>
    </body>
  ```

- Now it's time to check it out! Run the development server:

  ```bash
  npm start
  ```

  👍🏼 `vite` supports css out of the box! No need for plugins or configuration.

  🔍 Pay attention to the requests made by your browser, a new `mystyles.css` module is now being requested.
  You can also check `Elements` tab to see how your new styles are injected in the `<head>` tag.

- Finally, let's check the production bundle as well. Run the build script like this:

  ```bash
  npm run build
  ```

  🔍 Open file `dist/index.html` and notice how there is a new `<link>` tag created for us to reference the CSS file:

  ```html
  <link rel="stylesheet" href="/assets/index.29b4e7b8.css" />
  ```

  🔍 Also notice our CSS file has been renamed to `index.<hash>.css` and its content has been minified.
