// Registro de microapps disponibles con sus settings de carga.
export interface MicroappLoadSettings {
  bundleUrl: string;
  exportName: string;
}
export type RegisteredMicroapps = "clock" | "quote";

export const microappRegistry: Record<RegisteredMicroapps, MicroappLoadSettings> = {
  clock: {
    bundleUrl: "microapps/clock.js",
    exportName: "MicroappClock",
  },
  quote: {
    bundleUrl: "microapps/quote.js",
    exportName: "MicroappQuote",
  },
};
