import "./microapp.styles";
import React from "react";
import ReactDOM from "react-dom";
import { Quote } from "./components";

/**
 * Microapp component
 */
const Microapp: React.FC = () => <Quote />;

/**
 * Microapp public interface
 */
export type MicroappRenderFunction = (container: Element) => void;
export type MicroappUnmountFunction = (container: Element) => boolean;

export interface MicroappInterface {
  render: MicroappRenderFunction;
  unmount: MicroappUnmountFunction;
}

export const MicroappInterface: MicroappInterface = {
  render: (container) => ReactDOM.render(<Microapp />, container),
  unmount: (container) => ReactDOM.unmountComponentAtNode(container),
};
