# 05 Arquitectura — ¿dónde pongo cada cosa?

Parte de `../04b-basic-app/05-detail`. **No se añade funcionalidad**: la aplicación hace lo mismo al final, pero organizada por capas y pods.

| Paso | Qué se ve |
| --- | --- |
| `00-teoria` | Por tipo, por página y por pods; capas y anatomía de un pod (solo documentación) |
| `01-scenes` | Alias `#`, `core/router`, `core/auth`, `layouts`, `scenes` |
| `02-cross-cutting` | La sesión en un contexto (adiós prop drilling) |
| `03-pods` | Container + component + barrel por pantalla; spinner y error a `common` |
| `04-api` | api + api model (zod) + view model + mapper; la validación sube a `common` |
| `anexo-a-login-actions` | *Opcional.* Login con `action`, `useActionState` y `useFormStatus` (parte de `04-api`) |
| `anexo-b-login-live-validation` | *Opcional.* Validación mientras se escribe (parte de `anexo-a`) |
| `anexo-c-list-suspense` | *Opcional.* Listado con `use` y `Suspense` (parte de `04-api`) |

```
src/
├── common/    ← sin dominio, promocionable a librería
├── core/      ← transversal: rutas y sesión
├── layouts/   ← armazones
├── pods/      ← funcionalidad por dominio
└── scenes/    ← pantallas: layout + pod
```

Cada carpeta tiene su `readme_es.md` / `readme.md` con el resumen del paso.
