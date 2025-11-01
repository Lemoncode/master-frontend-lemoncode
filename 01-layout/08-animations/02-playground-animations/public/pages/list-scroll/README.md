# CSS Scroll-Driven Animation

Las **scroll-driven animations** son una nueva especificación de CSS que permite crear animaciones controladas por el scroll del usuario, sin necesidad de JavaScript.

## ¿Qué son?

A diferencia de las animaciones tradicionales basadas en tiempo, las scroll-driven animations se ejecutan en función de:

1. **La posición de scroll del contenedor** - `scroll()`
2. **Cuándo un elemento entra/sale del viewport** - `view()`

## Sintaxis básica

### Animación basada en scroll del contenedor

```css
.element {
  animation: my-animation linear;
  animation-timeline: scroll(nearest); /* Basado en scroll position respecto al total del scroll */
}
```

### Animación basada en visibilidad del elemento

```css
.element {
  animation: my-animation linear;
  animation-timeline: view(); /* Basado en entrada/salida del viewport visible del scroll area */
}
```

## Propiedades principales

### `animation-timeline`

Define qué tipo de timeline controla la animación:

```css
animation-timeline: scroll(); /* Scroll del viewport */
animation-timeline: scroll(nearest); /* Scroll del contenedor más cercano */
animation-timeline: view(); /* Visibilidad del elemento */
```

### `animation-range`

Controla cuándo inicia y termina la animación dentro del timeline:

```css
animation-range: entry 0% exit 100%; /* Desde que entra hasta que sale */
animation-range: contain 25% contain 75%; /* Solo cuando está 25%-75% visible */
animation-range: entry 50%; /* Solo desde 50% de entrada */
```

## Valores de `animation-range`

### Puntos de referencia:

- **`entry`**: Cuando el elemento empieza a entrar al viewport
- **`exit`**: Cuando el elemento empieza a salir del viewport
- **`contain`**: Cuando el elemento está completamente dentro del viewport
- **`cover`**: Todo el rango desde entry hasta exit

### Porcentajes:

- `0%` = Justo empieza la fase
- `50%` = Mitad de la fase
- `100%` = Termina la fase

## Compatibilidad

⚠️ **Característica experimental**: Requiere verificación de soporte del navegador.

```css
@supports (animation-timeline: scroll()) {
  /* Tu código de scroll-driven animation aquí */
}
```

## 📄 Ejemplo práctico

### Animación que escala elementos según visibilidad

```css
@supports (animation-timeline: scroll()) {
  .list-item {
    animation: scroll-highlight cubic-bezier(0.5, 0, 0.5, 1) both;
    animation-timeline: view();
    /* Check difference */
    /* animation-timeline: scroll(nearest);  */

    /* Fine grain control to adjust entry and exit of each element in the
    scroll viewport. Meaning: 
     - entry 0% => start animation when element first starts to enter scroll viewport (0% progress).
     - exit 100% => stort animation when element has completely exited scroll port (100% out) */
    animation-range: entry 0% exit 100%;
    /* You can narrow the area where the animation happens with something like */
    /* animation-range: cover 30% cover 70%; */
  }

  @keyframes scroll-highlight {
    0% {
      transform: scale(0.5);
      opacity: 0.2;
      font-weight: 300;
    }

    40% {
      font-weight: 300;
    }

    50% {
      /* Máximo en el centro */
      transform: scale(1.8);
      opacity: 1;
      font-weight: 700;
    }

    60% {
      font-weight: 300;
    }

    100% {
      transform: scale(0.5);
      opacity: 0.2;
    }
  }
}
```

## Características destacadas

1. ✅ **Sin JavaScript** - Nativo de CSS
2. ✅ **Mejor rendimiento** - Optimizado por el navegador
3. ✅ **Control granular** - Con `animation-range`
4. ⚠️ **Soporte limitado** - Característica nueva, verificar compatibilidad
5. ✅ **Accesible** - Respeta `prefers-reduced-motion`

## Casos de uso comunes

- **Parallax effects** - Elementos que se mueven a diferentes velocidades
- **Progress indicators** - Barras de progreso de lectura
- **Reveal animations** - Elementos que aparecen al hacer scroll
- **Text highlighting** - Resaltar texto mientras scrolleas
- **Image transitions** - Cambios suaves en imágenes
