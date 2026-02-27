# 01 Basic - Hi React

We are going to migrate the JavaScript application from _01-concepts_ ato react. [Here you have the complete example we are going to develop](https://codesandbox.io/p/sandbox/react-basic-h9rhkk) For this, we’ll create a React codesandbox..

We create the same file _./api.js_

```js
export const getUsers = () => [
  { id: 1955, name: "Rick Sánchez" },
  { id: 8765, name: "Beth Harmon" },
  { id: 7562, name: "Farrokh Bulsara" },
];
```

Next, from the example we left ready in _01-concepts_, we are going to copy and paste _index.js_. We are only going to change what each of the components returns. The reason is that in React, components return `jsx` elements, which is nothing more than syntactic sugar for JavaScript.

**We replace string literals with jsx elements in the components:**

For example in the `Header` component:

- In Javascript:

```js
const Header = () => {
  return `<h4>Lista de usuarios</h4>`;
};
```

- In React:

```jsx
const Header = () => {
  return <h4>Lista de usuarios</h4>`
};
```

If we apply the same type of change in the rest of the components, the index.jsx file should look like this:

```jsx
import React from "react";
import { getUsers } from "./api";
import "./styles.css";

const Header = () => {
  return <h4>Lista de usuarios</h4>;
};

const User = ({ user }) => {
  let randomNumber = Math.random();

  setTimeout(() => {
    randomNumber = Math.random();
    console.log(randomNumber);
  }, 3000);

  return (
    <div>
      {user.id}: {user.name} - {randomNumber}
    </div>
  );
};

const List = () => {
  const users = getUsers();
  return <div>{users.map((user) => User({ user }))}</div>;
};

export default function App() {
  return (
    <div>
      {Header()}
      {List()}
    </div>
  );
}
```

We check that our application renders the list on the screen.

**React syntax**
In React we are able to use `jsx` syntax when we invoke our components:

```diff
export default function App() {
  return (
    <div>
+     <Header />
+     <List />
-     {Header()}
-     {List()}
    </div>
  );
}
```

Also, if we want to pass an argument through props (the input arguments to our component):

```diff
const List = () => {
  const users = getUsers();
-   return <div>{users.map((user) => User({ user }))}</div>;
+   return <div>{users.map((user) => <User user={user} />)}</div>;
};
```

When doing this, the console will throw an error that appears when we render elements by iterating over a list. As we can see in the trace, it asks us to pass the component a unique `key` value (later on we’ll see why this is necessary):

```diff
const List = () => {
  const users = getUsers();
-   return <div>{users.map((user) => <User user={user} />)}</div>;
+   return <div>{users.map((user) => <User user={user} key={user.id} />)}</div>;
};
```

But as we can see, the `randomNumber` variable is still out of sync with our user interface. This happens because we are not storing that value in state, so React doesn’t know about the change. To make our application reactive, we make the following change:

```diff
const User = ({ user }) => {
-   let randomNumber = Math.random();
+   const [randomNumber, setRandomNumber] = React.useState(Math.random())


setTimeout(() => {
-    randomNumber = Math.random();
+    setRandomNumber(Math.random());
    console.log(randomNumber);
}, 3000);


  return (
    <div>
      {user.id}: {user.name} - {randomNumber}
    </div>
  );
};
```

If we look closely, we see that even though it’s a setTimeout (which should execute only once), it’s actually running every three seconds. Why?

In the code, the setTimeout is inside the body of the component. That means every time the component re-renders, React creates a new setTimeout.

When the setTimeout finishes, it calls setRandomNumber, which changes the state. That state change triggers a new render, and in that render a new setTimeout is created again. This creates an infinite loop:

1. Execution/render → creates setTimeout.
2. SetTimeout → randomNumber changes state.
3. React detects state change → React re-renders component.
4. Back to step 1.

The key: it’s not that the setTimeout repeats automatically, but that it gets recreated on every execution.

When we write logic directly inside a React component, that logic will run on every render. This can cause performance issues, application errors, or even infinite loops (like in this setTimeout case, which gets recreated every render).

To control when and under what conditions some code executes, React gives us the useEffect hook, which allows us to manage side effects (like timers, API requests, or event subscriptions) in a controlled way.

Its syntax is:

```jsx
useEffect(() => {
  // 👇 Código (efecto) que quieres ejecutar
}, [dependencias]);
```

Parameters of useEffect:

- Callback (effect): the function we want to execute.
- Dependency list: an array that tells React when to re-run the callback.

Examples:

- [] → the effect runs only once, when the component mounts.
- [state] → the effect runs every time that state changes.
- undefined → the effect runs on every render.

So, we use `useEffect` with an empty dependency array, because we want the setTimeout to run only once, when the component is created:

```diff
const User = ({ user }) => {
const [randomNumber, setRandomNumber] = React.useState(Math.random())

+   React.useEffect(()=>{
      setTimeout(() => {
        setRandomNumber(Math.random());
        console.log(randomNumber);
      }, 3000);
+   },[])

  return (
    <div>
      {user.id}: {user.name} - {randomNumber}
    </div>
  );
};
```

Now let’s create a button that, when clicked, adds a new element to the list:

```diff
const List = () => {
-   const users = getUsers();
+   Const [users, setUsers] = React.useState(getUsers());

+   const handleClick = () => {
+     setUsers([...users, {id: 1234, name: 'John Doe'}])
+   }

-  return return <div>{users.map((user) => <User user={user} key={user.id} />)}</div>;
+  return (
+    <div>
+      {users.map((user) => (
+        <User user={user} key={user.id} />
+      ))}
+      <button onClick={handleClick}>Add user</button>
+    </div>
+  );
};
```
