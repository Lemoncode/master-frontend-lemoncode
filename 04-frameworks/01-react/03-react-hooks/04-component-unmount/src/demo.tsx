import React from "react";

export const MyComponent = () => {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <div>My Parent component</div>
      <button onClick={() => setVisible(!visible)}>
        Toggle Child component visibility
      </button>
      {visible && <MyChildComponent />}
    </>
  );
};

export const MyChildComponent = () => {
  React.useEffect(() => {
    console.log("Component just mounted on the DOM");
    return () => console.log("Componente just unmounted from DOM");
  }, []);

  return (
    <>
      <h4>Hello form child component</h4>
    </>
  );
};
