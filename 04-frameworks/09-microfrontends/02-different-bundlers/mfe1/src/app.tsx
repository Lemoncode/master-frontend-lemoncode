import React from "react";

export const App: React.FC = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <h2>Microfrontend 1</h2>
      <p>This mfe is using Rsbuild and React {React.version}</p>
      <button onClick={() => setCount(count + 1)}>Count is {count}</button>
    </div>
  );
};
