import React from "react";
import { getMF } from "../mf/client";

const mf = await getMF();

const CounterComponent = React.lazy(() =>
  mf.loadRemote("react_remote/CounterApp").then((module) => ({
    default: (module as { default: React.ComponentType }).default,
  }))
);

export const RemoteCounterComponent: React.FC = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <CounterComponent />
    </React.Suspense>
  );
};
