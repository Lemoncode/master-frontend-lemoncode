# Pods

So far breaking into pages seems to be a fair solutions since our app is very simple, but imagine a real scenario:

- If our page logic grows then we have to split it into different files, we would have to create a folder per page.
- A given folder can have rich functionallity that could be reused in other pages, or a given page could
  use several rich pieces.
- In some SSR frameworks, the page is on a public folder and we don't want to mess it up with other files (e.g.
  business logic, mappers...)
- Is not a bad idea to separate concerns and ensure that the page only handle page related stuff, choose layout,
  handle navigation params...

Following ember approach we are going to encapsulate rich functionallity in pods, this pods will be rich isolated
functionallity islands, based on our experiencie the pod / page mapping use to be one to one, but there are
cases where a given page can consume more than one pod (e.g. dashboard), or the other way around (e.g. a login
pod that is used in several places in the app login page, menu login layer, etc...)

# Step by step guide

- Let's start refactoring this, we will start by creating a pods folder:

```bash
cd src
```

```bash
mkdir pods
```

- In this case we will define the following pods:
  - login
  - list
  - detail

```bash
cd pods
```

```bash
mkdir login
```

```bash
mkdir list
```

```bash
mkdir detail
```

Let's start migrating the login page content, usually we will create a first level container component
that will hold the state and a dumb component that will contain the layout (in this case we could discuss
whether this is not neccessary and in other we will need a more elaborated solutions for instance create
components folder to breakdown the dumb components into more levels, or...):

We will refactor the login code in order to isolate what is container aim and component stuff (low level
submit args etc...)

_./pods/login/login.container.tsx_

```tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "core";
import { ProfileContext } from "@/core/profile";

export const LoginContainer: React.FC = () => {
  const navigate = useNavigate();
  const { setUserProfile } = React.useContext(ProfileContext);

  const handleLogin = (username: string, password: string) => {
    if (username === "admin" && password === "test") {
      setUserProfile({ userName: username });
      navigate(routes.list);
    } else {
      alert("User / password not valid, psst... admin / test");
    }
  };

  return <LoginComponent onLogin={handleLogin} />;
};
```

- Is time to define the contract for the props:

_./pods/login/login.component.tsx_

```tsx
import React from "react";

interface Props {
  onLogin: (username: string, password: string) => void;
}

export const LoginComponent: React.FC<Props> = (props) => {
  return <></>;
};
```

Let's import the component in the container

_./src/login.container.tsx_

```diff
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "core";
import { ProfileContext } from "@/core/profile";
+ import {LoginComponent} from './login.component';
```

- Time to dig into Login Component

_./pods/login/login.component.tsx_

```diff
import React from "react";

interface Props {
  onLogin : (username: string, password: string) => void;
}

export const LoginComponent: React.FC<Props> = (props) => {
+  const { onLogin } = props;
+  const [username, setUsername] = React.useState("");
+  const [password, setPassword] = React.useState("");

+ const handleNavigation = (e: React.FormEvent<HTMLFormElement>) => {
+    e.preventDefault();
+    onLogin(username, password);
+ }

-  return <></>
+  return (
+      <form onSubmit={handleNavigation}>
+        <div className="login-container">
+          <input
+            placeholder="Username"
+            value={username}
+            onChange={(e) => setUsername(e.target.value)}
+          />
+          <input
+            placeholder="Password"
+            type="password"
+            value={password}
+            onChange={(e) => setPassword(e.target.value)}
+          />
+          <button type="submit">login</button>
+        </div>
+      </form>
+  );
}
```

- Let's expose the container in a barrel

_./pods/login/index.ts_

```ts
export * from "./login.container";
```

- And it's time to use it in our scene:

_./src/scenes/login.tsx_

```diff
import React from "react";
+ import { LoginContainer } from '@/pods/login';
- import { useNavigate } from "react-router-dom";
- import { routes } from "core";
import { CenterLayout } from "@/layouts";
- import { ProfileContext } from "@/core/profile";

export const LoginPage: React.FC = () => {
-  const navigate = useNavigate();
-  const [username, setUsername] = React.useState("");
-  const [password, setPassword] = React.useState("");
-  const { setUserProfile } = React.useContext(ProfileContext);
-
-  const handleNavigation = (e: React.FormEvent<HTMLFormElement>) => {
-    e.preventDefault();
-
-    if (username === "admin" && password === "test") {
-      setUserProfile({ userName: username });
-      navigate(routes.list);
-    } else {
-      alert("User / password not valid, psst... admin / test");
-    }
-  };
-
  return (
    <CenterLayout>
+      <LoginContainer/>
-      <form onSubmit={handleNavigation}>
-        <div className="login-container">
-          <input
-            placeholder="Username"
-            value={username}
-            onChange={(e) => setUsername(e.target.value)}
-          />
-          <input
-            placeholder="Password"
-            type="password"
-            value={password}
-            onChange={(e) => setPassword(e.target.value)}
-          />
-          <button type="submit">login</button>
-        </div>
-      </form>
    </CenterLayout>
  );
};
```

- That was fine, let's apply what we have learned, ... stop and try to port to pods the
  list page.

** Excercise wait some minutes **

- First let's create the list pod

```bash
cd src
```

```bash
mkdir list
```

And create the List container and component, this time the container will hold the logic to
load the list of users and the component will hold the display, here we could discuss as
well where to place the navigation logic, we could bubble up to the container or just
place it in the innner component.

- Now we need a model file to store the entity:

_./pods/list/list.vm.ts_

```ts
export interface MemberEntity {
  id: string;
  login: string;
  avatar_url: string;
}
```

_./pods/list/list.container.tsx_

```tsx
import React from "react";
import { ListComponent } from "./list.component";
import { MemberEntity } from "./list.vm";

export const ListContainer: React.FC = () => {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);

  React.useEffect(() => {
    fetch(`https://api.github.com/orgs/lemoncode/members`)
      .then((response) => response.json())
      .then((json) => setMembers(json));
  }, []);

  return <ListComponent members={members} />;
};
```

_./pods/list/list.component.tsx_

```tsx
import { routes } from "@/core";
import React from "react";
import { Link } from "react-router-dom";
import { MemberEntity } from "./list.vm";

interface Props {
  members: MemberEntity[];
}

export const ListComponent: React.FC<Props> = (props) => {
  const { members } = props;
  return (
    <>
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
    </>
  );
};
```

Let's create a barrel:

_./src/pods/list/index.ts_

```ts
export * from "./list.container";
```

And let's consume it in the scene:

_./src/scenes/list.tsx_

```diff
import React from "react";
- import { Link } from "react-router-dom";
- import { routes } from "core";
import { AppLayout } from "@/layouts";
+ import { ListContainer } from '@/pods/list';

- interface MemberEntity {
-  id: string;
-  login: string;
-  avatar_url: string;
- }
-
- export const ListPage: React.FC = () => {
-  const [members, setMembers] = React.useState<MemberEntity[]>([]);
-
-  React.useEffect(() => {
-    fetch(`https://api.github.com/orgs/lemoncode/members`)
-      .then((response) => response.json())
-      .then((json) => setMembers(json));
-  }, []);
-
  return (
    <AppLayout>
+      <ListContainer/>
-      <h2>Hello from List page</h2>
-      <div className="list-user-list-container">
-        <span className="list-header">Avatar</span>
-        <span className="list-header">Id</span>
-        <span className="list-header">Name</span>
-        {members.map((member) => (
-          <>
-            <img src={member.avatar_url} />
-            <span>{member.id}</span>
-            <Link to={routes.details(member.login)}>{member.login}</Link>
-          </>
-        ))}
-      </div>
-      <Link to="/detail">Navigate to detail page</Link>
    </AppLayout>
  );
};
```

- Let's refactor the detail component, we could think this is just a boring taks, BUUUUUT.... there's a good new item
  for dicussion: we are reading parameters from the query string, who should take responsability on reading this value,
  we have two options:
  - Let the scene handle this and pass it as a prop to the pod.
  - Let the pod handle this and use the react router hook useParams to directly get the data.

There's no silver bullet, so... ** Discussion... what do you think would be the best approach? **
(...)

We have chosen the scene to handle the url parameter parsing and pass it as a prop to the pod, Why?

- It is information related to the page (scene).
- The detail pod could be easier reused in other pages, you are not tied up to certain url param.
- The detail pod is simpler and has well identified contract (props).

Let's go for it :)

- Let's create the detail pod:

```bash
cd src
```

```bash
mkdir detail
```

- We have to define a viewmodel file that will contain the _MemberDetailEntity_

_./src/pods/detail/detail.vm.ts_

```ts
export interface MemberDetailEntity {
  id: string;
  login: string;
  name: string;
  company: string;
  bio: string;
}

export const createDefaultMemberDetail = () => ({
  id: "",
  login: "",
  name: "",
  company: "",
  bio: "",
});
```

- Let's create the detail container:

_./src/pods/details/detail.container.tsx_

```tsx
import React from "react";
import { MemberDetailEntity, createDefaultMemberDetail } from "./detail.vm";
import { DetailComponent } from "./detail.component";

interface Props {
  id: string;
}

export const DetailContainer: React.FC<Props> = (props) => {
  const { id } = props;
  const [member, setMember] = React.useState<MemberDetailEntity>(
    createDefaultMemberDetail()
  );

  React.useEffect(() => {
    fetch(`https://api.github.com/users/${id}`)
      .then((response) => response.json())
      .then((json) => setMember(json));
  }, []);

  return <DetailComponent member={member} />;
};
```

- And the detail component:

_./src/pods/details/detail.component.tsx_

```tsx
import React from "react";
import { Link } from "react-router-dom";
import { routes } from "core";
import { MemberDetailEntity } from "./detail.vm";

interface Props {
  member: MemberDetailEntity;
}

export const DetailComponent: React.FC<Props> = (props) => {
  const { member } = props;

  return (
    <>
      <h2>Hello from Detail page</h2>
      <p> id: {member.id}</p>
      <p> login: {member.login}</p>
      <p> name: {member.name}</p>
      <p> company: {member.company}</p>
      <p> bio: {member.bio}</p>
      <Link to={routes.list}>Back to list page</Link>
    </>
  );
};
```

- And let's expose it via barrel:

_./src/pods/details/index.ts_

```ts
export * from "./detail.container";
```

- And let's replace it in the scene.

_./src/scenes/details.tsx_

```diff
import React from "react";
- import { Link, useParams } from "react-router-dom";
+ import { useParams } from "react-router-dom";
- import { routes } from "core";
import { AppLayout } from "@/layouts";
+ import { DetailContainer } from '@/pods/detail';

- interface MemberDetailEntity {
-  id: string;
-  login: string;
-  name: string;
-  company: string;
-  bio: string;
- }
-
-const createDefaultMemberDetail = () => ({
-  id: "",
-  login: "",
-  name: "",
-  company: "",
-  bio: "",
- });

export const DetailPage: React.FC = () => {
-  const [member, setMember] = React.useState<MemberDetailEntity>(
-    createDefaultMemberDetail()
-  );
  const { id } = useParams();

-  React.useEffect(() => {
-    fetch(`https://api.github.com/users/${id}`)
-      .then((response) => response.json())
-      .then((json) => setMember(json));
-  }, []);

  return (
    <AppLayout>
+      <DetailContainer id={ id }/>
-      <h2>Hello from Detail page</h2>
-      <p> id: {member.id}</p>
-      <p> login: {member.login}</p>
-      <p> name: {member.name}</p>
-      <p> company: {member.company}</p>
-      <p> bio: {member.bio}</p>
-      <Link to={routes.list}>Back to list page</Link>
    </AppLayout>
  );
};
```

Let's give a try:

```bash
npm start
```
