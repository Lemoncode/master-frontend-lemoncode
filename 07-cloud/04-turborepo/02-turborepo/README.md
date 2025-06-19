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
npm uninstall npm-run-all

npm install turbo --save-dev

```

> NOTICE: The turborepo package name is `turbo`.

Now, we will create the most important file, `turbo.json` where we define:

_./turbo.json_

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
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
+ "packageManager": "npm@10.0.0",
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

> [Add a packageManager](https://turbo.build/repo/docs/getting-started/add-to-existing-repository#add-a-packagemanager-field-to-root-packagejson)

Run it:

```bash
npm start

```

Let's add the `build` command, this time, we want to execute the `type-check` command before the build, if it fails, stop the process:

_./turbo.json_

```diff
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
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
-   "build": "npm run type-check && tsdown",
+   "build": "tsdown",
    "type-check": "tsc --noEmit"
  },
...
```

Let's add the `.turbo` folder to `.gitignore`:

_./.gitignore_

```diff
node_modules
dist
+.turbo

```

> [Edit .gitignore](https://turbo.build/repo/docs/getting-started/add-to-existing-repository#edit-gitignore)

Run it:

```bash
npm run build

```

> NOTES:
>
> Run multiple times to check that it is cached.
>
> Add some error in `motto-helpers` to check that the process is stopped.

If we have more than one project where we need to run the `build` command, and they depend on each other, it will automatically resolve the execution order according to the dependencies.

Let's update the `house-helpers` project to add the `build` command:

```bash
npm install tsdown --save-dev -w @my-org/house-helpers

```

_./helpers/house-helpers/package.json_

```diff
{
  "name": "@my-org/house-helpers",
  "version": "1.0.0",
- "private": true,
+ "private": false,
  "sideEffects": false,
  "author": "Lemoncode",
  "license": "MIT",
+ "files": [
+   "dist"
+ ],
  "type": "module",
+ "module": "dist/index.js",
+ "main": "dist/index.umd.js",
+ "types": "dist/index.d.ts",
  "exports": {
-   ".": "./src/index.ts"
+   ".": {
+     "types": "./dist/index.d.ts",
+     "import": "./dist/index.js",
+     "require": "./dist/index.umd.js"
+   }
  },
+ "scripts": {
+   "build": "vite build",
+   "type-check": "tsc --noEmit",
+ },
...

```

Add `tsdown.config.ts`:

_./helpers/house-helpers/tsdown.config.ts_

```typescript
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "src/index.ts",
  format: ["esm", "umd"],
  outputOptions: {
    name: "HouseHelpers",
  },
  minify: true,
});

```

Run it:

```bash
npm run build

```

> We can see some errors depends on the execution order.

Let's update the `turbo.json` file to add [task execution depency order](https://turbo.build/repo/docs/core-concepts/monorepos/task-dependencies):

> We must build `house-helpers` before `motto-helpers`

_./turbo.json_

```diff
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "start": {
      "cache": false,
      "persistent": true,
    },
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

In the same way, we must apply the same approach to the `type-check` command:

_./turbo.json_

```diff
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
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

Run it:

```bash
npm run build

```

Knowing the above, we can build the helpers projects before starting the applications:

```bash
npm start

```

Let's update it:

_./turbo.json_

```diff
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "start": {
      "cache": false,
      "persistent": true,
+     "interruptible": true,
+     "dependsOn": ["^build"]
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

Update the `package.json`:

_./package.json_

```diff
...
  "scripts": {
-   "start": "turbo start",
+   "start": "turbo watch start",
...

```

> [Using watch](https://turbo.build/repo/docs/reference/watch)

Run it:

```bash
npm start

```

> Make some changes in `house-helpers` and `motto-helpers` to check that the process is restarted.

Finally, if we only want to run a command for some projects, we can do it using the [filter](https://turbo.build/repo/docs/core-concepts/monorepos/filtering#multiple-filters) flag:

```bash
npm start -- --filter=@my-org/house-stark

```

> Another filter example if we want projects inside folder: `--filter='./helpers/*'`

Or even run multiple tasks at the same time:

_./package.json_

```diff
...
  "scripts": {
    "start": "turbo watch start",
-   "build": "turbo build"
+   "build": "turbo build test"
  },
...

```

> [Multiple tasks](https://turbo.build/repo/docs/crafting-your-repository/running-tasks#running-multiple-tasks)

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
