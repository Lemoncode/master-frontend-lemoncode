# 02 Different bundlers

In this example we are going to add a second microfrontend using a different bundler.

We will start from `00-boilerplate`.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

We can create the second microfrontend `mfe2` following the same steps as `mfe1` but using another bundler like Vite:

> Copy the previous project

Remove the `mfe2/src/helpers.ts`.

Update the `app.tsx` component:

_./mfe2/src/app.tsx_

```diff
import React from "react";

+ interface Props {
+   count: number;
+   setCount: React.Dispatch<React.SetStateAction<number>>;
+   style?: React.CSSProperties;
+ }

- export const App: React.FC = () => {
+ export const App: React.FC<Props> = (props) => {
- const [count, setCount] = React.useState(0);
+ const { count = 0, setCount, style } = props;
  return (
    <div>
-     <h2>Microfrontend 1</h2>
+     <h2>Microfrontend 2</h2>
-     <p>
+     <p
+       style={{
+         backgroundColor: style?.backgroundColor || "lightblue",
+       }}
+     >
        This mfe is using Rsbuild and React {React.version}
      </p>
      <button
-       onClick={() => setCount(count + 1)}
+       onClick={() => {
+         if (setCount) {
+           setCount(count + 1);
+         }
+       }}
      >
        Count is {count}
      </button>
    </div>
  );
};

```

Remove `rsbuild` and add Vite dependencies:

_./mfe2_

```bash
npm uninstall @rsbuild/core @rsbuild/plugin-react @module-federation/rsbuild-plugin
npm install vite @vitejs/plugin-react @module-federation/vite --save-dev
```

> [Module Federation for Vite](https://module-federation.io/integrations/build-tool/vite.html)

Update the `package.json`:

_./mfe2/package.json_

```diff
{
- "name": "mfe1",
+ "name": "mfe2",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
-   "start": "rsbuild dev",
+   "start": "vite",
-   "build": "rsbuild build"
+   "build": "vite build"
  },
  "dependencies": {
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "devDependencies": {
    "@module-federation/vite": "^1.16.10",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.2",
    "typescript": "^6.0.3",
    "vite": "^8.0.16"
  }
}

```

Rename the `rsbuild.config.ts` to `vite.config.ts` and update the configuration:

_./mfe2/vite.config.ts_

```diff
- import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
+ import { federation } from "@module-federation/vite";
- import { defineConfig } from "@rsbuild/core";
+ import { defineConfig } from "vite";
- import { pluginReact } from "@rsbuild/plugin-react";
+ import pluginReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    pluginReact(),
-   pluginModuleFederation({
+   federation({
-     name: "mfe1",
+     name: "mfe2",
+     manifest: true,
+     filename: 'mfe2.js',
      exposes: {
        "./app": "./src/app.expose.ts",
-       "./helpers": "./src/helpers.ts",
      },
      shared: {
        react: {
          version: "19.2.3",
          singleton: true,
          requiredVersion: "^19.2.3",
        },
      },
    }),
  ],
  server: {
-   port: 8081,
+   port: 8082,
  },
});

```

> `manifest: true` is needed to generate the `mf-manifest.json` file required by the host application.
>
> `filename`: Also required to generate the main module-federation entrypoint. [Reference](https://github.com/module-federation/vite)

Let's add the `index.html` file needed by Vite:

_./mfe2/index.html_

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Microfrontend 2</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.ts"></script>
  </body>
</html>
```

Now, we can run the mfe2 application:

```bash
npm start
```

Update the host application to load the mfe2 remote module.

_./host/rsbuild.config.ts_

```diff
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: "host",
      remotes: {
        mfe1: "mfe1@http://localhost:8081/mf-manifest.json",
+       mfe2: "mfe2@http://localhost:8082/mf-manifest.json",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  server: {
    port: 8080,
  },
});

```

Use the remote module in the host application:

_./host/src/app.tsx_

```diff
import MFE1 from "mfe1/app";
import helpers from "mfe1/helpers";
+ import MFE2 from "mfe2/app";
import React from "react";

export const App: React.FC = () => {
  const result = helpers.sum(2, 3);
  return (
    <main>
      <h1>Host App</h1>
      <MFE1 />
      <p>
        Sum result mfe1/helpers: <b>{result}</b>
      </p>
+     <MFE2 />
    </main>
  );
};

```

Update the host application to pass props to mfe2:

_./host/src/app.tsx_

```diff
import MFE1 from "mfe1/app";
import helpers from "mfe1/helpers";
import MFE2 from "mfe2/app";
import React from "react";

export const App: React.FC = () => {
  const result = helpers.sum(2, 3);
+ const [count, setCount] = React.useState(0);
  return (
    <main>
      <h1>Host App</h1>
      <MFE1 />
      <p>
        Sum result mfe1/helpers: <b>{result}</b>
      </p>
      <MFE2
+       count={count}
+       setCount={setCount}
+       style={{ backgroundColor: "lightgreen" }}
      />
    </main>
  );
};

```

# About Basefactor + Lemoncode We are an innovating team of Javascript experts,

passionate about turning your ideas into robust products. [Basefactor,
consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and
coaching services. [Lemoncode](http://lemoncode.net/services/en/#en-home)
provides training services. For the LATAM/Spanish audience we are running an
Online Front End Master degree, more info: http://lemoncode.net/master-frontend
