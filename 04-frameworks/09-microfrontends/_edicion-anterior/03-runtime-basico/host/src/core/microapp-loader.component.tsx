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

    // Línea clave, ¿como puedo acceder a la interfaz de mi microapp cargada por <script>?
    const { getInterface } = microappRegistry[microapp];
    getInterface().render(containerRef.current);

    return () => getInterface().unmount(containerRef.current);
  }, [microapp]);

  return <div ref={containerRef} />;
};
