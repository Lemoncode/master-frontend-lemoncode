// Tipado común de la interfaz de Microapps.
export type MicroappRenderFunction = (container: HTMLElement) => void;
export type MicroappUnmountFunction = (container?: HTMLElement) => void;

export interface MicroappInterface {
  render: MicroappRenderFunction;
  unmount: MicroappUnmountFunction;
}
