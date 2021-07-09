import React from "react";
import { MicroappInterface } from "./microapp.model";
import { microappRegistry, RegisteredMicroapps } from "./microapp.registry";

// Componente Microapp Render
export interface MicroappLoaderProps {
  microapp: RegisteredMicroapps;
}

export const MicroappLoader: React.FC<MicroappLoaderProps> = ({ microapp }) => {
  const containerRef = React.useRef();

  React.useEffect(() => {
    let microappInterface: MicroappInterface;
    const { bundleUrl, exportName } = microappRegistry[microapp] ?? {};

    // Creamos <script> para descarga del bundle
    const script = document.createElement("script");
    script.src = bundleUrl;
    script.type = "text/javascript";
    script.onload = () => {
      microappInterface = window[exportName]?.MicroappInterface;
      microappInterface?.render(containerRef.current);
    };
    document.body.appendChild(script);

    return () => microappInterface?.unmount(containerRef.current);
  }, [microapp]);

  return <div ref={containerRef} />;
};
