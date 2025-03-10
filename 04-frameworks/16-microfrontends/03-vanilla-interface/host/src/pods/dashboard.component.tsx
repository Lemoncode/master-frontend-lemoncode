import React from "react";

import "./dashboard.css";
import { MicroappLoader } from "./microapp-loader.component";

// Dashboard component composed by lazy loaded microapps.
export const Dashboard: React.FC = () => {
  const [value, setValue] = React.useState<string>("");

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <MicroappLoader<KeypadProps>
        url="http://localhost:3001/microapp/keypad.js"
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
      <MicroappLoader<TerminalProps>
        url="http://localhost:3002/microapp/terminal.js"
        value={value}
      />
    </div>
  );
};
