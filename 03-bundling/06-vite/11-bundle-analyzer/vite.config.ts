import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { analyzer } from "vite-bundle-analyzer";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    checker({ typescript: true }),
    tailwindcss(),
    react(),
    visualizer({ template: "treemap" }),
    analyzer({ analyzerMode: "static", openAnalyzer: false }),
  ],
});
