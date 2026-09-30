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

## Después

Lo que no dio tiempo en clase, zod en el listado, se ve en `../05b-architecture/04-api`, donde además se organiza la aplicación por capas y pods.

Cada carpeta tiene su `readme_es.md` / `readme.md` con el resumen del paso.

```bash
pnpm install
pnpm start
```

Usuario: `admin` / `test`.
