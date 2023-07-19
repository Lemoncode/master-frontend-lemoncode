# 04 Create Effect

In this example we will go deeper into the `createEffect` and `onCleanup` methods.

We will start from `03-lifecycle`.

# Steps to build it

`npm install` to install previous example packages:

```bash
npm install
```

Effect functions are called immediately after the component is rendered, and then again whenever the component's dependencies change. They are useful for performing side effects but if we want to fetch data we should use [createResource](https://www.solidjs.com/docs/latest/api#createresource) instead.

Let's implement a real use case of `createEffect`:

_./src/index.tsx_

```diff
- import { createSignal, onCleanup, Show } from "solid-js";
+ import { createSignal } from "solid-js";
import { render } from "solid-js/web";

const App = () => {
- const [show, setShow] = createSignal(false);
+ const [filter, setFilter] = createSignal("filter by name");

  return (
    <>
      <input
-       type="checkbox"
-       checked={show()}
+       value={filter()}
-       onInput={(e) => setShow(e.currentTarget.checked)}
+       onInput={(e) => setFilter(e.currentTarget.value)}
      />
-     <span>Show date</span>
-     <Show when={show()}>
-       <CurrentDate />
-     </Show>
+     <p>Filter: {filter()}</p>
    </>
  );
};

- const CurrentDate = () => {
-   const [date, setDate] = createSignal("No date");
-   const timer = setTimeout(
-     () => setDate(new Date().toLocaleTimeString()),
-     4000
-   );
-   onCleanup(() => {
-     console.log("Unmounting");
-     clearTimeout(timer);
-   });

-   return <h1>Date: {date()}</h1>;
- };

render(() => <App />, document.getElementById("root"));

```

Usually, we will use a filter to search for data in a server, so we want to wait until the user stops typing to make the request. 

_./src/index.tsx_

```diff
- import { createSignal } from "solid-js";
+ import { createSignal, createEffect } from "solid-js";
import { render } from "solid-js/web";

const App = () => {
  const [filter, setFilter] = createSignal("filter by name");
+ const [debounced, setDebounced] = createSignal('');

+ createEffect(() => {
+   setTimeout(() => setDebounced(filter()), 500);
+ });

  return (
    <>
      <input
        value={filter()}
        onInput={(e) => setFilter(e.currentTarget.value)}
      />
-     <p>Filter: {filter()}</p>
+     <p>Filter: {debounced()}</p>
    </>
  );
};

render(() => <App />, document.getElementById("root"));

```

> If we use `onChange` instead of `onInput` we will apply the filter after losing the focus of the input.

Why is not working? Because `createEffect` automatically subscribes to any signal that is read `during the function's execution` and reruns when any of them change:

```diff
...
  createEffect(() => {
+   const newFilter = filter();
-   setTimeout(() => setDebounced(filter()), 500);
+   setTimeout(() => setDebounced(newFilter), 500);
  });

...
```

Now the filter value is updated after 500ms but we need to cancel the previous timeout if the user keeps typing:

```diff
- import { createSignal, createEffect } from "solid-js";
+ import { createSignal, createEffect, onCleanup } from "solid-js";
import { render } from "solid-js/web";

...

  createEffect(() => {
    const newFilter = filter();
-   setTimeout(() => setDebounced(newFilter), 500);
+   const timer = setTimeout(() => setDebounced(newFilter), 500);
+   onCleanup(() => clearTimeout(timer));
  });

...
```

> You can use an official [debounce](https://github.com/solidjs-community/solid-primitives/tree/main/packages/scheduled#debounce) implementation.

We can make its dependencies explicit if we use the [on](https://www.solidjs.com/docs/latest/api#on) method:

```diff
- import { createSignal, createEffect, onCleanup } from "solid-js";
+ import { createSignal, createEffect, onCleanup, on } from "solid-js";
import { render } from "solid-js/web";

const App = () => {
  const [filter, setFilter] = createSignal("filter by name");
  const [debounced, setDebounced] = createSignal("");

- createEffect(() => {
-   const newFilter = filter();
+ createEffect(
+   on(filter, (newFilter) => {
      const timer = setTimeout(() => setDebounced(newFilter), 500);
      onCleanup(() => clearTimeout(timer));
- });
+   })
+ );

...

```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
