import { defineConfig } from 'vite';

// Proyecto vanilla: index.html en la raíz como entry point.
export default defineConfig({
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
