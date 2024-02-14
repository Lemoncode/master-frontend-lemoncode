// Tipado común de la interfaz de Microapps.
export interface MicroappInterface {
  render: (container: HTMLElement) => void;
  unmount: (container?: HTMLElement) => void;
}

// Registro de microapps disponibles con sus settings correspondientes.
export interface MicroappSettings {
  getInterface: () => Promise<MicroappInterface>;
}

export type RegisteredMicroapp = "clock" | "quote";

export const microappRegistry: Record<RegisteredMicroapp, MicroappSettings> = {
  clock: {
    getInterface: () => import("clock/widget" as string).then(unwrapMicroappInterface),
  },
  quote: {
    getInterface: () => import("quote/widget" as string).then(unwrapMicroappInterface),
  },
};

const unwrapMicroappInterface = ({ MicroappInterface }) => MicroappInterface;
