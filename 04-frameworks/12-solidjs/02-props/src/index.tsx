import { createSignal, createEffect } from "solid-js";
import { render } from "solid-js/web";

const useCount = () => {
  const [count, setCount] = createSignal(0);

  return {
    count,
    setCount,
  };
};

const { count, setCount } = useCount();

createEffect(() => {
  console.log(`This is the count: ${count()}`);
});

const Button = () => {
  return (
    <button onClick={() => setCount(count() + 1)}>
      Clicked {count()} times
    </button>
  );
};

const App = () => {
  console.log("This just run once");

  return (
    <>
      <h1>Hello from SolidJS</h1>
      <Button />
      <Button />
    </>
  );
};

render(() => <App />, document.getElementById("root"));
