# todolist: Vue 3 + Vite + TypeScript

ToDo List con Vue 3, Vite y TypeScript.

## Stack

- Vue 3
- Vite
- TypeScript
- Pinia
- Tailwind CSS

## Teoría

- [Vue 3](https://v3.vuejs.org/)

  - 🧩 _Componentes_ (_SFC_): `template`, `script`, `style`
  - 🔠 _Interpolación_: `{{ }}`
  - 📝 _Directivas_: `v-if`, `v-for`, `v-model`
  - ⚡️ _Composition API_: `defineProps`, `defineEmits`
  - 🎯 _Props_: `:propName="propValue"`
  - 🎬 _Eventos_: `@click`, `@input`, `@my-event`
  - 🔄 _Lifecycle Hooks_: `onMounted`, `onBeforeUnmount`, etc
  - 🎨 _Estilos_: `:class`, `:style`, `scoped`

- [Pinia](https://pinia.esm.dev/)

  - `defineStore`
  - State
  - Actions

- [Vue Devtools](https://devtools.vuejs.org/)

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
