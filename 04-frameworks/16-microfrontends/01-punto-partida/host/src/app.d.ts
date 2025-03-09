// Typings for vite/client
/// <reference types="vite/client" />

// Module augmentation for complementary types
declare module "*.module.css";

// Module augmentation for microapps
declare module "http://localhost:3001/microapp/keypad.js" {
  type KeypadEventType = "numeric-touch" | "clear-touch" | "ok-touch";

  interface KeypadProps {
    dispatchEvent?: (type: KeypadEventType, detail?: number) => void;
  }

  export const MicroappKeypad: React.FC<KeypadProps>;
  export default MicroappKeypad;
}

// Module augmentation for microapps
declare module "http://localhost:3002/microapp/terminal.js" {
  interface TerminalProps {
    value: string;
  }

  export const MicroappTerminal: React.FC<TerminalProps>;
  export default MicroappTerminal;
}
