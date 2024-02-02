# Explicit Reactivity

## `useTask$()`

In addition to implicit reactivity created by the templates, Qwik supports explicit execution of code when a property changes. This is achieved through the [useTask$()](https://qwik.builder.io/docs/components/tasks/#usetask) hook.

[useTask$()](https://qwik.builder.io/docs/components/tasks/#usetask) hooks execute before the component renders and can be asynchronous.

The hook can also have a clean-up function that is invoked on the next hook execution or when the component is removed.

Create `qwik-app/src/components/display-count.component.tsx`

```tsx
import { component$ } from "@builder.io/qwik";

export const DisplayCount = component$<{ store: { count: number } }>(
  (props) => {
    console.log("Render: <DisplayCount>");
    return <>{props.store.count}</>;
  }
);
```

Create `qwik-app/src/components/display-delay-count.component.tsx`

```tsx
import { component$ } from "@builder.io/qwik";

export const DisplayDelayCount = component$<{ store: { delayCount: number } }>(
  (props) => {
    console.log("Render: <DisplayDelayCount>");
    return <>{props.store.delayCount}</>;
  }
);
```

Create `qwik-app/src/routes/examples/reactivity/explicit/index.tsx`

```tsx
import { component$, useStore, useTask$ } from "@builder.io/qwik";
import { DisplayCount } from "~/components/display-count.component";
import { DisplayDelayCount } from "~/components/display-delay-count.component";

interface AppStore {
  count: number;
  delayCount: number;
}

export default component$(() => {
  const store = useStore<AppStore>({
    count: 0,
    delayCount: 0,
  });
  console.log("Render: <App>");
  useTask$(({ track, cleanup }) => {
    cleanup(() => {});
  });
  return (
    <>
      <DisplayCount store={store} />
      <DisplayDelayCount store={store} />
      <button onClick$={() => store.count++}>b++</button>
    </>
  );
});
```

What we would like is to update the **delay count after a 2-second delay**. If count is updated before the 2 seconds are up, then the timer is restarted.

`useTask$()` callback receives a `track` function. We can use the `track` function to tell Qwik which properties should trigger the task's watcher. The `track` function **creates subscriptions in the store**. 

On each invocation of `useTask$()` the subscriptions are cleared, so it is important to always set up a new set of subscriptions. This is useful if the set of subscriptions changes during the function's lifetime.

The `useTask$()` callback function can return a cleanup function. The clean-up function is invoked on the next `useTask$()` callback execution or when the component is removed. In our case, the cleanup function is used for returning code which clears the `setTimeout`.

The `useTask$()` callbacks execute before the component is rendered. This allows them to be used to compute values used in rendering. The **function runs on both server and client**. The server execution sets up subscriptions that are then serialized and available to the client. This saves the client from having to download all of the components and execute them at least once to recover the subscription information for the system.

```
                      (state change) -> (re-execute)
                                  ^            |
                                  |            v
 useTask$(track) -> RENDER ->  CLICK  -> useTask$(track)
                        |
  | ----- SERVER ------ | ----------- BROWSER ----------- |
                        |
                   pause|resume
```


Update `qwik-app/src/routes/examples/reactivity/explicit/index.tsx`

```ts
useTask$(({ track, cleanup }) => {
  track(() => store.count);
  const id = setTimeout(() => {
    store.delayCount = store.count;
  }, 2000);
  cleanup(() => {
    clearTimeout(id);
  });
});
```