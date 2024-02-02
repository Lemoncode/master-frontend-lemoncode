# `useVisibleTask$()`

We use `useVisibleTask$()`to execute code **after the component is resumed**. We can use it for setting up timers or streams on the client, when the application is resumed.

## track() and useVisibleTask$()

`useVisibleTask$()` receives a `track()` function just like `useTask$()`. Use the `track()` function to trigger the effect when the store is updated. We will talk more about this, when we get into reactivity subject.

## Component Life Cycle and SSR

Qwik is resumable. Resumability means that the application starts on the server and then is transferred to the client. On the client, the application continues execution from where it left off. A common use case is creating a component on the server, pausing, and then resuming on the client. To make the component fully functional, it may be necessary to execute code eagerly on the client to set up timers or streams.

> `useVisibleTask$()` is a client-only method. (There is no equivalent on the server.)

## When is useVisibleTask$() executed?

Client effect code is executed after the component is resumed. The `useVisibleTask$()` method takes an additional argument (`{strategy:'intersection-observer|document-ready|document-idle'}`) that controls when the effect is executed. There are three options:

- `intersection-observer` (default): the task will first execute when the element is visible in the viewport, under the hood it uses the [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).
- `document-ready`: the task will first execute when the document is ready, under the hood it uses the document load event.
- `document-idle`: the task will first execute when the document is idle, under the hood it uses the [requestIdleCallback API](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback).

## `useVisibleTask$()` in action

Create `qwik-app/src/components/clock/clock.css`

```css
.clock {
  height: 300px;
  width: 300px;
  color: #17d4fe;
  font-size: 60px;
  letter-spacing: 7px;
  margin: 0 auto;
}
```

Create `qwik-app/src/components/clock/clock.component.tsx`

```tsx
import {
  component$,
  useStore,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import styles from "./clock.css?inline";

interface ClockStore {
  hour: number;
  minute: number;
  second: number;
}

function updateClock(store: ClockStore) {
  const now = new Date();
  store.second = now.getSeconds();
  store.minute = now.getMinutes();
  store.hour = now.getHours();
}

function formatTime(value: number): string {
  return value < 10 ? `0${value}` : value.toString();
}

export const Clock = component$(() => {
  useStyles$(styles);
  const store = useStore<ClockStore>({
    hour: 0,
    minute: 0,
    second: 0,
  });
  useVisibleTask$(({ cleanup }) => {
    const id = setInterval(() => {
      updateClock(store);
    }, 1000);

    cleanup(() => clearInterval(id));
  });
  return (
    <div class="clock">
      {`${formatTime(store.hour)}:${formatTime(store.minute)}:${formatTime(
        store.second
      )}`}
    </div>
  );
});
```

Create `qwik-app/src/components/clock/index.ts`

```tsx
export * from "./clock.component";
```

Create `qwik-app/src/routes/examples/hooks/use-visible-task/index.tsx`

```tsx
import { component$ } from "@builder.io/qwik";
import { Clock } from "~/components/clock";

export default component$(() => {
  return (
    <main style={{ backgroundColor: "black", color: "white" }}>
      <p>
        This is an example of Lazy executing code on component when component
        becomes visible.
      </p>

      <p style={{ height: "800px" }}>
        ⬇️ <strong>Scroll down</strong> until the clock is in view.
      </p>

      <Clock />
    </main>
  );
});
```

```bash
npm run dev
```

> Visit `http://localhost:5173/examples/hooks/use-visible-task/`

Notice that the clock is not currently visible. Open developer tools, `network` tab with `All` option selected.

When we scroll down and the clock appears, the component bundle is downloaded, and the task will first execute.
