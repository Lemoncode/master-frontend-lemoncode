# Custom CSS

Let's work with styles. In this demo, we create a custom CSS file which contains a simple demo style for our app.

📌 We start from sample `01-basic`.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (20.19.0 || >=22.12.0) if they are not already installed on your computer.

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

- Let's start checking the result for production. Run the build script like this:

  ```bash
  npm run build
  ```

  👍🏼 `vite` supports css out of the box! No need for plugins or configuration.

  🔍 Open file `dist/index.html` and notice how there is a new `<link>` tag created for us to reference the CSS file:

  ```html
  <link rel="stylesheet" href="/assets/index-29b4e7b8.css" />
  ```

  🔍 Also notice our CSS file has been renamed to `index-<hash>.css` and its content has been minified.

- Let's run now a preview of the built bundles for production:

  ```bash
  npm run preview
  ```

  🔍 Now check the network requests to see how the browser is downloading the new `css` bundle as `index-<hash>.css`. ⚠ Pay attention to the icon of the assets downloaded.

- Now it's time to check it out in development flow:

  ```bash
  npm start
  ```

  🔍 Pay attention to the requests made by your browser, a new `mystyles.css` module is now being requested. If you do a change in the css file like:

  ```diff
  .red-background {
  + background-color: red;
  }
  ```

  Check how now the module has been hot replaced with a new version with the timestamp:
  `mystyles.css?t=<timestamp>` ... like any other ES module ... wait ... ⚠ look at the icon of the resource downloaded 💥... it is not CSS, it is just another module!

  🔍 Click the resource and check its content:
  - It contains a runtime made out by utilities imported from `@vite/client` like `updateStyle` and `removeStyle`.
  - This runtime enables hot-injection of new CSS in the application without having to refresh the whole page.
  - It uses HMR APIs to replace styles in the browser, removing the old ones and adding the new ones.

  🔍 You can also check `Elements` tab to see how your new styles are injected in the `<head>` tag.
