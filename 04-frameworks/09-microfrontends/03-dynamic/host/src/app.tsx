import { createInstance } from "@module-federation/enhanced/runtime";
import React from "react";

const microfrontends = await fetch("/api/microfrontends").then((res) =>
  res.json(),
);

const moduleFederation = createInstance({
  name: "host",
  remotes: microfrontends.map((mfe) => ({
    name: mfe.name,
    entry: mfe.url,
  })),
  shared: {
    react: {
      version: "19.2.7",
      lib: () => React,
      shareConfig: {
        singleton: true,
        requiredVersion: "^19.2.7",
      },
    },
  },
});

const MFE1 = React.lazy(() =>
  moduleFederation
    .loadRemote<{ default: React.ComponentType }>("mfe1/app")
    .then((module) => {
      if (!module) {
        throw new Error("Failed to load remote mfe1/app");
      }
      return module;
    }),
);

const helpers = await moduleFederation
  .loadRemote<{
    default: { sum: (a: number, b: number) => number };
  }>("mfe1/helpers")
  .then((module) => {
    if (!module) {
      throw new Error("Failed to load remote mfe1/helpers");
    }
    return module.default;
  });

const MFE2 = React.lazy(() =>
  moduleFederation
    .loadRemote<{
      default: React.ComponentType<{
        count: number;
        setCount: React.Dispatch<React.SetStateAction<number>>;
        style: React.CSSProperties;
      }>;
    }>("mfe2/app")
    .then((module) => {
      if (!module) {
        throw new Error("Failed to load remote mfe2/app");
      }
      return module;
    }),
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
