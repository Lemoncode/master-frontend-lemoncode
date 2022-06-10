# 04 List Users

## Summary

This example takes the _03-webpack-react_ example as a starting point.

We're going to ask the Github API for the list of members that belong to an
organisation and display it on the screen.

We're going to do this example in a quick and dirty way, in the next one we're going to
refactor it to take advantage of the benefits of working with TypeScript and how to make our
with TypeScript and how to make our code more maintainable.

What we are going to learn in this example:

- How to create a visualisation component without having to rely on reading from a remote source.
  from a remote source.
- How to iterate and display a list of results.
- How to make an arbitrary call to request data from a remote api.
- How to put this data in the state of our component in React.

## Step by step guided example

- First we copy the above example, and do an _npm install_.

```bash
npm install
```

- If we want to see what kind of data we're going to handle, we can open up the
  web browser and see what the Rest API from Github returns

```bash
https://api.github.com/orgs/lemoncode/members
```

- Let's create a similar dataset that shows two members of an organisation.

_./src/app.tsx_

```diff
import React from "react";

+ const membersMock = [
+  {
+     id: 14540103,
+     login: "antonio06",
+     avatar_url: "https://avatars1.githubusercontent.com/u/14540103?v=4"
+  },
+  {
+     id: 1457912,
+     login: "brauliodiez",
+     avatar_url: "https://avatars1.githubusercontent.com/u/1457912?v=4"
+  },
+  ];

export const App = () => {
  return <h1>Hello React !!</h1>;
};
```

- Now that we have the data, let's add state to our component and load this default data.
  and load this default data into it.

_./src/app.tsx_

```diff
export const const App = () => {
+ const [members, setMembers] = React.useState(membersMock);

  return <h1>Hello React !!</h1>;
};
```

- Now we have the data in our state, let's display the first element
  and see if the display name is _antonio06_:

_./src/app.tsx_

```diff
export const App = () => {
  const [members, setMembers] = React.useState(membersMock);

+  return <span>{members[0].login}</span>

-  return <h1>Hello React !!</h1>;
};
```

- We tested:

```bash
npm start
```

- This isn't bad, but maybe the list doesn't have any elements, but it can still have 5, how do we iterate through the elements in the list? Using ES6's _map_.

_./src/app.tsx_

```diff
export const App = () => {
  const [members, setMembers] = React.useState(membersMock);

-  return <span>{members[0].login}</span>;
+  return (
+    <>
+      {members.map((member) => (
+        <span key={member.id}>{member.login}</span>
+      ))}
+    </>
+  )
};
```

With these lines of code, we are iterating through the array of members and creating a span element for each entry,
to take into account:

- key: when we create elements dynamically, we need to add a unique key to them (so React can optimise the rendering).
  the rendering).

- Member Login: we read the value of the current array element and display the login field.

- Now that we see that it works we are going to fit this in a grid, let's define some gobal styles
  (check [CSS modules example](https://github.com/Lemoncode/master-frontend-lemoncode/tree/master/03-bundling/01-webpack/12-css-modules), to learn how to configure component isolated CSS)

_./src/styles.css_

```css
body {
  font-family: Sans-Serif;
}

.user-list-container {
  display: grid;
  grid-template-columns: 80px 1fr 3fr;
  grid-template-rows: 20px;
  grid-auto-rows: 80px;
  grid-gap: 10px 5px;
  max-width: 40vw;
}

.header {
  background-color: #2f4858;
  color: white;
  font-weight: bold;
}

.user-list-container > img {
  width: 80px;
}
```

- And let's integrate it in our app component:

_./src/app.tsx_

```diff
export const App = () => {
  const [members, setMembers] = React.useState(membersMock);

-  return members.map((member) => <span key={member.id}>{member.login}</span>);
+  return (
+    <div className="user-list-container">
+      <span className="header">Avatar</span>
+      <span className="header">Id</span>
+      <span className="header">Name</span>
+      {members.map((member) => (
+        <>
+          <img src={member.avatar_url} />
+          <span>{member.id}</span>
+          <span>{member.login}</span>
+        </>
+      ))}
+    </div>
+  )
```

So we have created here a CSS Grid container added the header and loop all the items
of the user list.

- So far so good but... I want to use the Github API not mock data, let's start by
  by removing the mock data and initialising the state of our component to an empty array:

```diff
- const membersMock = [
-  {
-    id: 14540103,
-    login: "antonio06",
-    avatar_url: "https://avatars1.githubusercontent.com/u/14540103?v=4",
-  },
-  {
-    id: 1457912,
-    login: "brauliodiez",
-    avatar_url: "https://avatars1.githubusercontent.com/u/1457912?v=4",
-  },
- ];

export const App = () => {
-  const [members, setMembers] = React.useState(membersMock);
+  const [members, setMembers] = React.useState([]);
```

- How can I make the call to the Github server and get the data right when the component is mounted in my HTML?
  We'll use _useEffect_ for this, which we'll cover later when we cover hooks.

```diff
export const App = () => {
  const [members, setMembers] = React.useState([]);

+  React.useEffect(() => {
+  }, []);

  return (
```

Here we execute a code just when the component mounts the DOM, the square brackets that we find at the end of useEffect
are the ones that indicate that it is only executed once when the component is mounted, we will learn how this works in detail later.

- Now we have to make the AJAX call inside that _useEffect_.

_./src/app.tsx_

```diff
  React.useEffect(() => {
+    fetch(`https://api.github.com/orgs/lemoncode/members`)
+      .then((response) => response.json())
+      .then((json) => setMembers(json));
  }, []);
```

What are we doing here? We are making a call to the Github REST API, this api is asynchronous (hence why we use
promises), first we parse the result to _json_ and then we assign that result to the state of our component by
by invoking _setMembers_

- If we start the project we will see how it is now performing the server load.

```bash
npm start
```
