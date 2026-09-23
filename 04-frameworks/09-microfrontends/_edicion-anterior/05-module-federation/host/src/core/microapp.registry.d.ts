import type { MicroappInterface } from "./microapp.registry";

// Declaración de modulos federados
declare module "clock/widget" {
  export const MicroappInterface: MicroappInterface;
  export default MicroappInterface;
}

declare module "quote/widget" {
  export const MicroappInterface: MicroappInterface;
  export default MicroappInterface;
}
