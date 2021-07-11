import React from "react";
import { MicroappInterface } from "./microapp.model";
import { microappRegistry, RegisteredMicroapps } from "./microapp.registry";

// Lógica de Negocio
const microappInterfacesCache: Partial<Record<RegisteredMicroapps, MicroappInterface>> = {};

const isMicroappLoaded = (microapp: RegisteredMicroapps) =>
  Boolean(microappInterfacesCache[microapp]);

const renderMicroapp = (microapp: RegisteredMicroapps, container: HTMLElement) =>
  microappInterfacesCache[microapp]?.render(container.appendChild(document.createElement("div")));

const downloadMicroapp = async (microapp: RegisteredMicroapps): Promise<void> => {
  try {
    const getFederatedMicroapp = microappRegistry[microapp];
    const { MicroappInterface } = await getFederatedMicroapp?.();
    microappInterfacesCache[microapp] = MicroappInterface;
  } catch {
    Promise.reject();
  }
};

const unmountMicroapp = (microapp: RegisteredMicroapps, container: HTMLElement) => {
  microappInterfacesCache[microapp]?.unmount(container.children?.[0]);
  container.children?.[0].remove();
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
