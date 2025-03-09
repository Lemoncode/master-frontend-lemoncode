import React from "react";
import ReactDOM from "react-dom/client";

import { Keypad } from "./pods/keypad.component";
import "./app.styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root?.render(
  <React.StrictMode>
    <Keypad
      dispatchEvent={(name, detail) => {
        console.log({ name, detail });
      }}
    />
  </React.StrictMode>
);
