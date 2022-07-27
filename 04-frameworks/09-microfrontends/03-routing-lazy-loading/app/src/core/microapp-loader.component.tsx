import React from "react";
import { microappRegistry, RegisteredMicroapps } from "./microapp.registry";

// Lógica de Negocio
const isMicroappLoaded = (microapp: RegisteredMicroapps) =>
  Boolean(window[microappRegistry[microapp]?.exportName]);

const renderMicroapp = (microapp: RegisteredMicroapps, container: HTMLElement) => {
  const { exportName } = microappRegistry[microapp] ?? {};
  if (exportName) window[exportName]?.MicroappInterface?.render(container);
};

const downloadMicroapp = (microapp: RegisteredMicroapps): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { bundleUrl } = microappRegistry[microapp] ?? {};
    if (bundleUrl) {
      const script = document.createElement("script");
      script.src = bundleUrl;
      script.type = "text/javascript";
      script.onload = () => resolve();
      script.onerror = () => {
        script.remove();
        reject();
      };
      document.body.appendChild(script);
    }
  });
};

const unmountMicroapp = (microapp: RegisteredMicroapps, container: HTMLElement) => {
  const { exportName } = microappRegistry[microapp] ?? {};
  if (exportName) window[exportName]?.MicroappInterface?.unmount(container);
};

// Componente Microapp Loader
export interface MicroappLoaderProps {
  microapp: RegisteredMicroapps;
}

export const MicroappLoader: React.FC<MicroappLoaderProps> = ({ microapp }) => {
  const containerRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    const mountMicroapp = async () => {
      if (!isMicroappLoaded(microapp))
        try {
          await downloadMicroapp(microapp);
        } catch {
          console.error(`Error downloading microfrontend bundle for ${microapp}`);
        }
      renderMicroapp(microapp, containerRef.current);
    };
    mountMicroapp();

    return () => unmountMicroapp(microapp, containerRef.current);
  }, [microapp]);

  return <div ref={containerRef} />;
};
