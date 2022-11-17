# React

Here it comes our first real dependency for `vite`, obviously, we have picked up `react`! Let's check how easy is to integrate this framework along with `jsx` syntax in our project.

📌 We start from sample `06-typescript`.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (14.18+ / 16+) if they are not already installed on your computer.

> ⚠ Verify that you are running at least latest Node LTS version and npm. You can check your current version by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from `06-typescript`. Just copy the project and install:

  ```bash
  npm install
  ```

- Next, install `react` and `react-dom` dependencies:

  ```bash
  npm install react react-dom --save
  ```

- And don't forget to install its typings:

  ```bash
  npm install @types/react @types/react-dom --save-dev
  ```

- Now open `tsconfig.json` file and set following compiler option to support `jsx` notation in our TypeScript files:

  _tsconfig.json_

  ```diff
    "compilerOptions": {
      "esModuleInterop": true,
      "isolatedModules": true,
  +   "jsx": "react-jsx",
      "lib": ["ESNext", "DOM"],
      "module": "ESNext",
  ```

  ⚡ `jsx` is a JavaScript syntax extension that will allow us to write HTML-in-JS and is typically used by React components.

- In order to make `vite` fully support `jsx` syntax (among other things) we will add a plugin, otherwise, `esbuild` won't be able to transpile our `react` source files written in `jsx` syntax:

  ```bash
  npm install @vitejs/plugin-react --save-dev
  ```

- Finally, let's modify `vite.config.ts` to add the newly installed plugin:

  _vite.config.ts_

  ```diff
    import { defineConfig } from "vite";
    import checker from "vite-plugin-checker";
  + import react from "@vitejs/plugin-react";

    export default defineConfig({
  -   plugins: [react()],
  +   plugins: [checker({ typescript: true }), react()],
    });
  ```

- We have `react` ready! Let's create a component called **HelloComponent** in a new `hello.tsx` file:

  > **REMEMBER**: ⚠ **tsx** extension!

  _src/hello.tsx_

  ```javascript
  import { FC } from "react";

  export const HelloComponent: FC = () => {
    return <h2>Hello from React</h2>;
  };
  ```

- In order to render our `react` application, let's create a `div` container in our HTML file that will be used as the root node for the component tree:

  _src/index.html_

  ```diff
    <body>
  +   <div id="root"></div>
      <script type="module" src="/src/index.ts"></script>
    </body>
  ```

- Rename our `src/index.ts` to `src/index.tsx` and update its content to render our `HelloComponent` in `root` node, like this:

  _src/index.ts_

  ```bash
  [RENAME] src/index.ts -> src/index.tsx
  ```

  _src/index.tsx_

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

- Don't forget to update `index.tsx` reference in our HTML entrypoint:

  _index.html_

  ```diff
    <body>
      <div id="root"></div>
  -   <script type="module" src="/src/index.ts"></script>
  +   <script type="module" src="/src/index.tsx"></script>
    </body>
  ```

- Well, it's time to run the development server!

  ```bash
  npm start
  ```

  🔎 First of all, chech your `react` application is up and running!

  🔎 Then, look at the dev-tools `network` tab (refresh if needed) and, appart from the source code ES moudules we already know, you will see a couple of `vite` pre-bundled dependencies: `react-dom_client` and `react_jsx-dev-runtime`. Take a look at both requests, they share a few things in common:

  - Look at the request url: these files are comming from `/node_modules/.vite/deps` which is the default storage for your proyect pre-bundled dependencies.
  - Take a look at the response header `Cache-Control` as well. Dev-server is telling the browser to keep them in its internal cache for as long as possible (1 year, which use to be the convention for the maximum allowed time).
  - They all use a cache busting pattern consisting in passing a hash through a query string param. With this technique, browser cache is defeated in case any of an update in any of the pre-bundled dependencies.

  🔎 Now press F5 to refresh the page and check again `network` requests. Take a look again to the dependency requests and see how the `200` status code is grayed out and under `size` it indicates that is being pulled from the `disk cache`.

  ⚡ Remember that dependencies, which are not likely to change, are pre-bundled in development flow using `esbuild`. This process is useful to armonize modules format and optimize the number of requests needed to consume these dependencies.

  ⚡ With this approach, development gets amazingly light and fast. All of your heavy dependencies are consumed from your browser cache (except an ocassional update) and your source code ES modules are ready in record time, just available for your browser to request them when needed.
