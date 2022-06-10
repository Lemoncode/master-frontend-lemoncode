# 03 List

## Summary

This example takes the _02-login_ example as a starting point.

We are going to implement a list page and link it to a detail page.

That is, we will show a list of members that belong to a Github organisation.
and when we click on a user's name we'll navigate to the detail page by passing in the
detail page by passing in the URL the id of the selected member.

In this example we'll do a direct implementation of the list, if you
you want to see a step by step you can consult a previous example that we have
which shows how to create a list of users step by step.

## Paso a Paso

- First we copy the above example, and do an _npm install_.

```bash
npm install
```

- If we want to see what kind of data we are going to handle, we can open the web browser and see what Github's Rest API returns.

```bash
https://api.github.com/orgs/lemoncode/members
```

- We are going to create an interface to have our interface typed, and modify the component that will display this listing.

_./src/list.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";

+ interface MemberEntity {
+   id : string;
+   login: string;
+   avatar_url: string;
+ }

export const ListPage: React.FC = () => {
+  const [members, setMembers] = React.useState<MemberEntity[]>([]);

  return (
    <>
      <h2>Hello from List page</h2>
      <Link to="/detail">Navigate to detail page</Link>
    </>
  );
};
```

- We are now going to load the data

_./src/list.tsx_

```diff
export const ListPage: React.FC = () => {
  const [members, setMembers] = React.useState<MemberEntity>([]);

+  React.useEffect(() => {
+    fetch(`https://api.github.com/orgs/lemoncode/members`)
+      .then((response) => response.json())
+      .then((json) => setMembers(json));
+  }, []);

  return (
```

- Let's check that the data is indeed being loaded:

_./src/list.tsx_

```diff
  return (
    <>
      <h2>Hello from List page</h2>
+    {members.map((member) =>
+       <span key={member.id}>{member.login}</span>
+    )}
-      <Link to="/detail">Navigate to detail page</Link>
    </>
  );
```

- And now let's add a grid table showing the data:

_./src/styles.css_

```diff
+ .list-user-list-container {
+  display: grid;
+  grid-template-columns: 80px 1fr 3fr;
+  grid-template-rows: 20px;
+  grid-auto-rows: 80px;
+  grid-gap: 10px 5px;
+}
+
+.list-header {
+  background-color: #2f4858;
+  color: white;
+  font-weight: bold;
+}
+
+.list-user-list-container > img {
+  width: 80px;
+}
```

_./src/list.tsx_

```diff
  return (
    <>
-      <h2>Hello from List page</h2>
-      {members.map((member) => (
-        <span key={member.id}>{member.login}</span>
-      ))}
+      <div className="list-user-list-container">
+        <span className="list-header">Avatar</span>
+        <span className="list-header">Id</span>
+        <span className="list-header">Name</span>
+        {members.map((member) => (
+          <>
+            <img src={member.avatar_url} />
+            <span>{member.id}</span>
+            <span>{member.login}</span>
+          </>
+        ))}
+      </div>
    </>
  );
```

- So far so good, but I want that when the user clicks on a member's name, he/she navigates to the
  member navigates to the detail page of the application to display the token, we could first
  first we could think of building something like this:

```diff
  <td>
-    <span>{member.login}</span>
+    <Link to={`/detail/${member.login}`}>{member.login}</Link>
  </td>
```

- Another way to create the url is to use _generatePath_, but be careful in version 5
  this did do the encoding of the parameters, in version 6 it didn't (https://github.com/remix-run/react-router/issues/7428)

_./src/list.tsx_

```diff
import React from "react";
- import { Link } from "react-router-dom";
+ import { Link, generatePath } from "react-router-dom";
```

_./src/list.tsx_

```diff
  <td>
-    <Link to={`/detail/${member.login}`}>{member.login}</Link>
+    <Link to={generatePath('/detail/:id', {id: member.login})}>{member.login}</Link>
  </td>
```

What is the impact of not encoding? If you want to test it, replace the code inside the useEffect with this one;

```tsx
setMembers([{ id: "2", login: "a/b", avatar_url: "" }]);
```

> In the architecture part we will learn how to remove "magic strings" from our application.
> harcoding url all around our app is not a good idea.

- Very interesting, but how can I read the id of the user I am receiving in the URL parameter?

First we are going to define the parameter in the url of our router.

_./src/app.tsx_

```diff
-  <Route path="/detail" element={<DetailPage />} />
+  <Route path="/detail/:id" element={<DetailPage/>}/>
  </Route>
```

Using the _useParams_ hooks.

_./src/detail.tsx_

```diff
import React from "react";
- import { Link } from "react-router-dom";
+ import { Link, useParams } from "react-router-dom";


export const DetailPage: React.FC = () => {
+ const {id} = useParams();

  return (
    <>
      <h2>Hello from Detail page</h2>
+     <h3>User Id: {id}</h3>
      <Link to="/list">Back to list page</Link>
    </>
  );
};
```
