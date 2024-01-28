# Stores

Applications need to store state to be useful, otherwise they're just static pages.

Qwik tracks application state for two reasons:

1. To serialize data when the application pauses on the server, and deserialize as the application resumes on the client.

2. To create subscriptions on stores so that Qwik knows which components to re-render. If Qwik didn't track subscriptions, it would have to re-render the whole application - which would defeat the purpose of lazy-loading.

Create `qwik-app/src/routes/examples/stores/index.tsx`

```tsx
import { component$ } from "@builder.io/qwik";

export default component$(() => {
  const counter = { count: 0 };

  return (
    <>
      <p>Count: {counter.count}</p>
      <button onClick$={() => counter.count++}>+1</button>
    </>
  );
});

```

```bash
npm run dev
```

> Visit http://localhost:5173/examples/stores/

This component doesn't work yet because **counter is just a plain object with no subscriptions**. As a result, **Qwik doesn't know when counter.count changes, and therefore doesn't know to re-render** the component.

Lets fix this. We will wrap counter in [useStore()](https://qwik.builder.io/docs/components/state/#usestore) to enable dependency tracking and automatic re-rendering.

Update `qwik-app/src/routes/examples/stores/index.tsx`

```diff
-import { component$ } from "@builder.io/qwik";
+import { component$, useStore } from "@builder.io/qwik";

export default component$(() => {
- const counter = { count: 0 };
+ const counter = useStore({ count: 0 });

  return (
    <>
      <p>Count: {counter.count}</p>
      <button onClick$={() => counter.count++}>+1</button>
    </>
  );
});
```

## Serialization

Open the HTML tab to see what information is serialized by the server. Look in the `<script type="qwik/json">` block for serialization information and notice that:

1. {count: 0} is in the serialized state.
2. At the end of the serialized state are subs which contain "count". These subscriptions tell Qwik which component to re-render as the state changes.

```html
<script type="qwik/json">{
  "refs": {
    "8": "0!"
  },
  "ctx": {},
  "objs": [
    {
      "count": "3"
    },
    "\u00110! @0",
    "#7",
    0
  ],
  "subs": [
    [
      "_1",
      "3 #7 1 #7 count"
    ]
  ]
}</script>
```

Qwik state is in no way tied to the component that created it. The state can be passed to any component in the application and Qwik creates the needed subscriptions and re-renders only the affected components.

## Recursive Store

`useStore()` tracks deep reactivity by default, Arrays and Objects inside the store will also be reactive.

For [useStore()](https://qwik.builder.io/docs/components/state/#usestore) to track all nested properties, it needs to allocate a lot of [Proxy](https://qwik.builder.io/docs/concepts/reactivity/#proxy) objects. This can be a performance issue if you have a lot of nested properties.

In that case, you can pass the additional argument: `{deep: false}` to `useStore` to only track the top-level properties.

Create `qwik-app/src/components/display.component.tsx`

```tsx
import { component$ } from "@builder.io/qwik";

interface DisplayProps {
  counter: { count: number };
  list: number[];
}

export const Display = component$((props: DisplayProps) => {
  return (
    <p>
      Count: {props.counter.count}, List length: {props.list.length}
    </p>
  );
});
```

Update `qwik-app/src/routes/examples/stores/index.tsx`

```diff
import { component$, useStore } from "@builder.io/qwik";
+import { Display } from "~/components/display.component";

export default component$(() => {
- const counter = useStore({ count: 0 });
+ const store = useStore({ counter: { count: 0 }, list: [0]  });

  return (
    <>
+     <Display counter={store.counter} list={store.list} />
+     <button onClick$={() => store.counter.count++}>+1 Count</button>
+     <button onClick$={() => store.list.push(0)}>+1 List element</button>
-     <p>Count: {counter.count}</p>
-     <button onClick$={() => counter.count++}>+1</button>
    </>
  );
});

```

Lets update it to avoid deep tracking.

Update `qwik-app/src/routes/examples/stores/index.tsx`

```diff
export default component$(() => {
- const store = useStore({ counter: { count: 0 }, list: [0]  });
+ const store = useStore({ counter: { count: 0 }, list: [0] }, { deep: false });

  return (
```

Hummm. Our code doesn't work any more. Recall that now Qwik only tracks object first level entries. We can get the desired behavior by reassigning references:

```tsx
import { component$, useStore } from "@builder.io/qwik";
import { Display } from "~/components/display.component";

export default component$(() => {
  const store = useStore({ counter: { count: 0 }, list: [0] }, { deep: false });

  return (
    <>
      <Display counter={store.counter} list={store.list} />
      <button
        /*diff*/
        onClick$={() => {
          store.counter = {
            count: store.counter.count + 1,
          };
        }}
        /*diff*/
      >
        +1 Count
      </button>
      <button
        /*diff*/
        onClick$={() => {
          store.list = [...store.list, 0];
        }}
        /*diff*/
      >
        +1 List element
      </button>
    </>
  );
});

```

## Seralization Graph

Stores are serializable as the application is paused on the server and resumed on the client.

Data in a store isn't required to be free of nested references. Qwik is perfectly happy serializing stores that feature data [cycles](https://en.wikipedia.org/wiki/Directed_acyclic_graph).

Stores can also include [Qwik URLs (QRLs)](https://qwik.builder.io/docs/advanced/qrl/).

There is no limit to how many stores can be created per component, nor to where they are passed. While the best practice is to implement top-down data flows, Qwik doesn't require this design philosophy.

Update `qwik-app/src/routes/examples/stores/index.tsx`

```tsx
import { QRL, component$, useStore, $ } from "@builder.io/qwik";

interface CounterStore {
  identifier: string;
  count: number;
  children: ListStore[];
  increment: QRL<(parent: CounterStore) => void>;
}

interface ListStore {
  identifier: string;
  parent: CounterStore;
}

export default component$(() => {
  const parent: CounterStore = {
    identifier: "00001",
    children: [],
    count: 0,
    increment: $((parent) => {
      parent.count++;
    }),
  };
  parent.children = [];
  const parentStore = useStore<CounterStore>(parent, { deep: true });
  return (
    <>
      {parentStore.identifier}
      <button onClick$={() => parentStore.increment(parentStore)}>
        Increment
      </button>
      <p>Children count: {parentStore.count}</p>
      <ul>
        {parentStore.children.map((child) => (
          <li key={child.identifier}>
            {child.identifier} -&lt; {child.parent.identifier}
          </li>
        ))}
      </ul>
    </>
  );
});

```

Lets update the code to insert a new chidren each time we increment the coun.

```diff
<button
  onClick$={() => {
    parentStore.increment(parentStore);
+   parentStore.children.push({
+   identifier: parentStore.count.toString(),
+   parent,
    });
  }}
 >
 Increment
</button>
```

If we have a look to serialized store:

```html
<script type="qwik/json">{
  "refs": {
    "8": "1 1!"
  },
  "ctx": {
    "6": {
      "h": "9",
      "s": "1!"
    }
  },
  "objs": [
    [],
    {
      "identifier": "2",
      "children": "0",
      "count": "3",
      "increment": "4"
    },
    "00001",
    0,
    "\u0002/src/stores_component_parent_eyhclga6ht8.js#stores_component_parent_EyhclGA6Ht8",
    "\u00111! @0",
    "#7",
    "\u00111! @1",
    "#9",
    "\u0002/src/stores_component_r0khrzyvpuu.js#stores_component_r0kHRZyVpUU"
  ],
  "subs": [
    [
      "_1",
      "0 #6"
    ],
    [
      "_1",
      "0 #6 children",
      "3 #7 5 #7 identifier",
      "3 #9 7 #9 count"
    ]
  ]
}</script>
```

