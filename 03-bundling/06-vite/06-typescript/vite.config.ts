import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  plugins: [checker({ typescript: true })],
  build: {
    rollupOptions: {
      plugins: [typescript({ noEmitOnError: false })],
    },
  },
});
