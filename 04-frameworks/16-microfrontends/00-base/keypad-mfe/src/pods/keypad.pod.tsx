import React from "react";

import "./keypad.css";

interface Props {
  dispatchEvent: (name: string, detail?: unknown) => void;
}

export const KeyPad: React.FC<Props> = (props) => {
  const { dispatchEvent } = props;

  return (
    <div id="container">
      <ul id="keyboard">
        {Array.from({ length: 10 })
          .map((_, index) => 9 - index)
          .map((value) => (
            <li
              key={value}
              className="letter"
              onClick={() => dispatchEvent("numeric-touch", value)}
            >
              {value}
            </li>
          ))}
        <li className="command" onClick={() => dispatchEvent("cancel-touch")}>
          Cancel
        </li>
        <li className="command" onClick={() => dispatchEvent("ok-touch")}>
          OK
        </li>
      </ul>
    </div>
  );
};
