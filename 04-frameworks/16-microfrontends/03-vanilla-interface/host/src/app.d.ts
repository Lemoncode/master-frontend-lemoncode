// Typings for vite/client
/// <reference types="vite/client" />

// Module augmentation for complementary types
declare module "*.module.css";

// Typings for microapps
interface MicroappInterface<P extends object> {
  render: (container: HTMLElement, props?: P) => void;
  update: (props?: P) => void;
  unmount: (container?: HTMLElement) => void;
  root?: Root;
}

type KeypadEventType = "numeric-touch" | "clear-touch" | "ok-touch";
interface KeypadProps {
  dispatchEvent?: (type: KeypadEventType, detail?: number) => void;
}

interface TerminalProps {
  value: string;
}

// Module augmentation for microapps
declare module "http://localhost:3001/microapp/keypad.js" {
  export const MicroappKeypad: MicroappInterface<KeypadProps>;
  export default MicroappKeypad;
}

// Module augmentation for microapps
declare module "http://localhost:3002/microapp/terminal.js" {
  export const MicroappTerminal: MicroappInterface<TerminalProps>;
  export default MicroappTerminal;
}
