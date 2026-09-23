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

    if (!getInterface()) {
      // Todavía no hemos descargado el bundle, creamos <script>
      const script = document.createElement("script");
      script.src = bundleUrl;
      script.type = "text/javascript";
      script.onload = () => getInterface().render(containerRef.current);
      script.onerror = () => script.remove();
      document.body.appendChild(script);
    } else {
      // Bundle descargado previamente, pero no montado todavía
      getInterface().render(containerRef.current);
    }

    return () => getInterface().unmount(containerRef.current);
  }, [microapp]);

  return <div ref={containerRef} />;
};
