# 02 Login

## Summary

This example takes the _01-routing_ example as a starting point.

We are going to set up a login form, in which the user introduces
his id and password and when pressing the login button is validated, if he enters the combination "admin" "test" he can navigate to listing page.

The goal of this example is to cover a very basic scenario that allows you to see how react works by handling a simple form.

## Step by Step Guide

- First we copy the previous example, and do an _npm install_.

```bash
npm install
```

- We are going to build the layout a simple login form:

- Let's add some basic styling:

```diff
body {
  font-family: Sans-Serif;
}

+.layout-center {
+  display: grid;
+  grid-template-columns: 1fr;
+  align-items: center;
+  justify-items: center;
+  margin-top: 2rem;
+ }

+ .login-root {
+  margin: 90px;
+ }
+
+ .login-container {
+  display: flex;
+  flex-direction: column;
+  row-gap: 20px;
+  align-items: center;
+ }
+
+.login-container > input {
+  width: 320px;
+ }

.login-container > button {
  width: 180px;
}
```

_./src/login.tsx_

```diff
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/list");
  };

  return (
    <>
+      <div className="login-container">
+        <input placeholder="Username" value="" />
+        <input placeholder="Password" type="password" value="" />
+        <button onClick={handleNavigation}>Login</button>
+      </div>
    </>
  );
};
```

- Now we are going to save in the status the value of username and the password

_./src/login.tsx_

```diff
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
+ const [username, setUsername] = React.useState('');
+ const [password, setPassword] = React.useState('');

  const handleNavigation = () => {
    navigate("/list");
  };

  return (
    <>
      <h2>Hello from login page</h2>
      <div>
        <div>
          <label>Username: </label>
-          <input placeholder="Username" value="" />
+          <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />

        </div>
        <div>
          <label>Password: </label>
          <input placeholder="Password" type="password" value="" />
+         <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
      </div>
```

- And now we go to the login click, when it is clicked we check if the user and password are (admin / test)if it is correct we navigate to list, if not we show an error message.

_./src/login.tsx_

```diff
export const LoginPage: React.FC = () => {
  const navigate = useNavigation();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleNavigation = () => {
+   if(username === 'admin' && password === 'test') {
      navigate("/list");
+   } else {
+     alert("User / password not valid, psst... admin / test")
+   }
  };
```

- To finish we are going to run refactor with the login form, We're going to put it inside a form. Why? Because it becomes more accessible and for example the submit button is executed when you press enter.

```diff
  return (
-    <>
+    <form onSubmit={handleNavigation}>
      <h2>Hello from login page</h2>
      <div>
        <div>
          <label>Username: </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

-      <button onClick={handleNavigation}>Login</button>
+      <button type="submit">login</button>
-    </>
+    </form>
```

- This seems to work... but if we look at the form submit is doing a post to the server, we have to tell the browser not to perform that opration by default.

```diff
-  const handleNavigation = () => {
+  const handleNavigation = (e: React.FormEvent<HTMLFormElement>) => {
+    e.preventDefault();

    if (username === "admin" && password === "test") {
      history.push("/list");
    } else {
      alert("User / password not valid, psst... admin / test");
    }
  };
```
