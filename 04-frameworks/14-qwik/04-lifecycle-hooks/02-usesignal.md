# useSignal

We use `useSignal()` to store any single value. 

`useSignal` is heavily optimized when it comes to re-rendering components. It is able to skip re-renderings of parent components even when the signal itself is defined in the parent. `useSignal` works with all [primitive types](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) as well as with not nested / flat objects. 

> If you need to store arrays or complex objects use `useStore` instead.

Some examples would be:

Some examples would be:

```ts
const intStore = useSignal(0);
const stringStore = useSignal('foo');
const booleanStore = useSignal(true);
const objectStore = useSignal({fruit: 'apple', color: 'green'});
 
// DON'T DO THIS!
const arrayStore = useSignal(['banana','oranges']);
const nestedObjectStore = useSignal({
  fruits: {
    banana: 10,
    apple: 5
  },
  vegetables: {
    tomato: 7,
    broccoli: 14
  }
});
```

To read or update the values you can simply access the value property:

```tsx
<>
  <button onClick$={() => intStore.value++}>Click me</button>
  <p>{intStore.value}</p>
</>
```

## Hold DOM Element Reference

It is also able to hold a reference of a DOM element created by the component.

There are two parts to retrieving a DOM element reference:

1. `useSignal()` returns a store object that contains a `value` property which will eventually contain the reference.
2. `ref={_ref_variable_}` is a prop binding that will set the value property of the ref object to the DOM element.

Create `qwik-app/src/routes/examples/hooks/use-signal/index.tsx`

```tsx
import {
  component$,
  useSignal,
  useVisibleTask$,
  useStore,
} from "@builder.io/qwik";

export default component$(() => {
  const store = useStore({
    width: 0,
    height: 0,
  });
  const outputRef = useSignal<Element>();
  useVisibleTask$(() => {
    if (outputRef.value) {
      const rect = outputRef.value.getBoundingClientRect();
      store.width = Math.round(rect.width);
      store.height = Math.round(rect.height);
    }
  });
  return (
    <main>
      <aside style={{ border: "1px solid red", width: "100px" }}>
        Change text value here to stretch the box.
      </aside>
      <p>
        The above red box is {store.height} pixels high and {store.width} pixels
        wide.
      </p>
    </main>
  );
});

```

If we run the code now it's not going to work, because the reference is not assing to `aside`

```diff
-<aside style={{ border: "1px solid red", width: "100px" }}>
+<aside ref={outputRef} style={{ border: "1px solid red", width: "100px" }}>
  Change text value here to stretch the box.
</aside>
```