import React from "react";

export const MyChildComponent = () => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    console.log("Componente se monta");
    return () => console.log("Componente se desmonta");
  }, []);

  React.useEffect(() => {
    console.log("body - count just changed", count);
    return () =>
      console.log("cleanupFunction - count is about to change", count);
  }, [count]);

  return (
    <>
      <h4>Count is {count}</h4>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        add 1
      </button>
    </>
  );
};

export const MyComponent = () => {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <button onClick={() => setVisible(!visible)}>
        Toggle Child component visibility
      </button>
      {visible && <MyChildComponent />}
    </>
  );
};
