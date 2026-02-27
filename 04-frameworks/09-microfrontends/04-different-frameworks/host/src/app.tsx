import MFE1 from "mfe1/app";
import React from "react";
import { createCustomElement } from "./vue-wrapper";

createCustomElement("mfe1-app", MFE1);

export const App: React.FC = () => {
  const [value, setValue] = React.useState("John Doe");
  return (
    <main>
      <h1>Host App</h1>
      <mfe1-app>
        <input
          slot="user-name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </mfe1-app>
    </main>
  );
};
