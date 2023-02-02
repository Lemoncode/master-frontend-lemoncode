export type MicroappRenderFunction = (container: Element) => void;
export type MicroappUnmountFunction = (container?: Element) => void;

export interface MicroappInterface {
  render: MicroappRenderFunction;
  unmount: MicroappUnmountFunction;
}

export declare const MicroappInterface: MicroappInterface;
