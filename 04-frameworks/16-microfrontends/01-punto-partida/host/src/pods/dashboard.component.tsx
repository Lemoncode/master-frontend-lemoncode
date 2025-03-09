import React from "react";

import "./dashboard.css";

// Lazy load desired microapps.
const Keypad = React.lazy(() => import("http://localhost:3001/microapp/keypad.js"));
const Terminal = React.lazy(() => import("http://localhost:3002/microapp/terminal.js"));

// Dashboard component composed by lazy loaded microapps.
export const Dashboard: React.FC = () => {
  const [value, setValue] = React.useState<string>("");

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Keypad
          dispatchEvent={(type, detail) => {
            if (type === "numeric-touch") {
              setValue(`${value}${detail}`);
            } else if (type === "clear-touch") {
              setValue("");
            } else if (type === "ok-touch") {
              alert(`Value: ${value}`);
            }
          }}
        />
        <Terminal value={value} />
      </React.Suspense>
    </div>
  );
};
