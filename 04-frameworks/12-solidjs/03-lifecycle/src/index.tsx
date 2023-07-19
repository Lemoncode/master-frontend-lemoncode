import { createSignal, onCleanup, Show } from "solid-js";
import { render } from "solid-js/web";

const App = () => {
  const [show, setShow] = createSignal(false);

  return (
    <>
      <input
        type="checkbox"
        checked={show()}
        onInput={(e) => setShow(e.currentTarget.checked)}
      />
      <span>Show date</span>
      <Show when={show()}>
        <CurrentDate />
      </Show>
    </>
  );
};

const CurrentDate = () => {
  const [date, setDate] = createSignal("No date");
  const timer = setTimeout(
    () => setDate(new Date().toLocaleTimeString()),
    4000
  );
  onCleanup(() => {
    console.log("Unmounting");
    clearTimeout(timer);
  });

  return <h1>Date: {date()}</h1>;
};

render(() => <App />, document.getElementById("root"));
