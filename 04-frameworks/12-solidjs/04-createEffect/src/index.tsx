import { createSignal, createEffect, onCleanup, on } from "solid-js";
import { render } from "solid-js/web";

const App = () => {
  const [filter, setFilter] = createSignal("filter by name");
  const [debounced, setDebounced] = createSignal("");

  createEffect(
    on(filter, (newFilter) => {
      const timer = setTimeout(() => setDebounced(newFilter), 500);
      onCleanup(() => clearTimeout(timer));
    })
  );

  return (
    <>
      <input
        value={filter()}
        onInput={(e) => setFilter(e.currentTarget.value)}
      />
      <p>Filter: {debounced()}</p>
    </>
  );
};

render(() => <App />, document.getElementById("root"));
