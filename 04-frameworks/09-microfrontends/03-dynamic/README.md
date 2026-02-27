# 03 Dynamic

In this example we are going to add the configuration to load microfrontends dynamically.

We will start from `02-different-bundlers`.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

Module federation allows to load microfrontends dynamically using the [runtime package](https://module-federation.io/guide/basic/runtime/runtime.html) that means that we can load microfrontends in a host without knowing their url at build time.

First, let's copy the `api folder` from [this 03-dynamic example](https://github.com/Lemoncode/master-frontend-lemoncode/tree/master/04-frameworks/09-microfrontends/03-dynamic) to our working folder.

```bash
npm install
```

Then, we need to update the `host` app to load microfrontends dynamically. Remove the static configuration:

_./host/rsbuild.config.ts_

```diff
- import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [
    pluginReact(),
-   pluginModuleFederation({
-     name: "host",
-     remotes: {
-       mfe1: "mfe1@http://localhost:8081/mf-manifest.json",
-       mfe2: "mfe2@http://localhost:8082/mf-manifest.json",
-     },
-     shared: {
-       react: {
-         version: "19.2.3",
-         singleton: true,
-         eager: true,
-         requiredVersion: "^19.2.3",
-       },
-     },
-   }),
  ],
  server: {
    port: 8080,
  },
});

```

Install the runtime package:

```bash
npm uninstall @module-federation/rsbuild-plugin
npm install @module-federation/enhanced --save-dev
```

Run the four projects:

```bash
# api, host, mfe1, mfe2
npm run start
```

Update the host app to load microfrontends dynamically:

_./host/src/app.tsx_

```diff
- import MFE1 from "mfe1/app";
- import helpers from "mfe1/helpers";
- import MFE2 from "mfe2/app";
import React from "react";
+ import { createInstance } from "@module-federation/enhanced/runtime";


+ const moduleFederation = createInstance({
+   name: "host",
+   remotes: [
+     {
+       name: "mfe1",
+       entry: "http://localhost:8081/mf-manifest.json",
+     },
+   ],
+   shared: {
+     react: {
+       version: "19.2.3",
+       lib: () => React,
+       shareConfig: {
+         singleton: true,
+         eager: true,
+         requiredVersion: "^19.2.3",
+       },
+     },
+   },
+ });

+ const MFE1 = React.lazy(() =>
+   moduleFederation
+     .loadRemote("mfe1/app")
+     .then(({ default: App }) => ({ default: App }))
+ );

...

```

> Comment the `helpers` and `MFE2` code to avoid errors until you update them to be loaded dynamically too.
>
> This configuration allows to load microfrontends at runtime instead of build time, that means that we are bundler agnostic because we are not using any bundler specific plugin to load microfrontends.

And also, we can get the entry point urls from an API instead of hardcoding them in the host app:

_./host/src/app.tsx_

```diff
import { createInstance } from "@module-federation/enhanced/runtime";
import React from "react";

+ const microfrontends = await fetch("/api/microfrontends").then((res) =>
+   res.json()
+ );

const moduleFederation = createInstance({
  name: "host",
- remotes: [
-   {
-     name: "mfe1",
-     entry: "http://localhost:8081/mf-manifest.json",
-   },
- ],
+ remotes: microfrontends.map((mfe) => ({
+   name: mfe.name,
+   entry: mfe.url,
+ })),
  shared: {
    react: {
      version: "19.2.3",
      lib: () => React,
      shareConfig: {
        singleton: true,
        eager: true,
        requiredVersion: "^19.2.3",
      },
    },
  },
});
```

Add the proxy configuration to the host app to avoid CORS issues:

_./host/rsbuild.config.ts_

```diff
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 8080,
+   proxy: {
+     "/api": "http://localhost:3001",
+   },
  },
});

```

Add the `helpers` and `MFE2` imports:

_./host/src/app.tsx_

```diff
...
const MFE1 = React.lazy(() =>
  moduleFederation
    .loadRemote("mfe1/app")
    .then(({ default: App }) => ({ default: App }))
);

+ const helpers = await moduleFederation
+   .loadRemote("mfe1/helpers")
+   .then(({ default: helpers }) => helpers);

+ const MFE2 = React.lazy(() =>
+   moduleFederation
+     .loadRemote("mfe2/app")
+     .then(({ default: App }) => ({ default: App }))
+ );
...
```

# About Basefactor + Lemoncode We are an innovating team of Javascript experts,

passionate about turning your ideas into robust products. [Basefactor,
consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and
coaching services. [Lemoncode](http://lemoncode.net/services/en/#en-home)
provides training services. For the LATAM/Spanish audience we are running an
Online Front End Master degree, more info: http://lemoncode.net/master-frontend
