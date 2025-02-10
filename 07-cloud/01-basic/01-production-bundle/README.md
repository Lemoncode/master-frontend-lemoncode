# 01 Production bundle

In this example we are going to create a production bundle using vite.

We will start from `00-boilerplate`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

First, we will check the current `vite config`

_./vite.config.ts_

```javascript
import { defineConfig } from 'vite';
...

export default defineConfig({
  envPrefix: 'PUBLIC_',
  ...
});


```

> [Vite env variables](https://vitejs.dev/guide/env-and-mode.html)

Let's add a different env variables for `production`:

_./.env.production_

```env
PUBLIC_ORGANIZATION=facebook

```

Now, we can add the `build` command:

_./package.json_

```diff
...
  "scripts": {
    "start": "run-p -l type-check:watch start:dev",
    "start:dev": "vite --port 8080",
+   "prebuild": "npm run type-check && npm run clean",
+   "build": "vite build",
    "type-check": "tsc --noEmit --preserveWatchOutput",
    ...
  },
```

Run it:

```bash
npm run build

```

> Search env variable value in the production bundle.

Let's try to run the production bundle:

```bash
cd dist
npx lite-server

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
