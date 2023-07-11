# 03 Lifecycle

In this example we are going to use the lifecycle methods like `onMount` and `onCleanup`.

We will start from `02-props`.

# Steps to build it

`npm install` to install previous example packages:

```bash
npm install
```

There are only a few lifecycle methods in SolidJS, let's start with `onMount`:

_./src/index.tsx_

```diff
- import { createSignal, Component } from "solid-js";
+ import { createSignal, onMount } from "solid-js";
import { render } from "solid-js/web";

const App = () => {
  const [value, setValue] = createSignal("John");
+ let inputRef: HTMLInputElement;

+ onMount(() => {
+   inputRef.focus();
+ });

  return (
    <>
      <input
+       ref={inputRef}
        value={value()}
        onInput={(e) => setValue(e.currentTarget.value)}
      />
-     <Display value={value()} />
    </>
  );
};

- interface Props {
-   value: string;
- }

- const Display: Component<Props> = (props) => {
-   return <h2>{props.value}</h2>;
- };

render(() => <App />, document.getElementById("root"));
  
```


`onMount` is just a `createEffect` call that is non-tracking, which means it will be run after rendering has completed and then it never re-runs:

_./src/index.tsx_

```diff
- import { createSignal, onMount } from "solid-js";
+ import { createSignal, createEffect } from "solid-js";
import { render } from "solid-js/web";

const App = () => {
  const [value, setValue] = createSignal("John");
  let inputRef: HTMLInputElement;

- onMount(() => {
+ createEffect(() => {
    inputRef.focus();
  });
...

```

> If you want to run an effect before rendering (like modify the DOM), you can use [createRenderEffect](https://www.solidjs.com/docs/latest/api#createrendereffect)

The `createEffect` function will be executed every time a signal changes:

_./src/index.tsx_

```diff
...

  createEffect(() => {
    inputRef.focus();
  });

+ createEffect(() => {
+   console.log(value());
+ });

...

```

Sometimes we need to do something when the component is unmounted, for example, unsubscribe from an event listener, cleanup timers, etc, we can use `onCleanup`:

_./src/index.tsx_

```diff
- import { createSignal, createEffect } from "solid-js";
+ import { createSignal, onCleanup } from "solid-js";
import { render } from "solid-js/web";

const App = () => {
- const [value, setValue] = createSignal("John");
- let inputRef: HTMLInputElement;
+ const [show, setShow] = createSignal(false);

- createEffect(() => {
-   inputRef.focus();
- });

- createEffect(() => {
-   console.log(value());
- });

  return (
    <>
      <input
-       ref={inputRef}
+       type="checkbox"
-       value={value()}
+       checked={show()}
-       onInput={(e) => setValue(e.currentTarget.value)}
+       onInput={(e) => setShow(e.currentTarget.checked)}
      />
+     <span>Show date</span>
+     {show() && <CurrentDate />}
    </>
  );
};

+ const CurrentDate = () => {
+   const [date, setDate] = createSignal("No date");
+   const timer = setTimeout(
+     () => setDate(new Date().toLocaleTimeString()),
+     4000
+   );
+   onCleanup(() => {
+     console.log("Unmounting");
+     clearTimeout(timer);
+   });

+   return <h1>Date: {date()}</h1>;
+ };

...

```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
