import React from "react";

export const MyChildComponent = () => {
  React.useEffect(() => {
    console.log("El componente se acaba de montar en el DOM");

    return () => console.log("El componente se acaba de desmontar del DOM");
  }, []);

  return <h4>Hello form child component</h4>;
};

export const MyComponent = () => {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      {visible && <MyChildComponent />}
      <button onClick={() => setVisible(!visible)}>
        Toggle Child component visibility
      </button>
    </>
  );
};
