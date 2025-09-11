# 01 routing

## Summary

This example takes the _00-boiler_ example as a starting point.

We start from a base in which we have webpack configured and React installed, and we display a "Hello World" message.

We've talked about SPA applications, we're going to look at how to
use a router in React and we'll create 3 logical pages (all blank,
only with a link to navigate between them),
navigating between them:

- A login page.
- A list page.
- A detail page (this one will receive a parameter in the url).

## Step by Step guide

- First we copy the previous example, and do an _npm install_.

```bash
npm install
```

- In order to implement a SPA application we need a router,
  we will install _react-router_ (version 6 already includes the typings).

```bash
npm install react-router-dom --save
```

- We are going to create a blank login page, it is going to be a React component.

_./src/login.tsx_

```tsx
import React from "react";

export const LoginPage: React.FC = () => {
  return (
    <>
      <h2>Hello from login page</h2>
    </>
  );
};
```

- A list page:

_./src/list.tsx_

```tsx
import React from "react";

export const ListPage: React.FC = () => {
  return (
    <>
      <h2>Hello from List page</h2>
    </>
  );
};
```

- A detail page:

_./src/detail.tsx_

```tsx
import React from "react";

export const DetailPage: React.FC = () => {
  return (
    <>
      <h2>Hello from Detail page</h2>
    </>
  );
};
```

- Now let's define the routing in our _app.tsx_ file.:

_./src/app.tsx_

````diff
+ import React from "react";
+ import {
+  BrowserRouter as Router,
+  Routes,
+  Route,
+  Navigate,
+ } from "react-router-dom";
+ import {LoginPage} from './login';
+ import {ListPage} from './list';
+ import {DetailPage} from './detail';


export const App = () => {
-  return <h1>Hello React !!</h1>;
+ return (
+  <HashRouter>
+     <Routes>
+       <Route path="/" element={<LoginPage/>} />
+       <Route path="/list" element={<ListPage/>} />
+       <Route path="/detail" element={<DetailPage/>} />
+       <Route path="*" element={<Navigate to="/" />} />
+     </Routes>
+   </HashRouter>
+ );
};

- Let's run and see what happens (we can navigate by typing in the url of the browser):

```bash
npm start
````

- Navigating by typing the url is fine but the normal thing to do is to click on links or buttons,
  so let's go for it.

We will add a few links on each page:

_./src/login.tsx_

```diff
import React from "react";
+ import { Link } from "react-router-dom";

export const LoginPage: React.FC = () => {
  return (
    <>
      <h2>Hello from login page</h2>
+     <Link to="/list">Navigate to list page</Link>
    </>
  );
};
```

- On the listing page:

_./src/list.tsx_

```diff
import React from "react";
+ import { Link } from "react-router-dom";

export const ListPage: React.FC = () => {
  return (
    <>
      <h2>Hello from List page</h2>
+      <Link to="/detail">Navigate to detail page</Link>
    </>
  );
};
```

- On the detail page:

_./src/detail.tsx_

```diff
import React from "react";
+ import { Link } from "react-router-dom";

export const DetailPage: React.FC = () => {
  return (
    <>
      <h2>Hello from Detail page</h2>
+     <Link to="/list">Back to list page</Link>
    </>
  );
};
```

Great... but what if now I want to navigate from JavaScript (e.g. click on a button),I have to make use of a React Router DOM hook:

Let's add a button to navigate from login to the list page:

_./src/login.tsx_

```diff
import React from "react";
- import { Link } from "react-router-dom";
+ import { Link, useNavigate } from "react-router-dom";

export const LoginPage: React.FC = () => {
+ const navigate = useNavigate();

+  const handleNavigation = () => {
+    navigate("/list");
+  };

  return (
    <>
      <h2>Hello from login page</h2>
-      <Link to="/list">Navigate to list page</Link>
+      <button onClick={handleNavigation}>Login</button>
    </>
  );
};
```

- This looks good, but in the url you get a hashtag

```
http://localhost:8080/#/list
```

This is for navigation compatibility with older browsers, what is after the pad is ignored by browsers and is your place to define SPA routes.

If you want to change it you can use _BrowserRouter_ instead of _HashRouter_.

_./src/app.tsx_

```diff
import React from "react";
- import { HashRouter, Routes, Route } from "react-router-dom";
+ import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./login";
import { ListPage } from "./list";
import { DetailPage } from "./detail";

export const App = () => {
  return (
-      <HashRouter>
+      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage/>} />
          <Route path="/list" element={<ListPage/>} />
          <Route path="/detail" element={<DetailPage>} />
        </Routes>
-      </HashRouter>
+      </BrowserRouter>
  );
};
```

- The most convenient way is to use an alias to read the jsx better::

_./src/app.tsx_

```diff
import React from "react";
- import { BrowserRouter, Switch, Route } from "react-router-dom";
+ import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./login";
import { ListPage } from "./list";
import { DetailPage } from "./detail";

export const App = () => {
  return (
-    <BrowserRouter>
+    <Router>
        <Routes>
          <Route path="/" element={<LoginPage/>} />
          <Route path="/list" element={<ListPage/>} />
          <Route path="/detail" element={<DetailPage>} />
        </Routes>
-    </BrowserRouter>
+    </Router>
  );
};
```

When we use BrowserRouter in a SPA application, route management happens on the client side. However,
the browser still has its natural behavior: if you refresh the page on a route other than the root
(for example /list), the browser will try to request that resource directly from the server.

- With Vite: the development server is already set up for SPAs. By default, it always returns index.html
  for any unknown route. This way, React Router can handle which view to display without throwing an error.

- With Webpack Dev Server: this behavior is not enabled by default. If you refresh on /list,
  the browser will request /list from the server, but since that file doesn’t exist in the file system, you’ll get a 404.
  To prevent this, you need to configure historyApiFallback in webpack.config.js. This forces the server
  to redirect all unknown routes to index.html, allowing React Router to properly manage navigation.

In production the same thing will happen: if your server does not redirect all routes to index.html,
refreshing on a page other than the root will result in an error. The solution is to configure the
fallback or rewrite rule depending on the server (Nginx, Apache, Netlify, etc.).

**ATTENTION: CONFIGURATION FOR WEBPACK**
If you want to fix it in _webpack.config_ for local development:

_./webpack.config.js_

```diff
  stats: "errors-only",
  output: {
    filename: "[name].[chunkhash].js",
+    publicPath: "/",
  },
+  devServer: {
+    historyApiFallback: true,
+  },
```

And to fix it in production: https://tylermcginnis.com/react-router-cannot-get-url-refresh/
