// Typings for vite/client
/// <reference types="vite/client" />

// Module augmentation for complementary types
declare module "*.module.css";

// Typings for microapps
type KeypadEventType = "numeric-touch" | "clear-touch" | "ok-touch";
interface KeypadProps {
  dispatchEvent?: (type: KeypadEventType, detail?: number) => void;
}

interface TerminalProps {
  value: string;
}

// Module augmentation for microapps
declare module "http://localhost:3001/microapp/keypad.js" {
  export const MicroappKeypad: React.FC<KeypadProps>;
  export default MicroappKeypad;
}

// Module augmentation for microapps
declare module "http://localhost:3002/microapp/terminal.js" {
  export const MicroappTerminal: React.FC<TerminalProps>;
  export default MicroappTerminal;
}
