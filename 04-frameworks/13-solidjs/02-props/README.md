# 02 Props

In this example we are going to learn how feed props in SoliJS.

We will start from `01-reactivity`.

# Steps to build it

`npm install` to install previous example packages:

```bash
npm install
```

SolidJS (like React) uses the unidirectional data flow pattern, which means that data flows from parent to child components. This is done by passing props to child components.

Let's create a new component:

_./src/index.tsx_

```diff
- import { createSignal, createEffect } from "solid-js";
+ import { createSignal } from "solid-js";
import { render } from "solid-js/web";

- const createCount = () => {
-   const [count, setCount] = createSignal(0);
- 
-   return {
-     count,
-     setCount,
-   };
- };

- const { count, setCount } = createCount();

- createEffect(() => {
-   console.log(`This is the count: ${count()}`);
- });

- const Button = () => {
-   return (
-     <button onClick={() => setCount(count() + 1)}>
-       Clicked {count()} times
-     </button>
-   );
- };

const App = () => {
- console.log("This just run once");
+ const [value, setValue] = createSignal("");

  return (
    <>
-     <h1>Hello from SolidJS</h1>
-     <Button />
-     <Button />
+     <input value={value()} onInput={(e) => setValue(e.currentTarget.value)} />
    </>
  );
};

render(() => <App />, document.getElementById("root"));

```

> [change event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event)
>
> [input event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)

Here we have an example of event target bubbling:

```jsx
<div
  style={{ "background-color": "red" }}
  onClick={(e) => console.log({ e: e.target })}
>
  <button>Click me</button>
</div>

```

> Replace `e.target` by `e.currentTarget` to see the difference.

Let's create a child component to display the value:

_./src/index.tsx_

```diff
- import { createSignal } from "solid-js";
+ import { createSignal, Component } from "solid-js";
import { render } from "solid-js/web";

const App = () => {
  const [value, setValue] = createSignal("");

  return (
    <>
      <input value={value()} onInput={(e) => setValue(e.currentTarget.value)} />
+     <Display value={value()} />
    </>
  );
};

+ interface Props {
+   value: string;
+ }

+ const Display: Component<Props> = (props) => {
+   const { value } = props;
+   return <h2>{value}</h2>;
+ };

render(() => <App />, document.getElementById("root"));

```

Why is not working? Remember that SolidJS uses reactivity to update the values, when we use `destructuring` we are creating a new variable, so we are storing the value like:

```diff
...

const App = () => {
- const [value, setValue] = createSignal("");
+ const [value, setValue] = createSignal("John");

...

const Display: Component<Props> = (props) => {
- const { value } = props;
+ const value = props.value;
  return <h2>{value}</h2>;
};

...

```

> We are storing the first render value.
>
> We can use `destructuring` without losing reactivity if we use it inside reactive scopes like `createEffect` or `createMemo`.

It's important to use the `props` object to get the value:

_./src/index.tsx_

```diff
...

const Display: Component<Props> = (props) => {
- const value = props.value;
- return <h2>{value}</h2>;
+ return <h2>{props.value}</h2>;
};
...

```

> It's preferable to feed raw values to child components instead of accessor functions to keep the code more homogeneous and avoid `isSignal checks everywhere`.
>
> [More info about passing signals as props](https://github.com/solidjs/solid/discussions/749#discussioncomment-1740120)

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
