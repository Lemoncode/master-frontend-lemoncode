# 01 Reactivity

In this example we are going to learn how reactivity works in SoliJS.

We will start from `00-boilerplate`.

# Steps to build it

`npm install` to install previous example packages:

```bash
npm install
```

SolidJS is built on top of [Solid primitives](https://www.solidjs.com/docs/latest/api#basic-reactivity) (createSignal, createEffect, createMemo, etc) which are the building blocks that will be responsible for governing reactivity within your Solid app.

Solid primitives can be used in any scope, they are not required to be used within a component:

_./src/index.tsx_

```diff
+ import { createSignal, createEffect } from "solid-js";
import { render } from "solid-js/web";

const App = () => {
  return <h1>Hello from SolidJS</h1>;
};

render(() => <App />, document.getElementById("root"));

+ const [count, setCount] = createSignal(0);
+ const myButton = document.createElement("button");
+ myButton.onclick = () => setCount(count() + 1);
+ console.log("This just run once");

+ createEffect(() => {
+   myButton.textContent = `Clicked ${count()} times`;
+ });

+ const root = document.getElementById("root");
+ root.appendChild(myButton);
```

> Signals implements the observer pattern, they are a pair of functions that allow you to read and write to a value. When the write function is called, the read function will be re-evaluated and any dependencies will be updated.

If we want a more ergonomic way of writing components, we can use the `JSX` syntax like React but first let's move it inside the App component:

_./src/index.tsx_

```diff
import { createSignal, createEffect } from "solid-js";
import { render } from "solid-js/web";

const App = () => {
+ const [count, setCount] = createSignal(0);
+ const myButton = document.createElement("button");
+ myButton.onclick = () => setCount(count() + 1);
+ console.log("This just run once");

+ createEffect(() => {
+   myButton.textContent = `Clicked ${count()} times`;
+ });

- return <h1>Hello from SolidJS</h1>;
+ return (
+   <>
+     <h1>Hello from SolidJS</h1>
+     {myButton}
+   </>
+ );
};

render(() => <App />, document.getElementById("root"));

- const [count, setCount] = createSignal(0);
- const myButton = document.createElement("button");
- myButton.onclick = () => setCount(count() + 1);
- console.log("This just run once");

- createEffect(() => {
-   myButton.textContent = `Clicked ${count()} times`;
- });

- const root = document.getElementById("root");
- root.appendChild(myButton);

```

> The `JSX` syntax is not required to use Solid, but it is the recommended way to write components.

Now let's transform the button into a component:

_./src/index.tsx_

```diff
- import { createSignal, createEffect } from "solid-js";
+ import { createSignal } from "solid-js";
import { render } from "solid-js/web";

const App = () => {
  const [count, setCount] = createSignal(0);
- const myButton = document.createElement("button");
- myButton.onclick = () => setCount(count() + 1);
  console.log("This just run once");

- createEffect(() => {
-   myButton.textContent = `Clicked ${count()} times`;
- });

  return (
    <>
      <h1>Hello from SolidJS</h1>
-     {myButton}
+     <button onClick={() => setCount(count() + 1)}>
+       Clicked {count()} times
+     </button>
    </>
  );
};

render(() => <App />, document.getElementById("root"));
```

> Notice that we are not using `createEffect` anymore because the JSX syntax is already doing it for us.

As we saw `createSignal` doesn't need to be used within a component. It can be used anywhere in your app and shared values :

_./src/index.tsx_

```diff
import { createSignal } from "solid-js";
import { render } from "solid-js/web";

+ const [count, setCount] = createSignal(0);

+ const Button = () => {
+   return (
+     <button onClick={() => setCount(count() + 1)}>
+       Clicked {count()} times
+     </button>
+   );
+ };

const App = () => {
- const [count, setCount] = createSignal(0);
  console.log("This just run once");

  return (
    <>
      <h1>Hello from SolidJS</h1>
-     <button onClick={() => setCount(count() + 1)}>
-       Clicked {count()} times
-     </button>
+     <Button />
+     <Button />
    </>
  );
};

render(() => <App />, document.getElementById("root"));

```

This is a powerful feature that allows you to isolate functionality and share it across your app, like a "custom hook" in React (but without the need rules of hooks):

_./src/index.tsx_

```diff
- import { createSignal } from "solid-js";
+ import { createSignal, createEffect } from "solid-js";
import { render } from "solid-js/web";

- const [count, setCount] = createSignal(0);
+ const createCount = () => {
+   const [count, setCount] = createSignal(0);

+   return {
+     count,
+     setCount,
+   };
+ };

+ const { count, setCount } = createCount();

+ createEffect(() => {
+   console.log(`This is the count: ${count()}`);
+ });

const Button = () => {
...

```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
