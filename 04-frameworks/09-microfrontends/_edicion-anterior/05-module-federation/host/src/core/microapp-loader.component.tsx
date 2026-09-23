import React from "react";
import { RegisteredMicroapp, microappRegistry } from "./microapp.registry";

// Componente Microapp Render
export interface MicroappLoaderProps {
  microapp: RegisteredMicroapp;
}

export const MicroappLoader: React.FC<MicroappLoaderProps> = ({ microapp }) => {
  const containerRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    if (!microappRegistry[microapp]) return;

    // Accedemos al registry
    const { getInterface } = microappRegistry[microapp];

    // Renderizamos
    getInterface().then(({ render }) => render(containerRef.current));

    // Desmontamos
    return () => {
      getInterface().then(({ unmount }) => unmount(containerRef.current));
    };
  }, [microapp]);

  return <div ref={containerRef} />;
};
