import { defineConfig } from "vite";
import cssEmbed from "vite-plugin-css-injected-by-js";

// The following build configuration for Vite is intended to run a custom
// build task specifically made for microapps.
// The idea is to target the microapp entry and bundle it as a single file
// with all its dependencies embedded, ready to be consumed from a host app.

// This manual build task is for educational purposes only. Usually we rely on
// module federation to load microapps dynamically.

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Embedd css in js bundles to have a single file for the microapp.
    cssEmbed({ relativeCSSInjection: true }),
  ],
  build: {
    emptyOutDir: false, // Do not clean the output directory from the previous build.
    cssCodeSplit: true, // Needed to inject css in js bundles via plugin.
    lib: {
      entry: ["src/microapp-keypad.entrypoint.tsx"], // Entry point for the microapp.
      formats: ["es"], // Build bundle as ESModules to allow dynamic imports.
      fileName: "microapp/keypad", // Output bundle file (proper extensions will be added).
    },
  },
  define: { "process.env.NODE_ENV": '"production"' }, // Statically resolve process.env.NODE_ENV.
});
