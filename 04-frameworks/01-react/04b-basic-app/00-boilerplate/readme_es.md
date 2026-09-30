# 00 Boilerplate — Rick & Morty

Punto de partida. Aquí no escribimos aplicación todavía: el proyecto ya viene montado con Vite, el React Compiler, Tailwind/daisyUI y un servidor propio, y lo único que hacemos es **arrancarlo y entender sus piezas**.

## Qué vamos a construir

Una aplicación con el catálogo de personajes de Rick & Morty:

- Una **pantalla de login** contra nuestro propio servidor, con sesión por cookie.
- Un **listado de personajes** en tarjetas.
- Una **pantalla de detalle** con sus episodios.

Por el camino: enrutado, validación con **zod**, peticiones y estados de carga. Después, en `../../05b-architecture`, lo colocamos todo con una arquitectura que aguante crecer.

## Las dos piezas del proyecto

Este proyecto tiene **dos programas** que se arrancan a la vez:

| Pieza        | Carpeta   | Puerto | Qué hace                                 |
| ------------ | --------- | ------ | ---------------------------------------- |
| **Front**    | `src/`    | 5173   | La aplicación de React, servida por Vite |
| **Servidor** | `server/` | 3000   | Nuestra API, hecha con Hono              |

> ⚠️ Si tienes otro proyecto ocupando alguno de esos puertos, ciérralo antes: el servidor avisa con un error `EADDRINUSE`. El puerto del servidor se puede cambiar con la variable de entorno `PORT`.

**¿Por qué un servidor propio y no la API pública de Rick & Morty directamente?** Porque hay cosas que solo se pueden ver con un servidor delante:

- **El login**, con una sesión de verdad guardada en una cookie `httpOnly` (el JavaScript de la página no puede leerla).
- **Romper el contrato a propósito**: el servidor tiene un modo «roto» para ver cómo zod lo detecta.
- **Dar los datos ya masticados**: la API pública devuelve campos anidados; el nuestro los aplana y manda solo lo que necesita la pantalla.

## El proyecto de React

> **Usamos pnpm.** `pnpm install` para instalar, `pnpm add` en vez de `npm install <paquete>`, y los scripts sin `run` (`pnpm start:server`).

Está generado con el andamiaje oficial de Vite:

```bash
pnpm create vite@latest 00-boilerplate --template react-ts
```

Y sobre eso se han añadido tres cosas.

### 1. El React Compiler

```bash
pnpm add -D oxc-transform-react
```

_./vite.config.ts_

```diff
  export default defineConfig({
-   plugins: [react()],
+   plugins: [react({ compiler: true })],
  })
```

El compilador **memoiza por nosotros al compilar**: no hay que ir poniendo `React.memo`, `useMemo` ni `useCallback` a mano. No se toca ni una línea de los componentes.

**La diferencia, medida.** La portada (`src/App.tsx`) tiene un campo de texto y un componente hijo (`RenderProbe`) que cuenta cuántas veces se ejecuta. El hijo recibe siempre la misma prop. Escribe diez letras:

|                       | Al cargar | Tras escribir 10 letras |
| --------------------- | --------- | ----------------------- |
| **Sin el compilador** | 2         | **24**                  |
| **Con el compilador** | 2         | **2**                   |

Para verlo: quita el `compiler: true`, **reinicia Vite** (la configuración no se recarga en caliente) y vuelve a escribir.

⚠️ **Avisos:**

- Si al editar ves un error imposible (algo inicializado que sale `undefined`), **recarga la página entera**: la recarga en caliente puede conservar una caché del compilador desfasada.
- **Solo optimiza el código que cumple las reglas de React.** Si un componente muta props o llama a hooks dentro de un `if`, se lo salta.

### 2. Los estilos: Tailwind y daisyUI

```bash
pnpm add -D tailwindcss @tailwindcss/vite daisyui
```

_./vite.config.ts_

```diff
+ import tailwindcss from "@tailwindcss/vite";

  export default defineConfig({
-   plugins: [react({ compiler: true })],
+   plugins: [react({ compiler: true }), tailwindcss()],
  })
```

_./src/index.css_ (resumido)

```css
@import "tailwindcss";
@plugin "daisyui";

@plugin "daisyui/theme" {
  name: "portal";
  default: true;
  color-scheme: dark;
  /* colores base, primario (verde portal) y error… */
}
```

- **Tailwind** son clases sueltas para medidas y disposición: `flex`, `gap-4`, `p-10`, `text-3xl`.
- **daisyUI** añade componentes ya vestidos: `btn`, `card`, `input`, `badge`, `navbar`.
- El tema `portal` es propio y sus colores están medidos para pasar contraste **AAA**.
- La tipografía (Roboto y Space Grotesk) se carga en `index.html` y se declara con `@theme` en `index.css`.

> En todo el recorrido **no escribimos CSS propio**: la atención se queda en React.

### 3. El proxy

_./vite.config.ts_

```diff
  export default defineConfig({
    plugins: [react({ compiler: true }), tailwindcss()],
+   server: {
+     proxy: {
+       "/api": "http://localhost:3000",
+     },
+   },
  })
```

El front pide `/api/algo` **a su propia dirección** y Vite se lo reenvía al servidor. Para el navegador son el mismo sitio, así que **no hay que configurar CORS** y **la cookie de sesión viaja sola**. En producción este papel lo hace un nginx o el propio servidor.

## ¿Por qué el contador sube de dos en dos? `<StrictMode>`

En `src/main.tsx` la aplicación va envuelta en `<React.StrictMode>`. **Solo actúa en desarrollo**, y ejecuta **dos veces** el cuerpo de los componentes, los inicializadores de estado y los efectos (monta, desmonta y vuelve a montar).

Lo hace para **destapar componentes impuros**: si tu componente es puro, ejecutarlo dos veces no cambia nada. `RenderProbe` escribe en un ref durante el render —justo lo que React pide no hacer—, y por eso sube de dos en dos. En producción, la mitad.

⚠️ **No lo quites porque molesten los logs repetidos.** Si el doble ejecutado rompe algo, ese algo ya estaba roto.

## El servidor: `server/index.ts`

Hecho con [Hono](https://hono.dev) (parecido a Express, pero moderno y tipado) y ejecutado con `tsx`, que corre TypeScript sin compilar.

| Método | Ruta                          | Qué hace                                                     |
| ------ | ----------------------------- | ------------------------------------------------------------ |
| `GET`  | `/api/health`                 | Comprobar que el servidor está vivo                          |
| `POST` | `/api/login`                  | Recibe usuario y contraseña; si son válidos, deja la cookie  |
| `POST` | `/api/logout`                 | Borra la cookie                                              |
| `GET`  | `/api/me`                     | Quién soy, leyendo la cookie. `401` si no hay sesión         |
| `GET`  | `/api/characters?page=&name=` | Página de personajes, ya aplanados                           |
| `GET`  | `/api/characters/:id`         | Un personaje con sus primeros episodios (`404` si no existe) |

- **Las peticiones tardan a propósito** (entre 400 y 800 ms), para que se vean los estados de carga.
- **Usuario de prueba:** `admin` / `test`.
- **Modo roto:** `pnpm start:server:broken` devuelve `characterId` en vez de `id`.
- **Modo caos:** `curl -X POST http://localhost:3000/api/chaos` hace que `/api/characters` conteste `500`. Se enciende y apaga en caliente.

Los scripts del `package.json`:

```json
"start": "run-p -l start:server start:front",
"start:front": "vite --host",
"start:server": "tsx watch server/index.ts",
"start:server:broken": "BREAK_API=true tsx watch server/index.ts"
```

`run-p` (de `npm-run-all2`) lanza varios scripts **en paralelo** y con `-l` etiqueta cada línea con el script del que viene.

## Arrancar

```bash
pnpm install
pnpm start
```

> ⚠️ La primera vez pnpm puede avisar de `Ignored build scripts: esbuild`. El proyecto trae un `pnpm-workspace.yaml` con `allowBuilds: esbuild: true` para autorizarlo.

Si prefieres dos terminales: `pnpm start:server` y `pnpm start:front`.

## Pruébalo

- Abre <http://localhost:5173>: el indicador del servidor sale en **ok**. Si no, solo arrancó el front.
- Escribe en el campo y mira el contador del hijo: no sube.
- Desde otra terminal:

```bash
curl http://localhost:3000/api/health
curl -c cookies.txt -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"test"}'
curl -b cookies.txt http://localhost:3000/api/me
curl "http://localhost:3000/api/characters?page=1&name=rick"
```

## Lo que hay que mirar antes de seguir

- `vite.config.ts`: el compilador, Tailwind y el proxy.
- `server/index.ts`: las rutas de la API. No hace falta entenderlo entero.
- `src/App.tsx`: la portada con la demo del compilador. Es lo que se sustituye en el paso siguiente.

**Siguiente:** `01-routing` — la aplicación deja de ser una sola pantalla.
