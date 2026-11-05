# Keep Clone · Lemoncode

Aplicación de listas y notas para la práctica guiada de Vue 3. El objetivo no es construir un producto completo, sino recorrer los conceptos de las slides con una app real y pequeña.

## Stack

- Vue 3.5 con `<script setup>` y TypeScript.
- Vite+ (`vp`) como toolchain.
- Vue Router.
- Tailwind CSS v4.
- Vitest.
- Pinia: se añadirá en una próxima sesión. Por ahora el estado vive en composables.

## Requisitos

- Node.js 22.18+ o 24.12+.
- pnpm.
- Vite+ (`vp`).
- VS Code con la extensión Vue - Official.

## Puesta en marcha

```sh
pnpm install
pnpm dev
```

Abre la URL que imprime Vite+.

Comprobaciones:

```sh
pnpm lint
pnpm type-check
pnpm test:unit --run
pnpm build
```

## Guion para construirla en vivo

### 1. Crear el proyecto

```sh
vp create vue -- --ts --router --vitest --eslint --oxfmt --bare keep-clone
# Próximamente (sesión de Pinia):
# vp create vue -- --ts --router --vitest --eslint --oxfmt --pinia --bare keep-clone
```

Opciones: TypeScript, Router, Vitest, ESLint y Oxfmt. Pinia se añadirá en una próxima sesión con el argumento `--pinia`.

### 2. Instalar Tailwind v4

```sh
pnpm add tailwindcss @tailwindcss/vite
```

- Añade `tailwindcss()` a `lazyPlugins` en `vite.config.ts`.
- Crea `src/assets/main.css` con `@import 'tailwindcss';` y los tokens del tema.
- Importa el CSS en `src/main.ts`.

Conceptos: estilos globales y configuración de Vite.

### 3. Tipos

`src/types/index.ts`: `List` y `ListItem`. Mantén los tipos pequeños y explícitos.

### 4. Composables

- `src/composables/useLocalStorage.ts`: sincroniza un `ref` con `localStorage` usando `watch`.
- `src/composables/useLists.ts`: estado compartido a nivel de módulo + CRUD. Sin Pinia por ahora.
- `src/composables/useViewTransition.ts`: envuelve `document.startViewTransition` y espera a que termine.
- `src/stores/useLists.ts`: versión Pinia de `useLists` con `defineStore` (setup store) y persistencia en `localStorage` mediante `useLocalStorage` de `@vueuse/core`. El wiring está comentado en `src/main.ts` para una próxima sesión.

> **Próxima sesión:** implementaremos una versión basada en Pinia. La store ya está preparada en `src/stores/useLists.ts`; en la sesión añadiremos `--pinia` al comando de creación y descomentaremos `app.use(pinia)`. Al ser una SPA no necesitamos SSR; si se añade SSR, habría que usar `skipHydrate` de Pinia.

Conceptos: `ref`, `computed`, `watch`, composición de composables y estado compartido.

### 5. Componentes

- `Icons/`: iconos SVG.
- `AppHeader.vue`: `defineEmits` para crear listas.
- `ListCard.vue`: props + `computed` para preview y estado.
- `ListItem.vue`: props/emits, `nextTick` y `useTemplateRef` para enfocar al editar.
- `DialogShell.vue`: `<dialog>` nativo con slots (`header`, default, `footer`) y `defineExpose`.
- `ListTitleEditor.vue`: `defineModel` para el título.
- `ListDialog.vue`: compone todo, usa `v-model` y `computed`, y abre el diálogo en `onMounted`.

Conceptos: props, emits, slots, `defineModel`, `onMounted`, template refs y `<dialog>`.

### 6. Vistas y rutas

- `HomeView.vue`: cabecera, estado vacío y grid de tarjetas. Usa `RouterView` para el diálogo hijo.
- `App.vue`: solo `RouterView`.
- `router/index.ts`: `/` con hijo `lists/:id`.

Conceptos: rutas anidadas y navegación.

### 7. View Transitions

- La tarjeta usa `view-transition-name: list-<id>`.
- El diálogo usa el mismo nombre.
- Al abrir/cerrar, envuelve la navegación en `useViewTransition`.
- Respeta `prefers-reduced-motion`.

Conceptos: API nativa del navegador + integración con Vue Router. El callback debe ser `async` y esperar a la navegación y al `nextTick`.

### 8. Tests

`src/composables/__tests__/useLists.spec.ts` prueba el CRUD del composable. `src/stores/__tests__/useLists.spec.ts` prueba la versión Pinia. Ejecuta:

```sh
pnpm test:unit --run
```

### 9. Build

```sh
pnpm build
```

## Mapa slide → archivo

| Concepto | Archivo |
| --- | --- |
| `<script setup>` | todos los `.vue` |
| Componentes, props y emits | `ListCard.vue`, `ListItem.vue`, `AppHeader.vue` |
| Slots | `DialogShell.vue` |
| `v-model` / `defineModel` | `ListTitleEditor.vue` |
| Composables | `useLocalStorage.ts`, `useLists.ts`, `useViewTransition.ts` |
| Pinia (próximamente) | `src/stores/useLists.ts` |
| Reactividad (`ref`, `computed`) | `useLists.ts`, `HomeView.vue`, `ListCard.vue` |
| `watch` | `useLocalStorage.ts` |
| Lifecycle (`onMounted`) | `ListDialog.vue`, `DialogShell.vue` |
| Clases dinámicas | `ListItem.vue` |
| Estilos globales | `src/assets/main.css` |
| View Transitions | `useViewTransition.ts`, `ListCard.vue`, `ListDialog.vue` |

## Notas de implementación

- **Diálogo nativo**: `showModal()` gestiona foco, `Esc` y backdrop. No añadas un focus trap manual.
- **Cierre controlado**: `DialogShell` expone `close()`. `ListDialog` lo llama dentro de la View Transition para que el morph funcione también al cerrar.
- **Persistencia**: las listas y elementos se guardan en `localStorage`. Si cambias el modelo, versiona la clave.
- **Sin Pinia por ahora**: el estado compartido es un módulo con `ref`s. Es suficiente para esta escala y enseña composición. En una próxima sesión veremos la versión Pinia en `src/stores/useLists.ts`.
- **Pinia y SSR**: la store usa `useLocalStorage` de VueUse. Al ser una SPA no necesitamos SSR; si se añade SSR, habría que usar `skipHydrate` de Pinia.
- **Tailwind**: se mantiene por ubicuidad, pero la app no depende de una librería de componentes.

## Retos opcionales

- Copiar una lista al portapapeles.
- Añadir un contador de elementos pendientes en la cabecera.
- Extraer `useListStats` para calcular el progreso.
