# React

Let's check how easy is to integrate jsx in your bundle.

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (min >=12.2.0) if they are not already installed on your computer.

> Verify that you are running at least latest Node LTS version and npm. You can check your current version by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from _06-typescript_. Just copy the project and execute _npm install_

```bash
npm install
```

- Let's install _react_ and _react-dom_

```bash
npm install react react-dom --save
```

- Let's install the typings

```bash
npm install @types/react @types/react-dom --save-dev
```

- Let's create a component called **HelloComponent** in the _./src/hello.tsx_ file

_./src/hello.tsx_

```javascript
import { FC } from "react";

export const HelloComponent: FC = () => {
  return <h2>Hello from React</h2>;
};
```

- Now let's create in the [_index.html_](src/index.html) file (./src/index.html) a div container to instantiate our React application:

_./src/index.html_

```diff
  <body>
+   <div id="root"></div>
    <script type="module" src="/src/index.ts"></script>
  </body>
```

- Let's rename our _./src/index.ts_ to _./src/index.tsx_.

- Let's update _./src/index.tsx_ with next changes:

_./src/index.tsx_

```diff
- import "./mystyles.scss";
-
- const numberA: number = 2;
- const numberB: number = 3;
-
- console.log(numberA + numberB);
+ import { createRoot } from "react-dom/client";
+ import { HelloComponent } from "./hello";
+
+ const root = createRoot(document.getElementById("root"));
+
+ root.render(<HelloComponent />);
```

- Let's update _index.html_

```diff
  <body>
    <div id="root"></div>
-   <script type="module" src="/src/index.ts"></script>
+   <script type="module" src="/src/index.tsx"></script>
  </body>
```

- Let's run the sample.

```bash
npm start
```

- By default `esbuild` does not makes extra code generation for React components so we'll create our first Vite config file and add a plugin.

- Let's install react plugin

```bash
npm install @vitejs/plugin-react --save-dev
```

- Let's create _./vite.config.ts_

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
});
```
