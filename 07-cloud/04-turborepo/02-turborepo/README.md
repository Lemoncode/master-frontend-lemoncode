# 02 Turborepo

In this example, we are going to install `turborepo` to check the improvements that it provides.

We will start from `01-workspaces`.

## Steps to build it

Run `npm install` to install project dependencies.

```bash
npm install
```

Let's replace `npm-run-all` by `turborepo`:

```bash
npm uninstall npm-run-all --save-dev

npm install turbo --save-dev

```

> NOTICE: The turborepo package name is `turbo`.

Now, we will create the most important file, `turbo.json` where we define:

_./turbo.json_

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "start": {
      "cache": false,
      "persistent": true
    }
  }
}

```

> NOTES
>
> [cache](https://turbo.build/repo/docs/reference/configuration#cache): enabled by default to cache the commands output.
>
> [persistent](https://turbo.build/repo/docs/reference/configuration#persistent): if it is a long-running process, such as a --watch mode. Without setting this config, if any other task depends on it, it will never run, because it never exits. 

Update `package.json`:

_./package.json_

```diff
...
  "scripts": {
-   "start": "run-p start:*",
+   "start": "turbo start"
-   "start:motto-helpers": "npm run build:watch -w @my-org/motto-helpers",
-   "start:stark": "npm start -w @my-org/house-stark",
-   "start:targaryen": "npm start -w @my-org/house-targaryen",
-   "start:lannister": "npm start -w @my-org/house-lannister",
-   "start:baratheon": "npm start -w @my-org/house-baratheon"
  },
...
```

Run it:

```bash
npm start

```

Let's add the `build` command, this time, we want to execute the `type-check` command before the build, if it fails, stop the process:

_./turbo.json_

```diff
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "start": {
      "cache": false,
      "persistent": true
    },
+   "build": {
+     "outputs": ["dist/**/*"],
+     "dependsOn": ["type-check"]
+   },
+   "type-check": {}
  }
}

```

Update `package.json`:

_./pacakge.json_

```diff
...
  "scripts": {
    "start": "turbo start",
+   "build": "turbo build"
  },
...

```

Update `motto-helpers` project:

_./helpers/motto-helpers/package.json_

```diff
...
  "scripts": {
    "start": "run-p -l type-check:watch \"build -- --watch\"",
-   "build": "npm run type-check && vite build",
+   "build": "vite build",
    "type-check": "tsc --noEmit",
    "type-check:watch": "npm run type-check -- --watch --preserveWatchOutput"
  },
...
```

Run it:

```bash
npm run build

```

> NOTES:
>
> Run multiple times to check that it is cached.
>
> Add some error in `motto-helpers` to check that the process is stopped.

If we want to apply the same approach to the `type-check:watch` command, we can run [multiple tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks#turborepo-can-multitask) in parallel:

_./helpers/motto-helpers/package.json_

```diff
...
  "scripts": {
-   "start": "run-p -l type-check:watch \"build -- --watch\"",
+   "start": "npm run build -- --watch",
    "build": "vite build",
    "type-check": "tsc --noEmit",
    "type-check:watch": "npm run type-check -- --watch --preserveWatchOutput"
  },
...
```

Update `turbo.json`:

_./turbo.json_

```diff
...
    "start": {
      "cache": false,
      "persistent": true
    },
+   "type-check:watch": {},
    "build": {
...
```

Update `package.json`:

_./package.json_

```diff
...
  "scripts": {
-   "start": "turbo start",
+   "start": "turbo start type-check:watch",
    "build": "turbo build"
  },
...
```

Uninstall `npm-run-all` in `motto-helpers`:

```bash
npm uninstall npm-run-all --save-dev -w @my-org/motto-helpers

```

Run it:

```bash
npm start

```

If we have more than one project where we need to run the `build` command, and they depend on each other, it will automatically resolve the execution order according to the dependencies.

Let's update the `house-helpers` project to add the `build` command:

```bash
npm install vite vite-plugin-dts --save-dev -w @my-org/house-helpers

```

_./helpers/house-helpers/package.json_

```diff
{
  "name": "@my-org/house-helpers",
  "version": "1.0.0",
- "private": true,
+ "private": false,
  "author": "Lemoncode",
  "license": "MIT",
- "types": "src/index.ts",
- "type": "module",
- "main": "src/index.ts",
+ "files": [
+   "dist"
+ ],
+ "type": "module",
+ "module": "dist/house-helpers.js",
+ "main": "dist/house-helpers.umd.cjs",
+ "types": "dist/index.d.ts",
+ "exports": {
+   ".": {
+     "import": "./dist/house-helpers.js",
+     "require": "./dist/house-helpers.umd.cjs",
+     "types": "./dist/index.d.ts"
+   }
+ },
+ "scripts": {
+   "start": "npm run build -- --watch",
+   "build": "vite build",
+   "type-check": "tsc --noEmit",
+   "type-check:watch": "npm run type-check -- --watch --preserveWatchOutput"
+ },
...

```

Add `vite.config.ts`:

_./helpers/house-helpers/vite.config.ts_

```typescript
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "HouseHelpers",
    },
  },
});

```

Run it:

```bash
npm start

```

> We can see some errors depends on the execution order.

Let's update the `turbo.json` file to add [task execution depency order](https://turbo.build/repo/docs/core-concepts/monorepos/task-dependencies):

> We must build `house-helpers` before `motto-helpers`

_./turbo.json_

```diff
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "start": {
      "cache": false,
      "persistent": true,
    },
    "type-check:watch": {},
    "build": {
      "outputs": ["dist/**/*"],
-     "dependsOn": ["type-check"]
+     "dependsOn": ["^build", "type-check"]
    },
    "type-check": {}
  }
}

```

> NOTE: The `^` symbol tells to turborepo that should run their dependencies `build` command before the current project one.

Run it:

```bash
npm run build

```

In the same way, we must apply the same approach to the `type-check` command:

_./turbo.json_

```diff
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "start": {
      "cache": false,
      "persistent": true
    },
    "type-check:watch": {},
    "build": {
      "outputs": ["dist/**/*"],
      "dependsOn": ["^build", "type-check"]
    },
    "type-check": {
+     "dependsOn": ["^build"]
    }
  }
}

```

> NOTE: Update the `house-helpers` project to invalidate the `cache`.

Run it again:

```bash
npm run build

```

Knowing the above, we could have some errors if we are running the `start` command without running the `build` command before (for example if we remove the dist folder on helpers):


```bash
npm start

```

Let's update it:

_./turbo.json_

```diff
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "start": {
      "cache": false,
      "persistent": true,
+     "dependsOn": ["build"]
    },
    "type-check:watch": {
+     "dependsOn": ["build"]
    },
    "build": {
      "outputs": ["dist/**/*"],
      "dependsOn": ["^build", "type-check"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    }
  }
}

```

> NOTE: We cannot use a `watch mode` command such as `dependsOn` because it will block the process.

Finally, if we only want to run a command for some projects, we can do it using the [filter](https://turbo.build/repo/docs/core-concepts/monorepos/filtering#multiple-filters) flag:


```bash
npm start -- --filter=@my-org/house-stark --filter='./helpers/*'

```
