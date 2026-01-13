// Tipado común de la interfaz de Microapps.
export interface MicroappInterface {
  render: (container: HTMLElement) => void;
  unmount: (container?: HTMLElement) => void;
}

// Registro de microapps disponibles con sus settings correspondientes.
export interface MicroappSettings {
  getInterface: () => MicroappInterface;
}

export type RegisteredMicroapp = "clock" | "quote";

export const microappRegistry: Record<RegisteredMicroapp, MicroappSettings> = {
  clock: {
    getInterface: () => window["microappClock"],
  },
  quote: {
    getInterface: () => window["microappQuote"],
  },
};
