# Home page

Vamos a añadir los estilos necesarios para la página de inicio del proyecto.

## 1. Vamos crear el background:

_css/base/elements.css_

```css
body {
  font-family: var(--font-body);
  color: var(--text-85);
  animation-name: page;
  animation-duration: 1s;
  line-height: 1.5;
  font-size: var(--fs-sm);
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: fixed;
    inset: 0;
    height: 100vh;
    background-color: var(--bg-app);
    background-image: radial-gradient(
      circle,
      var(--bg-dots) 1.5px,
      transparent 1.5px
    );
    background-size: 30px 30px;
    pointer-events: none;
    z-index: -1;
  }
}

main {
  flex-grow: 1;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-title);
  color: var(--text-90);
}
```

¿Qué estamos haciendo aquí?

- Definimos la tipografía base y colores.
- Añadimos una animación de entrada.
- Creamos un fondo con un patrón de puntos usando `::before`, y al dejarlo fixed, creamos un efecto de "parallax".
- Establecemos que el `<main>` crezca para ocupar el espacio disponible.
- Definimos estilos para los encabezados.

## 2. Vamos a por el layout general:

## 2.1 Clase container

Creamos un nuevo archivo:

_css/layout/container.css_

```css
@import '../base/media.css';

.container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding-left: var(--space-md);
  padding-right: var(--space-md);

  @media (--small-viewport) {
    padding-left: var(--space-xl);
    padding-right: var(--space-xl);
  }
  @media (--large-viewport) {
    padding-left: var(--space-big-2);
    padding-right: var(--space-big-2);
  }
}
```

Y lo importamos en el main.css, porque lo usaremos en varias páginas:

_css/main.css_

```css
@import './layout/container.css';
```

¿Para qué sirve?

- Centra el contenido y limita su ancho máximo.
- Añade padding horizontal para evitar que el contenido toque los bordes de la pantalla.
- Al elemento de html que le apliquemos esta clase, le daremos estas propiedades.

En la carpeta de layout, podemos eliminar el archivo .gitkeep, ya que ahora tenemos archivos.

## 2.2 Header

_css/layout/header.css_

```css
@import '../base/media.css';

.header {
  position: sticky;
  top: 0;
  background-color: var(--bg-app);
  border-bottom: 3px solid var(--border-color);
  z-index: 1;
}

.nav {
  display: flex;
  gap: var(--space-sm);
  padding-top: var(--space-md);
  padding-bottom: var(--space-md);
  @media (--small-viewport) {
    gap: var(--space-2xl);
  }
  &__list {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
    color: var(--text-90);
    @media (--small-viewport) {
      gap: var(--space-lg);
    }
  }
  &__link {
    font-weight: 600;
    transition: color 0.3s ease;
    @mixin hover {
      color: var(--accent-color-one);
      text-decoration: underline;
      text-underline-offset: 4px;
      text-decoration-thickness: 2px;
    }
    &--active {
      color: var(--accent-color-one);
      text-decoration: underline;
      text-underline-offset: 4px;
      text-decoration-thickness: 2px;
    }
  }
  &__logo {
    font-family: var(--font-title);
    font-size: var(--fs-md);
  }
}

/* Theme Toggle */
.theme-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 600;
  @media (--small-viewport) {
    gap: var(--space-md);
  }
  &__input {
    width: var(--space-md);
    height: var(--space-md);
    accent-color: var(--accent-color-one);
    cursor: pointer;
    @media (--small-viewport) {
      width: var(--space-lg);
      height: var(--space-lg);
    }
  }
}
```

Y lo importamos en el main.css, porque lo usaremos en varias páginas:

_css/main.css_

```diff
@import './layout/container.css';
+ @import './layout/header.css';
```

## 2.3 Footer

_css/layout/footer.css_

```css
@import '../base/media.css';

.footer {
  background-color: var(--accent-color-one);
  border-top: 3px solid var(--border-color);
  &__content {
    font-weight: 600;
    font-size: var(--fs-xs);
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    color: var(--text-contrast);
    padding-top: var(--space-md);
    padding-bottom: var(--space-md);
    gap: var(--space-sm);
    @media (--small-viewport) {
      flex-direction: row;
    }
  }

  &__social-links {
    @media (--small-viewport) {
      display: flex;
      gap: var(--space-lg);
    }
  }
  &__social-link {
    @mixin hover {
      color: var(--footer-link-hover);
      text-decoration: underline;
      text-underline-offset: 3px;
      text-decoration-thickness: 1.5px;
    }
  }
}
```

Y lo importamos en el main.css, porque lo usaremos en varias páginas:

_css/main.css_

```diff
@import './layout/container.css';
@import './layout/header.css';
+ @import './layout/footer.css';
```

## 3. Página específica: home.css

## 3.1 Estilos para el hero

_css/pages/home.css_

```css
@import '../base/media.css';

.hero {
  padding-top: calc(var(--padding-section) * 1.75);
  padding-bottom: var(--padding-section);

  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    color: var(--text-95);
    padding-left: var(--space-md);
    border-left: 3px solid var(--text-95);
    line-height: 1.2;
    font-weight: 700;

    @media (--small-viewport) {
      padding-left: var(--space-lg);
      border-width: 6px;
      gap: var(--space-lg);
    }

    span {
      display: block;
    }
  }

  &__title {
    font-size: var(--fs-3xl);
    text-transform: uppercase;
    font-family: var(--font-title);
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
    padding-top: var(--space-md);
    @media (--small-viewport) {
      gap: var(--space-xl);
      padding-top: 0;
    }
  }

  &__highlight {
    padding: 0 var(--space-sm);
    color: var(--bg-app);
    @media (--small-viewport) {
      padding: 0 var(--space-lg);
    }
    &--primary {
      background-color: var(--accent-color-one);
    }
    &--secondary {
      background-color: var(--accent-color-three);
    }
  }

  &__subtitle {
    font-family: var(--font-body);
    font-size: var(--fs-2xl);
    text-transform: none;
    line-height: auto;
    @media (--small-viewport) {
      line-height: 1.4;
    }

    &--accent {
      font-size: var(--fs-3xl);
      text-transform: uppercase;
      font-family: var(--font-title);
      line-height: 1.1;
      @media (--small-viewport) {
        line-height: 0.8;
      }
    }
  }
}
```

## 3.2 Estilos para la sección de artículos

Primero vamos a crear el componente card. En la carpeta de components, creamos un nuevo archivo:

_css/components/card.css_

```css
@import '../utilities/mixins.css';

.card {
  height: 100%;
  border: 3px solid var(--border-color);
  transition: all 0.3s ease;
  overflow: hidden; /* Prevent image overflow on hover */
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  font-size: var(--fs-xs);

  &__content {
    padding: var(--space-md);
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  &__title {
    font-size: var(--fs-md);
    line-height: 1.25;
    transition: all 0.3s ease;
  }

  &__image {
    flex-grow: 1;
    width: 100%;
    object-fit: cover;
    transition: all 0.3s ease;
  }

  @mixin hover {
    border: 3px solid var(--card-accent);
    box-shadow: var(--shadow-card);
    .card__title {
      color: var(--card-accent);
    }
    .card__image {
      transform: scale(1.05);
    }
  }
}
```

Y la importamos en la home.css:

_css/pages/home.css_

```diff
@import '../base/media.css';
+@import '../components/card.css';
```

En la carpeta de components, podemos eliminar el archivo .gitkeep, ya que ahora tenemos componentes.

Ahora sí, los estilos para la sección de artículos, los añadimos a continuación de los del hero:

_css/pages/home.css_

```css
.articles {
  container-type: inline-size;
  container-name: articles-section;
  padding-top: var(--padding-section);
  padding-bottom: var(--padding-section);

  &__header {
    max-width: 48ch;
    margin-bottom: var(--space-lg);
  }

  &__title {
    font-size: var(--fs-2xl);
    margin-bottom: var(--space-sm);
    text-transform: uppercase;
  }

  &__description {
    color: var(--text-90);
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
    gap: var(--space-xl);
    padding-top: var(--space-xl);
    padding-bottom: var(--space-xl);
    grid-auto-flow: dense;
  }

  &__item {
    container-type: inline-size;
    container-name: article-card;
    height: 100%;
    @container articles-section (min-width: 800px) {
      &:has(img) {
        grid-row: span 2;
        &:nth-child(4n) {
          grid-column: span 2;
          grid-row: span 1;
          .card {
            @container article-card (min-width: 400px) {
              flex-direction: row-reverse;
              & img {
                width: 50%;
                height: auto;
              }
            }
          }
        }
        &:nth-child(8n) {
          .card {
            @container article-card (min-width: 400px) {
              flex-direction: row;
            }
          }
        }
      }
    }
  }

  &__link {
    display: block;
    height: 100%;
  }
}
```

¿Qué estamos haciendo aquí?

- Definimos estilos para la sección de artículos, incluyendo el título y la descripción.
- Usamos CSS Grid para crear un diseño responsivo que se adapta al tamaño de la pantalla.
- Aplicamos reglas de contenedor para ajustar el diseño de las tarjetas en función del tamaño del contenedor padre y del propio elemento. Para conseguir un estilo "masonry" en el grid, hacemos que ciertos elementos ocupen más espacio en función de su posición (4º, 8º, etc.), y grid-auto-flow: dense; ayuda a que los espacios se rellenen de manera más eficiente.
