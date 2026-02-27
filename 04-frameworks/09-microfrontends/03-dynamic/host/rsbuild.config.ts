import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 8080,
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
