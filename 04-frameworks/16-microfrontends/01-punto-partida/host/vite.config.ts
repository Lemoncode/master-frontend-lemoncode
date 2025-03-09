import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";

// Constant settings
const devServerPort = 3000;

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    origin: `http://localhost:${devServerPort}`,
    port: devServerPort,
    strictPort: true,
    open: true,
  },
  preview: {
    port: devServerPort,
    strictPort: true,
  },
  base: `http://localhost:${devServerPort}`,
  plugins: [react(), checker({ typescript: true })],
});
