import React from "react";
import { MicroappInterface } from "./microapp.model";
import { microappRegistry, RegisteredMicroapps } from "./microapp.registry";

// Lógica de Negocio
const microappInterfacesCache: Partial<Record<RegisteredMicroapps, MicroappInterface>> = {};

const isMicroappLoaded = (microapp: RegisteredMicroapps) =>
  Boolean(microappInterfacesCache[microapp]);

const downloadMicroapp = async (microapp: RegisteredMicroapps): Promise<void> => {
  try {
    const getMicroapp = microappRegistry[microapp];
    const { MicroappInterface } = await getMicroapp?.();
    microappInterfacesCache[microapp] = MicroappInterface;
  } catch {
    Promise.reject();
  }
};

const renderMicroapp = (microapp: RegisteredMicroapps, container: HTMLElement) =>
  microappInterfacesCache[microapp]?.render(container);

const unmountMicroapp = (microapp: RegisteredMicroapps) =>
  microappInterfacesCache[microapp]?.unmount();

// Componente Microapp Loader
export interface MicroappLoaderProps {
  microapp: RegisteredMicroapps;
}

export const MicroappLoader: React.FC<MicroappLoaderProps> = ({ microapp }) => {
  const containerRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    if (!isMicroappLoaded(microapp)) {
      downloadMicroapp(microapp)
        .then(() => renderMicroapp(microapp, containerRef.current))
        .catch(() => console.error(`Error downloading microfrontend bundle for ${microapp}`));
    } else renderMicroapp(microapp, containerRef.current);

    return () => unmountMicroapp(microapp);
  }, [microapp]);

  return <div ref={containerRef} />;
};
