# Routes

So far we have created an application that works, but that can be hardly maintained and it wouldn't be abel to scale.

In the following examples we are going to refactor the app, in order to make more maintanable and let it grow
and scale.

All that we are going to apply here can be considered an overkill for such an small application, but it will
be our playground.

Let's start setting up routes:

We are going to refactor the navigation routes we have defined:

# Step by Step Guide

- Let's copy the previous example (04-basic-app/04-detail)

- Right now we have all the files mixed at _src_ folder level, this can become quite messy
  the project keeps on growing.

- Let's make a very basic and logical refactor, we are going to create a folder
  called _scenes_ to store all the pages:

```bash
cd src
```

```bash
mkdir scenes
```

> Tip if this grows we can create subfolders grouping the scenes by category

Now let's move all the pages to that scene folder.

Let's check that we haven't broken anything :)

```bash
npm start
```

If we take a look to _app.tsx_ VS Code has already updated the paths to that
file, not bad :), but if we take a look we are using relatives path to
reference that file, in this case is something that doesn't hurt quite a lot:

```tsx
import { LoginPage } from "./scenes/login";
import { ListPage } from "./scenes/list";
import { DetailPage } from "./scenes/detail";
```

But if were importing this scene from a subfolder we would start having the
dot dot hell, we could end up with imports like _../../../scenes/login_, why
not creating aliases for the root folders that could be accessed in a simple way?

We can defined paths in _tsconfig_ and aliases in _webpack_ uuh wait but then
we have to define similar stuff in two places, let's provide a solution that
would avoid this, first of all we are going to define and _@_ alias in our
_tsconfig.json_:

_tsconfig.json_

```diff
    "esModuleInterop": true,
+    "baseUrl": "src",
+    "paths": {
+      "@/*": ["*"]
+    }
  },
```

Cool now we could add this configuration to webpack (WAIT do not do that):

_webpack.config.json_

```diff
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
+   '@': path.resolve(__dirname, 'src'),
  },
```

But since we don't want to repeat code, let's see if somebody has
implemented some magic to allow webpack read this configuration from
the _tsconfig_

We have two approaches:

- Gist source code: https://gist.github.com/nerdyman/2f97b24ab826623bff9202750013f99e

- Webpack plugin: https://www.npmjs.com/package/tsconfig-paths-webpack-plugin

Let's go for the webpack plugin option:

```bash
npm install tsconfig-paths-webpack-plugin --save-dev
```

Now let's consume this plugin:

_./webpack.config.js_

```diff
const HtmlWebpackPlugin = require("html-webpack-plugin");
+ const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require("path");
const basePath = __dirname;

module.exports = {
  context: path.join(basePath, "src"),
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
+   plugins: [new TsconfigPathsPlugin()]
  },
```

Now we can update the imports to use the new _@_ alias.

_./src/app.tsx_

```diff
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
- import { LoginPage } from "./scenes/login";
- import { ListPage } from "./scenes/list";
- import { DetailPage } from "./scenes/detail";
+ import { LoginPage } from "@/scenes/login";
+ import { ListPage } from "@/scenes/list";
+ import { DetailPage } from "@/scenes/detail";
```

Let's refine this a little bit, having to paste an import per
page sounds a little bit repetitive and in the other hand if
in the future we decide to group some scenes under some subfolders
it may impact the _app_ imports declarations, let's create a barrel:

_./src/scenes/index.ts_

```ts
export * from "./detail";
export * from "./list";
export * from "./login";
```

And let's simplify our _app.tsx_

_./src/app.tsx_

```diff
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
- import { LoginPage } from "@/scenes/login";
- import { ListPage } from "@/scenes/list";
- import { DetailPage } from "@/scenes/detail";
+ import {LoginPage, ListPage, DetailPage} from "@/scenes";

export const App = () => {
```

To define the routes we are going to set up something that allows us to forget about hardcoded strings, besides this we have an additional challenge:

- On the one hand there are the routes that we define in the react router switch:

  - If they have no parameters they go as they are.
  - If they have parameters we have to define: editEmployee: '/employees/:id'.

- On the other hand, how we consume the routes:
  - If they have no parameters they go as is.
  - If they have parameters we call them with their /employees/2345 parameter.

We could consider making two lists with the constants of each route, but we would be encoding the strings twice and it would be easy to make mistakes when adding new members or modifying.

Since we have Typescript at hand, we can consider:

- Have an interface in which we enumerate which routes we are going to have available.

- Have an object that defines the routing for the SwitchRouter, which inherits from the routing interface.

- We define an interface that inherits from the base routes that we defined before, but we overwrite those that are of type parameter (they become of type function).

- We have an object for the navigation routes.
  Implementing it will help us understand it better:

First we define the routes for the switch and the object that defines them.

Since this is a crosscutting asset we will place it under the _./src/core_ path.

_./src/core/router/routes.ts_

```tsx
import { generatePath } from "react-router-dom";

interface SwitchRoutes {
  root: string;
  list: string;
  details: string;
}

export const switchRoutes: SwitchRoutes = {
  root: "/",
  list: "/list",
  details: "/detail/:id",
};
```

Let's definde the navigation routes: all the routes are the same but the _details_ route
(param definition vs real parameter when navigating):

Let's append the following content:

_./src/core/routers/routes.tsx_

```tsx
interface Routes extends Omit<SwitchRoutes, "details"> {
  details: (id: string) => string;
}
```

What are we doing here? Inheriting from the Switch interface and removing
the entries that are not the same in order to rewrite them.

Let's implement now the routes object (append content):

_./src/core/routers/routes.tsx_

```tsx
export const routes: Routes = {
  ...switchRoutes,
  details: (id) => generatePath(switchRoutes.details, { id }),
};
```

- Here there is something sounds strange, and that is that we are exporting "SwitchRoutes" and "Routes", shouldn't you call it "NavigationRoutes"? The thing is that we are going to encapsulate the router of our application inside this same folder and we are only going to expose out the navigation routes, we start by defining the router, we are going to bring some imports:

_./src/core/router/router.component.tsx_

```tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { switchRoutes } from "./routes";
import { LoginPage, ListPage, DetailPage } from "@/scenes";

export const RouterComponent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path={switchRoutes.root} element={<LoginPage />} />
        <Route path={switchRoutes.list} element={<ListPage />} />
        <Route path={switchRoutes.details} element={<DetailPage />} />
      </Routes>
    </Router>
  );
};
```

- Let's create a barrel under our core barrel, this case we just remove from the export
  the _switchRoutes_ since it's will be only used internally on the _routes.ts_ file.

_./src/core/index.ts_

```ts
export * from "./router/router.component";
export { routes } from "./router/routes";
```

Time to jump into _app.tsx_ and replace the router:

_./src/app.tsx_

```diff
import React from "react";
- import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
- import { LoginPage, ListPage, DetailPage } from "@/scenes";
+ import { RouterComponent } from 'core';

export const App = () => {
+    return <RouterComponent />;
-  return (
-    <Router>
-      <Routes>
-        <Route path="/" element={<LoginPage />} />
-        <Route path="/list" element={<ListPage />} />
-        <Route path="/detail/:id" element={<DetailPage />} />
-      </Routes>
-    </Router>
-  );
};
```

- Now is time to get rid of all the harcoded links that are around the app:

_./src/scenes/login.tsx_

```diff
+ import {routes} from 'core';
// (...)

  const handleNavigation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username === "admin" && password === "test") {
-      navigate("/list");
+      navigate(routes.list);
    } else {
      alert("User / password not valid, psst... admin / test");
    }
  };
```

_./src/scenes/list.tsx_

```diff
+ import {routes} from 'core';
// (...)

        {members.map((member) => (
          <>
            <img src={member.avatar_url} />
            <span>{member.id}</span>
-            <Link to={`/detail/${member.login}`}>{member.login}</Link>
+            <Link to={routes.details(member.login)}>{member.login}</Link>
          </>
        ))}
      </div>
-      <Link to="/detail">Navigate to detail page</Link>
    </>
```

_./src/scenes/detail.tsx_

```diff
+ import {routes} from 'core';
// (...)

      <p> bio: {member.bio}</p>
-      <Link to="/list">Back to list page</Link>
+      <Link to={routes.list}>Back to list page</Link>
    </>
```

Cool so in the first attempt we just code the app in minutes, now it has taken more time, what
are the benefits of this:

- [Aliases] We don't have "../../../../" hell.
- All routes are identified in one place.
- The constants are grouped in one place.
- The developer who consumes these routes only has to worry about using Routes, and as it is typed when it is a function type it will pop up indicating even the type of parameter that must be introduced.
