import "./microapp.styles";
import React from "react";
import { Root, createRoot } from "react-dom/client";
import { Quote } from "./components";

/**
 * Microapp component
 */
const Microapp: React.FC = () => <Quote />;

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
