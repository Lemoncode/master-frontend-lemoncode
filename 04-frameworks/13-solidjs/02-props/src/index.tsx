import { createSignal, Component } from "solid-js";
import { render } from "solid-js/web";

const App = () => {
  const [value, setValue] = createSignal("John");

  return (
    <>
      <input value={value()} onInput={(e) => setValue(e.currentTarget.value)} />
      <Display value={value()} />
    </>
  );
};

interface Props {
  value: string;
}

const Display: Component<Props> = (props) => {
  return <h2>{props.value}</h2>;
};

render(() => <App />, document.getElementById("root"));
