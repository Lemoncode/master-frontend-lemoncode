import React from "react";
import ReactDOM from "react-dom/client";

import { Terminal } from "./pods";
import "./app.styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root?.render(
  <React.StrictMode>
    <Terminal value="123456" />
  </React.StrictMode>
);
