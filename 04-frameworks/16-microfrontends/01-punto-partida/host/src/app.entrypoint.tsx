import React from "react";
import ReactDOM from "react-dom/client";

import { Dashboard } from "./pods";
import "./app.styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root?.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);
