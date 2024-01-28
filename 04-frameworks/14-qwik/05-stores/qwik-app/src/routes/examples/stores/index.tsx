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
      <button
        onClick$={() => {
          parentStore.increment(parentStore);
          parentStore.children.push({
            identifier: parentStore.count.toString(),
            parent,
          });
        }}
      >
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
