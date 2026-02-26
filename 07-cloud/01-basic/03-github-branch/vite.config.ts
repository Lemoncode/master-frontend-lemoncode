import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  envPrefix: 'PUBLIC_',
  plugins: [
    tanstackRouter({
      routesDirectory: 'src/scenes',
      generatedRouteTree: 'src/core/router/route-tree.ts',
      autoCodeSplitting: true,
    }),
    react({
      babel: {
        plugins: ['@emotion'],
      },
    }),
  ],
});
