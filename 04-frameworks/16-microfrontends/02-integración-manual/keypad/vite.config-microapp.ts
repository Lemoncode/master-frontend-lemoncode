import { defineConfig } from "vite";
import cssEmbed from "vite-plugin-css-injected-by-js";

/**
 * The following build configuration for Vite is intended to run a custom
 * build task specifically made for microapps.
 * The idea is to target the microapp entry and bundle it as a single file
 * with all its dependencies embedded, ready to be consumed from a host app.
 *
 * This manual build task is for educational purposes only. Usually we rely on
 * module federation to load microapps dynamically.
 */
export default defineConfig({
  plugins: [
    // Embedd css in js bundles to have a single file for the microapp.
    cssEmbed({ relativeCSSInjection: true }),
  ],
  build: {
    // Do not clean the output directory from the previous build.
    emptyOutDir: false,
    // Needed to inject css in js bundles via plugin.
    cssCodeSplit: true,
    lib: {
      // Entry point for the microapp.
      entry: ["src/microapp-keypad.entrypoint.tsx"],
      // Build bundle as ESModules to allow dynamic imports.
      formats: ["es"],
      // Output bundle file (proper extensions will be added).
      fileName: "microapp/keypad",
    },
  },
  // Statically resolve process.env.NODE_ENV.
  define: { "process.env.NODE_ENV": '"production"' },
});
