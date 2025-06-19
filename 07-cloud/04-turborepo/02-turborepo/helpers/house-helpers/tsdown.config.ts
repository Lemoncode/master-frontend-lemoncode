import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "src/index.ts",
  format: ["esm", "umd"],
  outputOptions: {
    name: "HouseHelpers",
  },
  minify: true,
});
