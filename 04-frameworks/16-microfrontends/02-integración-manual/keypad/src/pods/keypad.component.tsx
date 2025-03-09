import React from "react";

import "./keypad.css";

export type KeypadEventType = "numeric-touch" | "clear-touch" | "ok-touch";

export interface KeypadProps {
  dispatchEvent?: (type: KeypadEventType, detail?: number) => void;
}

export const Keypad: React.FC<KeypadProps> = ({ dispatchEvent } = {}) => (
  <div>
    <ul id="keyboard">
      {Array.from({ length: 10 })
        .map((_, index) => 9 - index)
        .map((value) => (
          <li
            key={value}
            className="letter"
            onClick={() => dispatchEvent?.("numeric-touch", value)}
          >
            {value}
          </li>
        ))}
      <li className="command red" onClick={() => dispatchEvent?.("clear-touch")}>
        Clear
      </li>
      <li className="command green" onClick={() => dispatchEvent?.("ok-touch")}>
        OK
      </li>
    </ul>
  </div>
);
