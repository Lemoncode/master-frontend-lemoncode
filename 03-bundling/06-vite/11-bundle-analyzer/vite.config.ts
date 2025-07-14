import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { analyzer } from "vite-bundle-analyzer";

export default defineConfig({
  plugins: [
    checker({ typescript: true }),
    tailwindcss(),
    react(),
    analyzer({ analyzerMode: "static", openAnalyzer: false }),
  ],
});
