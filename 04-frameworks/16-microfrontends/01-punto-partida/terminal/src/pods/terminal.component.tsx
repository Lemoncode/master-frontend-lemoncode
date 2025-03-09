import React from "react";

import "./terminal.css";

export interface TerminalProps {
  value: string;
}

export const Terminal: React.FC<TerminalProps> = ({ value }) => {
  return (
    <div id="terminal">
      <div className="crt" />
      {value?.substring(0, 6).padEnd(6, "·")}
    </div>
  );
};
