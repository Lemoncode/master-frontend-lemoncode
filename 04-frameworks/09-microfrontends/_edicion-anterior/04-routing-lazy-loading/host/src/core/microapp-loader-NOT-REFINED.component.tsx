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
    const { bundleUrl, getInterface } = microappRegistry[microapp];

    // Creamos <script> para descarga del bundle
    const script = document.createElement("script");
    script.src = bundleUrl;
    script.type = "text/javascript";
    script.onload = () => getInterface().render(containerRef.current);
    document.body.appendChild(script);

    return () => getInterface().unmount(containerRef.current);
  }, [microapp]);

  return <div ref={containerRef} />;
};
