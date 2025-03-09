import React from "react";

import { Keypad, KeypadProps } from "./pods/keypad.component";

export const MicroappKeypad: React.FC<KeypadProps> = (props) => <Keypad {...props} />;

export default MicroappKeypad;
