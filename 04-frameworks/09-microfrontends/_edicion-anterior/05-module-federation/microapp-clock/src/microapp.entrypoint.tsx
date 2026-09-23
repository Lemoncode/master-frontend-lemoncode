import "./microapp.styles";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { Clock } from "./components";

/**
 * Microapp component
 */
const Microapp: React.FC = () => <Clock />;

/**
 * Microapp public interface
 */
interface MicroappInterface {
  render: (container: HTMLElement) => void;
  unmount: (container?: HTMLElement) => void;
}

let root: Root;

export const MicroappInterface: MicroappInterface = {
  render: (container) => {
    root = createRoot(container);
    root?.render(<Microapp />);
  },
  unmount: () => root?.unmount(),
};

export default MicroappInterface;
