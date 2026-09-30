# 04 Basic app — Rick & Morty

Aplicación con login contra servidor propio, listado y detalle. Cada paso parte del anterior; el último (`05-detail`) es el código tal y como quedó en clase y es el punto de partida de `../05b-architecture`.

| Paso | Qué se ve |
| --- | --- |
| `00-boilerplate` | Vite + React Compiler + Tailwind/daisyUI, servidor Hono y proxy |
| `01-routing` | React Router: rutas, layout y rutas privadas |
| `02-login` | Login contra el servidor, sesión con cookie `httpOnly` |
| `03-login-zod` | Validación del formulario con zod |
| `04-list` | Listado: `useEffect`, estados de carga y error, tarjetas |
| `05-detail` | Detalle: `useParams`, dependencias del efecto, zod con `.extend`, tabla de episodios |

## Anexos

Lo que no dio tiempo en clase se ve en `../05b-architecture`: zod en el listado en `04-api`, y actions, validación en vivo y Suspense en sus anexos del final.

Cada carpeta tiene su `readme_es.md` / `readme.md` con el resumen del paso.

```bash
pnpm install
pnpm start
```

Usuario: `admin` / `test`.
