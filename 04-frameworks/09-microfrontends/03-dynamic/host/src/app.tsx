import { createInstance } from "@module-federation/enhanced/runtime";
import React from "react";

const microfrontends = await fetch("/api/microfrontends").then((res) =>
  res.json()
);

const moduleFederation = createInstance({
  name: "host",
  remotes: microfrontends.map((mfe) => ({
    name: mfe.name,
    entry: mfe.url,
  })),
  shared: {
    react: {
      version: "19.2.3",
      lib: () => React,
      shareConfig: {
        singleton: true,
        eager: true,
        requiredVersion: "^19.2.3",
      },
    },
  },
});

const MFE1 = React.lazy(() =>
  moduleFederation
    .loadRemote("mfe1/app")
    .then(({ default: App }) => ({ default: App }))
);

const helpers = await moduleFederation
  .loadRemote("mfe1/helpers")
  .then(({ default: helpers }) => helpers);

const MFE2 = React.lazy(() =>
  moduleFederation
    .loadRemote("mfe2/app")
    .then(({ default: App }) => ({ default: App }))
);

export const App: React.FC = () => {
  const result = helpers.sum(2, 3);
  const [count, setCount] = React.useState(0);
  return (
    <main>
      <h1>Host App</h1>
      <MFE1 />
      <p>
        Sum result mfe1/helpers: <b>{result}</b>
      </p>
      <MFE2
        count={count}
        setCount={setCount}
        style={{ backgroundColor: "lightgreen" }}
      />
    </main>
  );
};
