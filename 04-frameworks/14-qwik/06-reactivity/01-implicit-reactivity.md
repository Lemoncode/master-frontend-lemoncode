# Implicit Reactivity

On Qwik by default, mutating stores automatically update its subscribers.

Create `qwik-app/src/components/display-a.component.tsx`

```tsx
import { component$ } from "@builder.io/qwik";

export const DisplayA = component$<{ store: { countA: number } }>((props) => {
  console.log("Render: <DisplayA>");
  return <>{props.store.countA}</>;
});

```

Create `qwik-app/src/components/display-b.component.tsx`

```tsx
import { component$ } from "@builder.io/qwik";

export const DisplayB = component$<{ store: { countB: number } }>((props) => {
  console.log("Render: <DisplayB>");
  return <>{props.store.countB}</>;
});

```

Create `qwik-app/src/routes/examples/reactivity/implicit/index.tsx`

```tsx
import { component$, useStore } from "@builder.io/qwik";
import { DisplayA } from "~/components/display-a.component";
import { DisplayB } from "~/components/display-b.component";

interface AppStore {
  countA: number;
  countB: number;
}

export default component$(() => {
  const store = useStore<AppStore>({
    countA: 0,
    countB: 0,
  });
  console.log("Render: <App>");
  return (
    <>
      <button onClick$={() => null}>a++</button>
      <DisplayA store={store} />
      <hr />
      <button onClick$={() => null}>b++</button>
      <DisplayB store={store} />
    </>
  );
});

```

During SSR rendering the server needs to render all of the components in the application. 

```bash
npm run dev
```

```
....
Render: <App>
Render: <DisplayA>
Render: <DisplayB>
```

As it is rendering the bindings in those components perform reads on store properties. 

For example, when the text node in the `<DisplayA>` reads the `countA` property from the store, **Qwik records that as a subscription**. Qwik now knows that if `countA` changes then the text node in the `<DisplayA>` needs to be re-render. 

Executing the signal operations will automatically set up subscriptions on the store. 

Each time the signal operations executed the old subscriptions are thrown away and new subscriptions are created. This means that the **text node can change the set of things it is listening to during its lifecycle.**

Currently, the buttons don't do anything. Implement the buttons to increment the respective store properties.

Update 

```diff
export default component$(() => {
  const store = useStore<AppStore>({
    countA: 0,
    countB: 0,
  });
  console.log("Render: <App>");
  return (
    <>
-     <button onClick$={() => null}>a++</button>
+     <button onClick$={() => store.countA++}>a++</button>
      <DisplayA store={store} />
      <hr />
-     <button onClick$={() => null}>b++</button>
+     <button onClick$={() => store.countB++}>b++</button>
      <DisplayB store={store} />
    </>
  );
});
```

```bash
npm run dev
```

> Open Developer Tools and select Elements tab

Once you make the buttons work, notice that even though all state is stored in a single store, the updates are very focused. `a++` button will only cause the re-rendering of the text node inside `<DisplayA>` and `b++` button will only cause re-rendering of the text node inside `<DisplayB>`. The fine-grained re-rendering is an important property of Qwik. It is what allows Qwik applications to stay lean and not download too much code unnecessarily.

Subscriptions are automatically created and released when the component is removed. There is no need to keep track of them or release them manually.

Qwik is a reactive system. All reactive systems require a single full execution of the application to create subscriptions. Qwik applications also require full execution to set up all subscriptions. 

However, **Qwik applications perform the full execution on the server and transfer the subscription information to the client**. 

In this way, the client knows which component or part of component needs to be re-rendered when without being forced to do one full rendering of the whole application. Doing so would force all components to be eagerly downloaded, and Qwik wants to avoid that.