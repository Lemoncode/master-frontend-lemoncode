export type MicroappRenderFunction = (container: Element) => void;
export type MicroappUnmountFunction = (container: Element) => boolean;

export interface MicroappInterface {
  render: MicroappRenderFunction;
  unmount: MicroappUnmountFunction;
}
