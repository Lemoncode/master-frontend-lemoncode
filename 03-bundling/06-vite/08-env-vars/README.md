# Environment variables

Let's check how we can use environment variables in Vite.

📌 We start from sample `05-images`.

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (min >=12.2.0) if they are not already installed on your computer.

> ⚠ Verify that you are running at least latest Node LTS version and npm. You can check your current version by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from _07-react. Just copy the project and execute \_npm install_

```bash
npm install
```

Vite uses `dotenv` under the hood for loading environment variables, like Parcel, but we can only load variables starting with `VITE_`. Other variables won't be replaced. This constraint prevents for accidentally replacing unwated system environment variables (e.g., `USER`, `PATH`, `HOME` on some unix systems). Let's create our _.env_ file.

_.env_

```ini
VITE_API_BASE=http://localhost:8080
```

- Let's modify our `HelloComponent` to display the environment value:

_./src/hello.tsx_

```diff
  export const HelloComponent: FC = () => {
-   return <h2>Hello from React</h2>;
+   return (
+     <>
+       <h2>Hello from React</h2>
+       <p>Api server is {import.meta.env.VITE_API_BASE}</p>
+     </>
+   );
  };
```

Let's start the project with

```bash
npm start
```

If you navigate to [http://localhost:3000](http://localhost:3000) you'll see the value has been interpolated.

But also notice we have a compilation error here. TypeScript doesn't know about `env` object in `import.meta`. In order to tell TypeScript the existence of this object
we'll import Vite's definition types to our project.

- First let's create the typings file _./src/vite-env.d.ts_

_./src/vite-env.d.ts_

```ts
/// <reference types="vite/client" />
```

When we save the file now the error is gone.

We could even improve what variables are available in environment if we extend Vite's typings. Let's modify `_./src/vite-env.d.ts`:

```diff
  /// <reference types="vite/client" />
+
+ // We'll add here our environment variables. Remember all have string values.
+ interface ImportMetaEnv {
+   readonly VITE_API_BASE: string;
+ }
```

One important thing to note here is all variables are **strings**. If you need some variables as `boolean` or `number` you may prefer to create your own `environment.ts` or `config.ts` to pre-process and parse them.

- Let's add another variable to our _.env_ file:

_.env_

```diff
  VITE_API_BASE=http://localhost:8080
+ VITE_ENABLE_FEATURE_A=true
```

- Let's also add it in _./src/vite-env.d.ts_ file:

_src/vite-env.d.ts_

```diff
  interface ImportMetaEnv {
    readonly VITE_API_BASE: string
+   readonly VITE_ENABLE_FEATURE_A: string;
  }
```

- Let's create _./src/env-config.ts_ with next content:

```ts
const config = {
  API_BASE: import.meta.env.VITE_API_BASE,
  IS_FEATURE_A_ENABLED: import.meta.env.VITE_ENABLE_FEATURE_A === "true",
} as const;

export default config;
```

> Note: We're typed `config` as `const` to be a constant object with read-only keys to avoid accidental rewrite.

- Let's update our `HelloComponent` to use our new `config` object:

```diff
  import { FC } from "react";
+ import config from "./env-config";

  export const HelloComponent: FC = () => {
    return (
      <>
        <h2>Hello from React</h2>
-       <p>Api server is {import.meta.env.VITE_API_BASE}</p>
+       <p>Api server is {config.API_BASE}</p>
+       <p>Feature A is {config.IS_FEATURE_A_ENABLED ? "enabled" : "disabled"}</p>
      </>
    );
  };
```
