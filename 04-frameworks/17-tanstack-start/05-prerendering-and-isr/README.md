# 05 Prerendering and ISR with TanStack Start

In this example we are going to implement Prerendering and Incremental Static Regeneration (ISR) using TanStack Start.

We will start from `04-tanstack-start-migration`.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

TanStack Start has built-in support for [Prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering) which can be enabled via the `prerender` option in the `tanstackStart` plugin configuration.

Update `vite.config.ts` to enable Prerendering:

_./vite.config.ts_

```diff
 import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tanstackStart({
+     prerender: {
+       enabled: true,
+     },
    }),
    react(),
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  envPrefix: 'PUBLIC_',
});
```

> By default it will crawl your application starting from the root route (`/`) and prerender all reachable routes. You can customize this behavior by providing additional options. Check the [official documentation](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering) for more details.

If we want hosting the proyect in a Node.js server, we need to add the `nitro` plugin for vite:

> [More info about hosting TanStack Start apps](https://tanstack.com/start/latest/docs/framework/react/guide/hosting#nodejs--railway--docker)

```bash
npm install @netlify/vite-plugin-tanstack-start --save-dev
```

> In a near future, you will use the official [`nitro` v3 package](https://www.npmjs.com/package/nitro) instead of the TanStack Start wrapper.

Update `vite.config.ts` to use the `nitro` plugin:

_./vite.config.ts_

```diff
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
+ import netlify from '@netlify/vite-plugin-tanstack-start';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tanstackStart({
      prerender: {
        enabled: true,
      },
    }),
+   netlify(),
    react(),
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  envPrefix: 'PUBLIC_',
});

```

Add `build` and `start:prod` scripts to `package.json`:

_./package.json_

```diff
...
  "scripts": {
    "start": "run-p -l start:dev start:api-server",
    "start:dev": "vite",
    "start:api-server": "cd api-server && npm run mock-server",
+   "build": "vite build",
+   "start:prod": "npx @dotenvx/dotenvx run -f .env.local -- node .netlify/v1/functions/server.mjs",
    "postinstall": "cd ./api-server && npm install"
  },
...
```

Run app prod mode:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

> Open http://localhost:3000 in your browser.

Open browser at `http://localhost:3000/cars` and then add a new car:

_./api-server/src/mock-data.ts_

```diff
...
+ {
+   id: '10',
+   name: 'New car',
+   imageUrl: '/audi-q8.png',
+   features: [],
+   isBooked: false,
+ },
```
