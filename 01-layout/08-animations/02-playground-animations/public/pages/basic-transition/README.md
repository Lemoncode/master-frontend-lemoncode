# Transiciones de CSS básicas

## 🧩 ¿Qué es `transition`?

La propiedad `transition` en CSS permite **animar cambios graduales** entre dos estados de un elemento (por ejemplo, al hacer `hover`, `focus` o incluso al cambiar una clase con JavaScript).

Sin `transition`, los cambios de estilo son **instantáneos**.  
Con `transition`, esos cambios ocurren **de forma suave y progresiva** durante un tiempo determinado.

## ⚙️ Sintaxis general

```css
/* Shorthand simple */
#selector {
  transition: <property> <duration> <timing-function> <delay>;
}

/* Shorthand compuesto */
#selector {
  transition: <transition shorthand 1>, <transition shorthand 2>, ..., <transition shorthand n>;
}

/* Propiedades independientes */
#selector {
  transition-property: background-color;
  transition-duration: 4s;
  transition-timing-function: ease;
  transition-delay: 2s;
}
```

### Parámetros

- `property`: la propiedad CSS que se va a animar (por ejemplo: _background-color_, _transform_, _opacity_, etc.). También se puede usar `all` para animar todos los cambios posibles, siempre que sean transicionables.
- `duration`: tiempo que dura la transición (por ejemplo: 200ms, 1s).
- `timing-function`: función que representa el progreso de la animación a lo largo del tiempo (por ejemplo: constante, con aceleracion, etc). [easings.net](https://easings.net/)
- `delay` (opcional): tiempo de espera antes de que empiece la transición (por ejemplo: 200ms).

## 🧠 Reglas clave

- Las transiciones solo se disparan cuando el valor de la propiedad css usada en el `transition` cambia (por ejemplo, en un `:hover`, `:focus`, o a través de clases aplicadas).
- Se pueden animar múltiples propiedades separándolas con comas o usando `all` como _property_ del `transition` (en lugar de una propiedad específica de css).
- No todas las propiedades son transicionables (por ejemplo, display no lo es).

### Propiedades transicionables

> ⚡ En general, solo las propiedades que tienen **valores interpolables** (es decir, pueden variar de forma continua entre un punto inicial y uno final) podrán ser transicionadas.

- ✅ Transicionables: propiedades con valores como números, colores, longitudes, transformaciones, sombras, transparencias, etc.
- ❌ No transicionables: propiedades con valores discretos o no numéricos, como `display`, `visibility`, `overflow`, `cursor`, `font-family`, etc.

## 📦 Ejercicio: transiciones básicas

```css
/* Cambia color */
#sq1 {
  transition: background-color 500ms ease;
  &:hover {
    background-color: var(--highlight);
  }
}

/* Cambia forma */
#sq2 {
  transition: border-radius 400ms ease-in-out;
  &:hover {
    border-radius: 50%;
  }
}

/* Cambia escala */
#sq3 {
  transition: transform 250ms ease-out;
  &:hover {
    transform: scale(1.1);
  }
}

/* Cambia opacidad */
#sq4 {
  transition: opacity 200ms ease;
  &:hover {
    opacity: 0.5;
  }
}

/* Múltiples cambios / "all" */
#sq5 {
  --item-size: 6em;
  transition: transform 300ms ease, background-color 300ms ease-out, box-shadow 300ms ease-in-out;
  /* transition: all 300ms ease-in-out; */

  &:hover {
    transform: scale(1.3);
    background-color: var(--highlight);
    box-shadow: 0 0 20px 0px rgba(255, 255, 255, 0.35);
  }
}
```

### 🔍 Curiosidad: transición en ambas direcciones vs entrada/salida

Supongamos que una propiedad cambia al hacer `:hover`.

Por defecto, una transición definida en el estado base, **controla ambas direcciones**:

- Al entrar al `:hover`. Se aplicará en sentido directo.
- Al salir del `:hover`. Se aplicará en sentido inverso.

Sin embargo, podemos redefinir la transición dentro del `:hover`, en cuyo caso tendremos 2 transiciones diferenciadas:

- La de **entrada** que usa la transición del `:hover`.
- La de **salida** que usa la transición definida en el estado base.

En otras palabras, cuando se hace esto, **la transición activa es la que existe en el estado actual del elemento**.

> ℹ️ Este comportamiento es inherente **al modelo de cascada y herencia en CSS**.

## ⚠️ Patrón accesibilidad

La media query `prefers-reduced-motion` permite detectar si el usuario ha indicado en su sistema operativo o navegador que prefiere reducir el movimiento o las animaciones por motivos de accesibilidad (mareos, vértigo, atención, etc.).

> 👍 "Es buena práctica utilizar esta media query para ajustar nuestras animaciones a la preferencia del usuario".

Cuando esta preferencia está activa (`reduce`), lo habitual es desactivar animaciones y transiciones para todos los elementos, y ofrecer estilos alternativos sin ellas.

> "El uso de `!important` garantiza que esta regla sobrescriba cualquier transición definida en otras partes del CSS."

```css
@media (prefers-reduced-motion: reduce) {
  /* Estilos alternativos con menos movimiento */
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

> "En resumen, `prefers-reduced-motion` es una media query de accesibilidad que adapta la experiencia para usuarios que no desean animaciones intensas o continuas."
