import React from "react";

// Tipado común de la interfaz de Microapps.
type MicroappRenderFunction = (container: HTMLElement) => void;
type MicroappUnmountFunction = (container?: HTMLElement) => void;

interface MicroappInterface {
  render: MicroappRenderFunction;
  unmount: MicroappUnmountFunction;
}

type RegisteredMicroapps = "MicroappClock" | "MicroappQuote";

// Componente Microapp Render
export interface MicroappRenderProps {
  microapp: RegisteredMicroapps;
}

export const MicroappRender: React.FC<MicroappRenderProps> = ({ microapp }) => {
  const containerRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    // Línea clave, ¿dónde puedo encontrar el interfaz de mi microapp cargada por <script>?
    const microappInterface: MicroappInterface = window[microapp]?.MicroappInterface;
    microappInterface?.render(containerRef.current);

    return () => microappInterface?.unmount(containerRef.current);
  }, [microapp]);

  return <div ref={containerRef} />;
};
