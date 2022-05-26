import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RequestGet } from "./apiTest";
import { AverageComponent } from "./averageComponent";
import { TotalScoreComponent } from "./totalScoreComponent";

const root = createRoot(document.getElementById("root"));
root.render(
  <div>
    <h1>Hello from React DOM</h1>
    <AverageComponent />
    <TotalScoreComponent />
    <Suspense fallback={<h1>Loading ...</h1>}>
      <RequestGet />
    </Suspense>
  </div>
);
