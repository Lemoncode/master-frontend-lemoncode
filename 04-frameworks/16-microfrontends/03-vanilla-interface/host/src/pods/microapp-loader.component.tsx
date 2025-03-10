import React from "react";

export type MicroappLoaderProps<P extends object> = {
  url: string;
} & P;

export const MicroappLoader = <P extends object>({ url, ...props }: MicroappLoaderProps<P>) => {
  const containerRef = React.useRef<HTMLDivElement>();
  const microappInterfaceRef = React.useRef<MicroappInterface<P>>();
  const [interfaceReady, setInterfaceReady] = React.useState(false);

  // Effect to load microapp interface
  React.useEffect(
    () => {
      import(url).then((mod) => {
        microappInterfaceRef.current = mod.default;
        setInterfaceReady(true);
      });
    },
    [] // Intentional no-deps, load only once, don't monitor url changes
  );

  // Effect to render/unmount via microapp interface
  React.useEffect(() => {
    if (!interfaceReady) return;
    // Mount microapp and return cleanup function for unmounting.
    microappInterfaceRef.current?.render?.(containerRef.current, props as P);
    // Be aware that unmounting within a React.Strict block, a false positive
    // will popup. Explained here: https://github.com/facebook/react/issues/25675
    return () => microappInterfaceRef.current?.unmount?.();
  }, [interfaceReady, microappInterfaceRef.current]);

  // Effect to trigger an update every time props change.
  React.useEffect(() => {
    if (!interfaceReady) return;
    microappInterfaceRef.current?.update?.(props as P);
  }, [interfaceReady, props]);

  return interfaceReady ? <div ref={containerRef} /> : <div>Loading...</div>;
};
