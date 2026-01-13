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
