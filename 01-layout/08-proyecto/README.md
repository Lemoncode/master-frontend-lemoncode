# Sitio Multipágina con Vite + PostCSS

## 📁 Estructura del Proyecto

```
start/
├── index.html                 # Página principal
├── contact.html               # Página de contacto
├── vite.config.ts             # Configuración multipágina
├── postcss.config.cjs         # Configuración PostCSS
├── package.json
├── tsconfig.json
│
├── public/                    # Archivos estáticos
│
└── src/
    ├── ts/                    # Scripts TypeScript
    │   ├── main.ts            # Script para index.html
    │   ├── contact.ts         # Script para contact.html
    │   └── components/        # Componentes TypeScript
    │       └── toggle-dark-mode.ts
    │
    └── css/                   # Estilos CSS organizados
        ├── main.css           # Punto de entrada principal
        │
        ├── base/              # Estilos base y variables
        │   ├── elements.css   # Elementos HTML base
        │   ├── media.css      # Media queries
        │   └── variables.css  # Variables CSS
        │
        ├── vendors/           # Librerías de terceros
        │   ├── normalize.css
        │   └── reset.css
        │
        ├── utilities/         # Utilidades y helpers
        │   ├── animations.css # Animaciones
        │   └── mixins.css     # Mixins PostCSS
        │
        ├── layout/            # Layouts y estructuras
        │
        ├── components/        # Componentes reutilizables
        │
        └── pages/             # Estilos específicos por página
            ├── home.css
            └── contact.css
```

## 🚀 Comandos

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📝 Cómo agregar una nueva página:

1. Crear `nueva-pagina.html` en la raíz
2. Agregar entrada en `vite.config.ts`:
   ```ts
   input: {
     main: resolve(__dirname, 'index.html'),
     contact: resolve(__dirname, 'contact.html'),
     nueva: resolve(__dirname, 'nueva-pagina.html')  // ← nuevo
   }
   ```
3. Crear `/src/ts/nueva-pagina.ts`
4. Crear `/src/css/pages/nueva-pagina.css`
5. En el archivo TypeScript importar:
   ```ts
   import '../css/main.css';
   import '../css/pages/nueva-pagina.css';
   ```

## 🏗️ Arquitectura CSS:

La estructura CSS sigue una metodología modular y escalable:

- **`base/`** - Fundamentos: variables, elementos HTML base, media queries
- **`vendors/`** - Librerías externas: normalize, reset
- **`utilities/`** - Herramientas: mixins, animaciones, utilidades
- **`layout/`** - Estructuras de layout: header, footer, grid
- **`components/`** - Componentes UI reutilizables: botones, cards, modales
- **`pages/`** - Estilos específicos de cada página

## 🖊️ Tipografías instaladas con fontsource:

- **@fontsource-variable/geist** - Tipografía principal
- **@fontsource-variable/space-grotesk** - Tipografía para títulos

## 🎨 PostCSS Features utilizados:

- **postcss-nested** - Nesting como Sass
- **postcss-simple-vars** - Variables al estilo Sass
- **postcss-mixins** - Mixins reutilizables
- **postcss-preset-env** - Características CSS modernas

## Clases:

Estamos utilizando clases CSS para mantener la especificidad baja y facilitar la reutilización de estilos. Para dar nombres a las clases estamos usando una convención basada en BEM (Block Element Modifier), intentando mantener los nombres simples y descriptivos.

## Puedes ver cómo quedaría el proyecto final:

Ir a la carpeta de imágenes:
[imagenes del proyecto](./imagenes)

- `home-desktop.webp` - Vista de escritorio de la página principal
- `home-tablet.webp` - Vista tablet de la página principal
- `home-mobile.webp` - Vista móvil de la página principal
- `contact-desktop.webp` - Vista de escritorio de la página de contacto
- `contact-tablet.webp` - Vista tablet de la página de contacto
- `contact-mobile.webp` - Vista móvil de la página de contacto
