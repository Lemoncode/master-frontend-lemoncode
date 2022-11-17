# Environment variables

In this example, we are going to support the use of environment variables for our application using `vite`.

📌 We start from sample `07-react`.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (14.18+ / 16+) if they are not already installed on your computer.

> ⚠ Verify that you are running at least latest Node LTS version and npm. You can check your current version by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from `07-react`. Just copy the project and install:

  ```bash
  npm install
  ```

- Let's create our `.env` file:

  _.env_

  ```ini
  VITE_API_BASE=http://localhost:8080
  ```

  ⚡ `vite` uses `dotenv` under the hood for loading environment variables, like `parcel`, but we can only load variables starting with `VITE_` prefix. Other variables won't be replaced. This constraint prevents for accidentally replacing unwated system environment variables (e.g., `USER`, `PATH`, `HOME` on some unix systems).

- Let's modify our `HelloComponent` to display the environment value:

  _src/hello.tsx_

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

- Now start the project with:

  ```bash
  npm start
  ```

  🔎 Navigate to [http://localhost:5173](http://localhost:5173) and you'll see the value has been interpolated.

  💥 However, notice we have a compilation error here. TypeScript doesn't know about `env` object in `import.meta`, neither any of the variables whithin `env`. In order to tell TypeScript the existence of this object and its variables, we should add `vite` definition types to our project.

- First, let's create the typings file `src/vite-env.d.ts`:

  _src/vite-env.d.ts_

  ```ts
  /// <reference types="vite/client" />
  ```

  🔎 Save the file and check the error is gone!

  🔎 Also check intellisense through `import.meta.env` to discover a few out-of-the-box variables ready to be consumed.

- We could further improve this typing by indicating what variables are available whithin the `env` object if we extend `vite` typings. Let's modify `src/vite-env.d.ts` like this:

  _src/vite-env.d.ts_

  ```diff
    /// <reference types="vite/client" />
  +
  + // We'll add here our environment variables. Remember all have string values.
  + interface ImportMetaEnv {
  +   readonly VITE_API_BASE: string;
  + }
  ```

  ⚡ One important thing to note here is that all variables are **strings**. If you need some variables as `boolean` or `number` you may prefer to create your own `environment.ts` or `config.ts` to pre-process and parse them.

- Let's add another variable to our `.env` file:

  _.env_

  ```diff
    VITE_API_BASE=http://localhost:8080
  + VITE_ENABLE_FEATURE_A=true
  ```

- Let's also add it in `src/vite-env.d.ts` file:

  _src/vite-env.d.ts_

  ```diff
    interface ImportMetaEnv {
      readonly VITE_API_BASE: string
  +   readonly VITE_ENABLE_FEATURE_A: string;
    }
  ```

- Now let's create an `src/env-config.ts` file with the following content to properly handle environment variables:

  _src/env-config.ts_

  ```ts
  const config = {
    API_BASE: import.meta.env.VITE_API_BASE,
    IS_FEATURE_A_ENABLED: import.meta.env.VITE_ENABLE_FEATURE_A === "true",
  } as const;

  export default config;
  ```

  > Note: ⚠ We've typed `config` as `const` to be a constant object with read-only keys to avoid accidental rewrite.

- Finally, let's update our `HelloComponent` to use our new `config` object:

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
