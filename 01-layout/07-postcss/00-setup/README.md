# Setup Inicial

Vamos a partir de este proyecto base en el que tenemos:

- Un `index.html` con un `<link>` a `styles.css` de la carpeta `dist`.
- Una carpeta `src` con un `styles.css` inicial.
- Un `package.json` básico, en el que tenemos dos scripts:
  - `build`: para compilar CSS con PostCSS
  - `watch`: para compilar CSS automáticamente al guardar cambios

Inicializa npm:

```bash
npm ci
```

Esto instalará las dependencias definidas en `package-lock.json`.

Luego arranca el modo watch:

```bash
npm run watch:css
```
