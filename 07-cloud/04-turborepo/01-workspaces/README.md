# 01 Workspaces

In this example, we are going to learn how we can work with `npm` workspaces.
We will start from `00-boilerplate`.

## Steps to build it

Let's start by creating the main `package.json` (we can use `npm init -y` to create it and then edit it):

```bash
npm init -y

```

Let's edit:

_./package.json_

```json
{
  "name": "game-of-thrones",
  "private": true
}
```

Create a `.gitignore` file:

_./.gitignore_

```
node_modules
dist
.turbo

```

If we want to create a new `workspace`:

```bash
npm init -y -w ./helpers/my-workspace

```

> NOTE: we can use the flag `-w` or `--workspace`.

Notice that we have updated the main `package.json` with a new field called `workspaces`:

_./package.json_

```json
{
  "name": "game-of-thrones",
  "private": true,
  "workspaces": ["helpers/my-workspace"]
}
```

In addition, we have created a new `package.json` inside the `helpers/my-workspace` folder, a `package-lock.json` in the root path and a `node_modules` folder with the `helpers/my-workspace` project symslink (although we don't have any third party dependency yet).

We can update the `package.json` root file to consider more that one workspace inside the `helpers` folder:

_./package.json_

```diff
{
  "name": "game-of-thrones",
  "private": true,
  "workspaces": [
-    "helpers/my-workspace"
+    "helpers/*"
  ]
}

```

Let's run `npm install` to update the `package-lock.json`:

```bash
npm install

```

Let's remove the `my-workspace` project and copy the `house-helpers` and `motto-helpers` projects from the `00-boilerplate` folder.

Let's run `npm install` again:

```bash
npm install

```

Notice that the `package-lock.json` has been updated with the `house-helpers` and `motto-helpers` projects dependencies and the symlinks have been created ( inside `node_modules/@my-org` folder).

> NOTE: also, we only have the root `node_modules` folder and the `package-lock.json` file, not inside each project.

## house-helpers project

This project is configured as an internal project, intended to be used without compilation, but directly reference the source code files.

_./helpers/house-helpers/package.json_

```json
{
  ...
  "types": "src/index.ts",
  "type": "module",
  "main": "src/index.ts",
}

```

## motto-helpers project

This project is configured to be published as a library in `npm`. Therefore, it has the `build` command for that purpose and the `start` command to be able to run it locally.

_./helpers/motto-helpers/package.json_

```json
{
  ...
  "type": "module",
  "module": "./dist/motto-helpers.js",
  "main": "./dist/motto-helpers.umd.cjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/motto-helpers.js",
      "require": "./dist/motto-helpers.umd.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "start": "npm run build -- --watch",
    "build": "vite build"
  },

```

Delete the `package-lock.json` file to force `npm` to create a new one:

```bash
rm package-lock.json

```

This project has the `house-helpers` project as a dependency because we are sharing the `House` enum type. We are going to install it using the workspace :

```bash
npm install @my-org/house-helpers -w @my-org/motto-helpers

```

> NOTE: We must install all the dependencies from the root path.

Update `motto-helpers` project:

_./helpers/motto-helpers/src/motto.helpers.ts_

```diff
+ import { House } from '@my-org/house-helpers';

const MOTTOS: Record<House, string> = {
  stark: 'Winter is Coming!',
  targaryen: 'Fire and Blood!',
  lannister: 'Hear Me Roar!',
  baratheon: 'Ours is the Fury!',
};

export const getHouseMotto = (house: House): string => MOTTOS[house];

```

Everything seems to be working fine, including the typings. Let's run it locally:

```bash
npm run start -w @my-org/motto-helpers

```

> Check the build in the `dist/motto-helpers.js` file.

If we add a new house in the `house-helpers` project:

_./helpers/house-helpers/src/house.models.ts_

```diff
export enum House {
  stark = 'stark',
  targaryen = 'targaryen',
  lannister = 'lannister',
+ baratheon = 'baratheon',
}

```

We can see that the `motto-helpers` project has a new compilation error (even without saving the file):

_./helpers/motto-helpers/src/motto.helpers.ts_

```diff
import { House } from '@my-org/house-helpers';

const MOTTOS: Record<House, string> = {
  stark: 'Winter is Coming!',
  targaryen: 'Fire and Blood!',
  lannister: 'Hear Me Roar!',
+ baratheon: 'Ours is the Fury!',
};

export const getHouseMotto = (house: House): string => MOTTOS[house];

```

## Web apps

Let's add a new workspace for the web apps:

_./package.json_

```diff
{
  "name": "game-of-thrones",
  "private": true,
  "workspaces": [
    "helpers/*",
+    "apps/*"
  ]
}

```

Copy the `baratheon`, `lannister`, `stark` and `targaryen` projects from the `00-boilerplate` folder to the `./apps/*` path.

Run it:

```bash
npm install

```

Every app will have the `house-helpers` and `motto-helpers` projects as dependencies. Let's install them using the workspace:

```bash
npm install @my-org/house-helpers @my-org/motto-helpers -w @my-org/house-baratheon

npm install @my-org/house-helpers @my-org/motto-helpers -w @my-org/house-lannister

npm install @my-org/house-helpers @my-org/motto-helpers -w @my-org/house-stark

npm install @my-org/house-helpers @my-org/motto-helpers -w @my-org/house-targaryen

```

Update the `stark` app project:

_./apps/stark/src/app.component.tsx_

```diff
import './app.css';
import logo from '/logo.png';
+ import { House, getHouseTitle } from '@my-org/house-helpers';
+ import { getHouseMotto } from '@my-org/motto-helpers';

function App() {
  return (
    <>
      <img src={logo} className="logo" />
+     <h1>{getHouseTitle(House.stark)}</h1>
+     <h2>{getHouseMotto(House.stark)}</h2>
    </>
  );
}

export default App;

```

> NOTE: Rest app projects are updated.

If we want to run all the projects at the same time, [npm has some flags](https://docs.npmjs.com/cli/v7/using-npm/workspaces#ignoring-missing-scripts) to run multiple workspaces commands at the same time:

```bash
npm start --workspaces --if-present

```

> But it doesn't work with watch mode because it blocks the execution on the first project.

Let's install a third party library [npm-run-all](https://www.npmjs.com/package/npm-run-all) to run commands in parallel:

```bash
npm install npm-run-all --save-dev

```

Update the root `package.json` file:

_./package.json_

```diff
{
  "name": "game-of-thrones",
  "private": true,
  "workspaces": [
    "helpers/*",
    "apps/*"
  ],
+ "scripts": {
+   "start": "run-p start:*",
+   "start:motto-helpers": "npm start -w @my-org/motto-helpers",
+   "start:stark": "npm start -w @my-org/house-stark",
+   "start:targaryen": "npm start -w @my-org/house-targaryen",
+   "start:lannister": "npm start -w @my-org/house-lannister",
+   "start:baratheon": "npm start -w @my-org/house-baratheon"
+ },
...

```

Run it:

```bash
npm start

```

> Add some updates in `motto-helpers` and `house-helpers` to check the watch mode.
