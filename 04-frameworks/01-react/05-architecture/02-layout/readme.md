# Layout

Fine... now we pages and routes under control, but... usually some pages
same some structure in common, e.g. a header, footer, and some others not
(e.g. login Screen).

If you jump back to the ASP .net days there was a concept call _master pages_
where you defined a layout, and a place holder to show the pages content, we
will implement something quite similar.

# Step by Step Guide

Ok, first of all, where should we display this _master pages_ / _layouts_
definitions? Let's create a folder _layouts_ under our _src_ folder.

```bash
cd src
```

```bash
mkdir layouts
```

- First of all we will create a layout that will center the content, this layout will let us
  simplifiy our Login Page:

_./src/layouts/center.layout.tsx_

```tsx
import React from "react";

export const CenterLayout: React.FC = ({ children }) => (
  <div className="layout-center">{children}</div>
);
```

- Let's create the barrel for the layout subfolder:

_./src/layouts/index.ts_

```ts
export * from "./center.layout";
```

- Let's apply this layout to the login page:

_./src/scenes/login.tsx_

```diff
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "core";
+ import {CenterLayout} from '@/layouts';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleNavigation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username === "admin" && password === "test") {
      navigate(routes.list);
    } else {
      alert("User / password not valid, psst... admin / test");
    }
  };

  return (
-    <div className="layout-center">
+    <CenterLayout>
      <form onSubmit={handleNavigation}>
        <div className="login-container">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">login</button>
        </div>
      </form>
-    </div>
+    </CenterLayout>
  );
};
```

In this case it maybe a lite change but, take this into consideration:

- Separation of concerns, layout is defined in a separated place.
- We could reused for other pages.
- In the future we could use this login widget in other places (spoiler alert, pods).

> Using React Router you can as well integrate layouts.

- Let's keep on playing with layouts, now we are going to define an app layout that
  will contain a header.

_./src/styles.css_

```diff
body {
  font-family: Sans-Serif;
}

.layout-center {
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  justify-items: center;
  margin-top: 2rem;
}

+ .layout-app-container {
+  display: grid;
+  grid-template-columns: 1fr;
+  grid-template-rows: 50px 1fr;
+ }
+
+.layout-app-header {
+  color: white;
+  background-color: #007661;
+  display: flex;
+  align-items: center;
+  justify-content: flex-end;
+  padding-right: 5px;
+}
```

_./src/layouts/app.layout.tsx_

```tsx
import React from "react";

export const AppLayout: React.FC = ({ children }) => (
  <div className="layout-app-container">
    <div className="layout-app-header">User Logged in</div>
    {children}
  </div>
);
```

- Let's add the layout to the layout barrel

_./src/layouts/index.ts_

```diff
export * from "./center.layout";
+ export * from './app.layout';
```

- Let's update the list page:

_./src/scenes/list.tsx_

```diff
+ import {AppLayout} from '@/layouts';
// (...)

  return (
-    <>
+    <AppLayout>
      <h2>Hello from List page</h2>
      <div className="list-user-list-container">
        <span className="list-header">Avatar</span>
        <span className="list-header">Id</span>
        <span className="list-header">Name</span>
        {members.map((member) => (
          <>
            <img src={member.avatar_url} />
            <span>{member.id}</span>
            <Link to={routes.details(member.login)}>{member.login}</Link>
          </>
        ))}
      </div>
      <Link to="/detail">Navigate to detail page</Link>
+    </AppLayout>
-    </>
  );
```

Now let's jump into details, stop for a second and try to add
the layout in that pages by yourself.

_./src/scenes/detail.tsx_

```diff
+ import {AppLayout} from '@/layouts';
// (...)

  return (
-    <>
+    <AppLayout>
       <h2>Hello from Detail page</h2>
       <p> id: {member.id}</p>
       <p> login: {member.login}</p>
       <p> name: {member.name}</p>
       <p> company: {member.company}</p>
       <p> bio: {member.bio}</p>
       <Link to={routes.list}>Back to list page</Link>
-    </>
+    </AppLayout>
  );
```
