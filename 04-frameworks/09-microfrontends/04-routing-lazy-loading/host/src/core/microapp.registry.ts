// Tipado común de la interfaz de Microapps.
export interface MicroappInterface {
  render: (container: HTMLElement) => void;
  unmount: (container?: HTMLElement) => void;
}

// Registro de microapps disponibles con sus settings correspondientes.
export interface MicroappSettings {
  bundleUrl: string;
  getInterface: () => MicroappInterface;
}

export type RegisteredMicroapp = "clock" | "quote";

export const microappRegistry: Record<RegisteredMicroapp, MicroappSettings> = {
  clock: {
    bundleUrl: "http://localhost:3001/clock-microapp.js",
    getInterface: () => window["microappClock"],
  },
  quote: {
    bundleUrl: "http://localhost:3002/quote-microapp.js",
    getInterface: () => window["microappQuote"],
  },
};
