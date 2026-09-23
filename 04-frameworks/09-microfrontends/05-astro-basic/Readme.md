# Integrando React MFE con Astro

Aquí partimos de un remote que tiene un componente React expuesto llamado `CounterApp`, vía webpack module federation.

## Paso 1: Crear el proyecto Astro

Partimos de cero, vamos a crear el proyecto, entramos en el teminal y vamos a la carpeta `host`.

```bash
cd host
```

```bash
npm create astro@latest
```

Elegimos crearlo en la carpeta host (.).

Seleccionamos el template "Minimal".

Luego instalamos las dependencias:

Y NO creamos repo git

## Paso 2: Configurar soporte a React para Astro

En Astro vamos a consumir componentes React, como Astro es un _framework buenga gente_ es fácil de configurar.

```bash
npm install @astrojs/react
```

Y lo configuramos en el archivo astro.config.mjs

```diff
// @ts-check
import { defineConfig } from "astro/config";
+ import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
+  integrations: [react()],
});
```

## Paso 3: Añadir soporte para Module Federation en Astro

Vamos ahora a instalar la dependencia necesaria para Webpack Module Federation:

```bash
npm install @module-federation/enhanced --save-dev
```

Vamos ahora a crear un archivo que tendrá la configuración de los microfrontends que vamos a consumir (en este caso sólo uno):

_./src/mf/client.ts_

```tsx
import React from "react";
import ReactDOM from "react-dom";
// Importamos el runtime de Module Federation
// createInstance se usa cuando NO hay plugin de build (caso Astro + client-only)
import { createInstance } from "@module-federation/enhanced/runtime";

// Tipo de la instancia MF (inferido desde createInstance)
type MFInstance = ReturnType<typeof createInstance>;

/**
 * mfPromise guardará la promesa de la instancia de Module Federation.
 * - Se define fuera de cualquier función → vive como singleton de módulo
 * - Evita crear múltiples instancias (muy importante con HMR)
 */
let mfPromise: Promise<MFInstance> | null = null;

/**
 * Devuelve siempre la MISMA instancia de Module Federation.
 * Solo debe ejecutarse en el navegador.
 */
export function getMF(): Promise<MFInstance> {
  // Seguridad extra: si esto corre en SSR, fallamos rápido
  if (typeof window === "undefined") {
    throw new Error(
      "Module Federation runtime solo debe ejecutarse en cliente"
    );
  }

  // Si no está ya instanciado, toca instanaciarlo (sólo se hace un vez)
  if (!mfPromise) {
    // Creamos la instancia y la guardamos en mfPromise (es una promesa, asíncrono)
    mfPromise = Promise.resolve(
      createInstance({
        // Nombre del host (identidad interna de MF)
        // podríamos haberlo llamado mi_aplicacion_de_viajes_host o cualquier otro nombre único
        name: "astro_host",
        // Definición de los remotes disponibles
        // En este caso sólo tenemos uno
        // Le damos un nombre lógico, y la URL donde está su entrypoint
        // en un entorno real, esta URL podría venir de una variable de entorno
        remotes: [
          {
            name: "react_remote",
            entry: "http://localhost:3001/remoteEntry.js",
          },
        ],
        // Dependencias compartidas entre host y remotes
        shared: {
          react: {
            // Versión de React que usa el host
            version: React.version,
            // Función que devuelve la instancia REAL de React
            lib: () => React,
            // Configuración de compartición
            // Solo una instancia global de React
            // No forzamos versión exacta
            shareConfig: { singleton: true, requiredVersion: false },
          },
        },
      })
    );
  }

  return mfPromise;
}
```

## Paso 4: Crear un wrapper para consumir el componente remoto

Vamos a traernos el componente remoto y a crear un wrapper para usarlo en Astro (que muestre algo en suspense cuando se esté cargando).

_./src/components/RemoteCounterApp.tsx_

```tsx
import React from "react";
import { getMF } from "../mf/client";

const mf = await getMF();

const CounterComponent = React.lazy(() =>
  mf.loadRemote("react_remote/CounterApp").then((module) => ({
    default: (module as { default: React.ComponentType }).default,
  }))
);

export const RemoteCounterComponent: React.FC = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <CounterComponent />
    </React.Suspense>
  );
};
```

## Paso 5: Usar el componente remoto en una página de Astro

Ya sólo nos queda usarlo:

_./host/src/pages/index.astro_

```diff
---
+ import { RemoteCounterComponent } from '../components/RemoteCounterApp';
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>Astro</title>
	</head>
	<body>
		<h1>Astro</h1>
+			<RemoteCounterComponent client:only="react"/>
	</body>
</html>
```

Si ahora ejecutamos remote y host en dos terminales distintas, podemos verlo funcionando.

> Asegurate que remote tiene las dependencias instaladas (`npm install`).

```bash
# En la terminal 1, arrancamos el remote (React MFE)
cd remote
npm start
```

```bash
# En la terminal 2, arrancamos el host (Astro)
cd host
npm run dev
```
