# Custom CSS

Let's start working with styles.

In this demo we create a custom CSS file which contains a simple css class to set the background color to red.

We start from sample _01-basic_.

Summary steps:

- Use a custom style it in our main page.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (min >=12.2.0) if they are not already installed on your computer.

> Verify that you are running at least latest Node LTS version and npm. You can check your current version by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from _01-basic_. Just copy the project and execute _npm install_

```cmd
npm install
```

- Let's create the file _mystyles.css_:

_./src/mystyles.css_

```css
.red-background {
  background-color: indianred;
}
```

- We import the css to our index.js file:

_./src/index.js_

```diff
+ import "./mystyles.css";

  const user = "John Doe";

  console.log(`Hello ${user}!`);
  console.log("This app is using Vite");
```

- And now we can just use this style directly in our HTML file. Let's update `index.html`.

_./src/index.html_

```diff
  <body>
    <h1>Check the console log</h1>
+   <div class="red-background">RedBackground stuff</div>
    <script type="module" src="/index.js"></script>
  </body>
```

- Once we modified the html file, let's start the project

```bash
npm start
```

- Finally, we could check the built files. Run the build script:

```bash
npm run build
```

Notice in `dist/index.html` a new `<link>` tag has been created to reference the CSS file:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vite App</title>
  <script type="module" crossorigin src="/assets/index.5f512ab2.js"></script>
  <link rel="stylesheet" href="/assets/index.29b4e7b8.css" />
</head>
```

Also notice our CSS file has been renamed to `index.<hash>.css` and contents have been minified.
