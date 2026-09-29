import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // compiler: true activa el React Compiler. Memoiza por nosotros en
    // tiempo de compilación, así que no hay que ir poniendo React.memo,
    // useMemo ni useCallback a mano salvo que haga falta de verdad.
    // Necesita el paquete oxc-transform-react instalado.
    react({ compiler: true }),
    tailwindcss(),
  ],
  server: {
    // Todo lo que empiece por /api se lo mandamos al servidor de Hono.
    // Para el navegador, front y back son el mismo origen: ni CORS,
    // ni configurar nada para que viaje la cookie de sesión.
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
