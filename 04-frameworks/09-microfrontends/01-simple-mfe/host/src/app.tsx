import MFE1 from "mfe1/app";
import helpers from "mfe1/helpers";
import React from "react";

export const App: React.FC = () => {
  const result = helpers.sum(2, 3);
  return (
    <main>
      <h1>Host App</h1>
      <MFE1 />
      <p>
        Sum result mfe1/helpers: <b>{result}</b>
      </p>
    </main>
  );
};
