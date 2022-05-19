import React from "react";
import { createRoot } from "react-dom/client";
import { AverageComponent } from "./averageComponent";
import { TotalScoreComponent } from "./totalScoreComponent";

const root = createRoot(document.getElementById("root"));
root.render(
  <div>
    <h1>Hello from React DOM</h1>
    <AverageComponent />
    <TotalScoreComponent />
  </div>
);
