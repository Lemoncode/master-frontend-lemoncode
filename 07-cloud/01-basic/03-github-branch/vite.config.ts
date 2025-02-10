import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

export default defineConfig({
  base: './',
  envPrefix: 'PUBLIC_',
  plugins: [
    TanStackRouterVite({
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
