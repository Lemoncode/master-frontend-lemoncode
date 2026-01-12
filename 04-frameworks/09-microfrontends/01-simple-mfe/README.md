# 01 Simple Microfrontend

In this example we are going to add a basic setup needed to work with Module Federation.

We will start from scratch creating two different projects:

- One microfrontends (MFE) called `mfe1` or also called remote or producer application.
- Another called `host` that will load the remote application, also called consumer application.

# Steps to build it

[Module Federation](https://webpack.js.org/concepts/module-federation/) is an architectural pattern that allows to share code and resources between different applications at runtime.

The first version was created for Webpack, but now in [Module Federation 2.0](https://module-federation.io/guide/start/index.html) there is support for other bundlers like Vite.

We will create the three projects, first the mfe1 using [Rsbuild](https://module-federation.io/guide/basic/rsbuild.html):

> [Glossary of Terms](https://module-federation.io/guide/start/glossary.html)

_./mfe1/_

```bash
npm init -y
```

Install dependencies:

```bash
npm install react react-dom
npm install -D @rsbuild/core @rsbuild/plugin-react typescript @types/react @types/react-dom
```

Let's add the basic React configuration:

_./mfe1/src/index.tsx_

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app";

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
```

_./mfe1/src/app.tsx_

```tsx
import React from "react";

export const App: React.FC = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <h2>Microfrontend 1</h2>
      <p>This mfe is using Rsbuild and React {React.version}</p>
      <button onClick={() => setCount(count + 1)}>Count is {count}</button>
    </div>
  );
};
```

Add a simple `tsconfig`:

_./mfe1/tsconfig.json_

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noImplicitAny": false,
    "jsx": "react-jsx",
    "noLib": false,
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "strictNullChecks": true
  },
  "include": ["src"]
}
```

Add the Rsbuild configuration setup:

_./mfe1/rsbuild.config.ts_

```ts
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 8081,
  },
});
```

And finally, update the `package.json` to add a start script:

_./mfe1/package.json_

```diff
{
  "name": "mfe1",
  "version": "1.0.0",
- "description": "",
- "main": "index.js",
+ "type": "module",
  "scripts": {
-   "test": "echo \"Error: no test specified\" && exit 1"
+   "start": "rsbuild dev"
  },
- "keywords": [],
- "author": "",
- "license": "ISC",
- "type": "commonjs",
  "dependencies": {
    "react": "^19.2.3",
    "react-dom": "^19.2.3"
  },
  "devDependencies": {
    "@rsbuild/core": "^1.7.2",
    "@rsbuild/plugin-react": "^1.4.2",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "typescript": "^5.9.3"
  }
}

```

Now we can run the mfe1 application:

```bash
npm start
```

Now, we can create the host application in a similar way (copy the mfe1 folder to host and change the following files):

_./host/src/app.tsx_

```diff
import React from "react";

export const App: React.FC = () => {
- const [count, setCount] = React.useState(0);
  return (
-   <div>
-     <h2>Microfrontend 1</h2>
-     <p>This mfe is using Rsbuild and React {React.version}</p>
-     <button onClick={() => setCount(count + 1)}>Count is {count}</button>
-   </div>
+   <main>
+     <h1>Host App</h1>
+   </main>
  );
};

```

_./host/package.json_

```diff
{
- "name": "mfe1",
+ "name": "host",
  ...
```

_./host/rsbuild.config.ts_

```diff
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  server: {
-   port: 8081,
+   port: 8080,
  },
});

```

Install and run the host application:

```bash
npm install
npm start
```

Now, it's time to add the Module Federation configuration to both mfe1 and host applications.

_./mfe1_

```bash
npm install @module-federation/rsbuild-plugin --save-dev
```

> [Rsbuild plugin](https://module-federation.io/guide/basic/rsbuild.html)

Update the rsbuild configuration to add the Module Federation plugin:

_./mfe1/rsbuild.config.ts_

```diff
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
+ import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";

export default defineConfig({
  plugins: [
    pluginReact(),
+   pluginModuleFederation({
+     name: "mfe1",
+   }),
  ],
  server: {
    port: 8081,
  },
});

```

Rename the `index.tsx` to `bootstrap.tsx` (or standalone file) and create a new `index.ts` to load the `bootstrap.tsx` as asynchronous module:

_./mfe1/src/index.ts_

```ts
import("./bootstrap");
```

> This is needed to ensure that the shared modules are loaded before the application code.

Add the `expose` file:

_./mfe1/src/app.expose.ts_

```ts
import { App } from "./app";

export default App;
```

> An expose is a module that is made available to other federated modules and it should be an export default.

Update the rsbuild configuration again:

_./mfe1/rsbuild.config.ts_

```diff
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: "mfe1",
+     exposes: {
+       ".": "./src/app.expose.ts",
+     },
    }),
  ],
  server: {
    port: 8081,
  },
});

```

Run again the mfe1 application to ensure everything is working:

```bash
npm start
```

Now, let's update the host application to load the mfe1 remote module.

_./host_

```bash
npm install @module-federation/rsbuild-plugin --save-dev
```

Update the rsbuild configuration to add the Module Federation plugin:

_./host/rsbuild.config.ts_

```diff
+ import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [
    pluginReact(),
+   pluginModuleFederation({
+     name: "host",
+     remotes: {
+       mfe1: "mfe1@http://localhost:8081/mf-manifest.json",
+     },
+   }),
  ],
  server: {
    port: 8080,
  },
});

```

> If you are using Module Federation v1, the remote url should be `mfe1@http://localhost:8081/remoteEntry.js`
>
> Then we can add the `build` script to generate the production build including the Module Federation files and we can see the mf-manifest.json file generated in the `dist` folder.

As we did in the mfe1 application, rename the `index.tsx` to `bootstrap.tsx` (or standalone file) and create a new `index.ts` to load the `bootstrap.tsx` as asynchronous module:

_./host/src/index.ts_

```ts
import("./bootstrap");
```

Use the remote module in the host application:

_./host/src/app.tsx_

```diff
import React from "react";
+ import MFE1 from "mfe1";

export const App: React.FC = () => {
  return (
    <main>
      <h1>Host App</h1>
+     <MFE1 />
    </main>
  );
};

```

> Check the browser console `__FEDERATION__` object to see the Module Federation information.

It fails because we are not sharing the React dependencies, so let's update both configurations to share them.

_./mfe1/rsbuild.config.ts_

```diff
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: "mfe1",
      exposes: {
        ".": "./src/app.expose.ts",
      },
+     shared: {
+       react: {
+         version: "19.2.3",
+         singleton: true,
+         requiredVersion: "^19.2.3",
+       },
+     },
    }),
  ],
  server: {
    port: 8081,
  },
});

```

Apply the same changes to the host configuration:

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
      },
+     shared: {
+       react: {
+         version: "19.2.3",
+         singleton: true,
+         requiredVersion: "^19.2.3",
+       },
      },
    }),
  ],
  server: {
    port: 8080,
  },
});

```

> Now, we can check that both applications are sharing the same React instance (check the React DevTools **FEDERATION** global object).

This is not only for sharing React components, but you can share any module between different applications.

_./mfe1/src/helpers.ts_

```ts
export default {
  sum: (a: number, b: number): number => a + b,
};
```

Update the module federation config:

_./mfe1/rsbuild.config.ts_

```diff
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: "mfe1",
      exposes: {
-       ".": "./src/app.expose.ts",
+       "./app": "./src/app.expose.ts",
+       "./helpers": "./src/helpers.ts",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  server: {
    port: 8081,
  },
});

```

Update the host application to use the shared helper module:

_./host/src/app.tsx_

```diff
- import MFE1 from "mfe1";
+ import MFE1 from "mfe1/app";
+ import helpers from "mfe1/helpers";
import React from "react";

export const App: React.FC = () => {
+ const result = helpers.sum(2, 3);
  return (
    <main>
      <h1>Host App</h1>
      <MFE1 />
+     <p>
+       Sum result mfe1/helpers: <b>{result}</b>
+     </p>
    </main>
  );
};

```

Add the build command to the `package.json`:

_./mfe1/package.json_

```diff
{
  ...
  "scripts": {
    "start": "rsbuild dev",
+   "build": "rsbuild build"
  },
  ...
}
```

# About Basefactor + Lemoncode We are an innovating team of Javascript experts,

passionate about turning your ideas into robust products. [Basefactor,
consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and
coaching services. [Lemoncode](http://lemoncode.net/services/en/#en-home)
provides training services. For the LATAM/Spanish audience we are running an
Online Front End Master degree, more info: http://lemoncode.net/master-frontend
