import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { RequestGet } from "./apiTest";
import { AverageComponent } from "./averageComponent";
import { TotalScoreComponent } from './totalScoreComponent';

ReactDOM.render(
  <div>
    <h1>Hello from React DOM</h1>
    <AverageComponent />
    <TotalScoreComponent />
    <Suspense fallback={<h1>Loading ...</h1>}>
      <RequestGet />
    </Suspense>
  </div>,
  document.getElementById("root")
);
