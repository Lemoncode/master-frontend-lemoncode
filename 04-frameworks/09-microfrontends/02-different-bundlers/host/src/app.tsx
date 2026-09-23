import MFE1 from "mfe1/app";
import helpers from "mfe1/helpers";
import MFE2 from "mfe2/app";
import React from "react";

export const App: React.FC = () => {
  const result = helpers.sum(2, 3);
  const [count, setCount] = React.useState(0);
  return (
    <main>
      <h1>Host App</h1>
      <MFE1 />
      <p>
        Sum result mfe1/helpers: <b>{result}</b>
      </p>
      <MFE2
        count={count}
        setCount={setCount}
        style={{ backgroundColor: "lightgreen" }}
      />
    </main>
  );
};
