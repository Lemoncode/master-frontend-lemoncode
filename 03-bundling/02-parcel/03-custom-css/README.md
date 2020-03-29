# Custom CSS

Let's start working with styles.

In this demo we create a custom CSS file which contains a simple css class to set the background color to red.

We start from sample _01 es6_.

Summary steps:

- Create a custom css file.
- Use it in our main page.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (min v8.9) if they are not already installed on your computer.

> Verify that you are running at least node v8.x.x and npm 5.x.x by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from _01 es6_. Just copy the project and execute _npm install_

```cmd
npm install
```

- Let's create the file _mystyles.css_

_./src/mystyles.css_

```css
.red-background {
  background-color: indianred;
}
```

- We import the css to our index.js file:

_./src/index.js_

```diff
+ import './mystyles.css';

const sampleNumber = 1;
console.log(`Hello from sample ${sampleNumber}`);
```

- And now we can just use this style directly in our HTML file. Let's update `index.html`.

_./src/index.html_

```diff
<html>
<body>
  <h1>Check the console log</h1>
+ <div class="red-background">
+  RedBackground stuff
+ </div>
  <script src="./index.js"></script>
</body>
</html>
```

- Once we modified the html file, let's start the project

```cmd
npm start
```

- Finally, we could check the built files. For example, in the html built file, we see that Parcel has added the css dependency:

_./dist/index.html_

```diff
<html>
+<link rel="stylesheet" href="/src.fec37933.css"><body>

  <h1>Check the console log</h1>
    <div class="red-background">
      RedBackground stuff
    </div>
    <script src="/src.fec37933.js"></script>
</body>
</html>
```
