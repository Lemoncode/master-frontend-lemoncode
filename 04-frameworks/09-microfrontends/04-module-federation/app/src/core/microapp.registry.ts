import { MicroappInterface } from "./microapp.model";

export type RegisteredMicroapps = "clock" | "quote";
export type GetFederatedMicroappFunction = () => Promise<{ MicroappInterface: MicroappInterface }>;

export const microappRegistry: Record<RegisteredMicroapps, GetFederatedMicroappFunction> = {
  clock: () => import("ClockContainer/ClockWidget"),
  quote: () => import("QuoteContainer/QuoteWidget"),
};
