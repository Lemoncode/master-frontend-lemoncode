export type MicroappRenderFunction = (container: HTMLElement) => void;
export type MicroappUnmountFunction = (container?: HTMLElement) => void;

export interface MicroappInterface {
  render: MicroappRenderFunction;
  unmount: MicroappUnmountFunction;
}

export declare const MicroappInterface: MicroappInterface;
export default MicroappInterface;
