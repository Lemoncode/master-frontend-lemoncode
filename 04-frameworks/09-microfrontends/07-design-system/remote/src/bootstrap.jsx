import React from "react";
import { createRoot } from "react-dom/client";
import CounterApp from "./CounterApp";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <CounterApp />
  </React.StrictMode>
);
