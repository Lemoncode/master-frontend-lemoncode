# Scroll-Driven Animations

> "Tradicionalmente, animar elementos en función del scroll requería JavaScript complejo."

Las **scroll-driven animations** son una nueva especificación de CSS que permite crear animaciones controladas por el scroll del usuario, sin necesidad de JavaScript.

> 🚀 "Representan el **futuro de las animaciones scroll** en CSS - sin JavaScript, mejor performance, más declarativo."

## 📜 Concepto Fundamental

> 🎯 A diferencia de las animaciones tradicionales **basadas en tiempo**, las _scroll-driven animations_ hacen que la animación progrese en función del scroll.

Hay 2 tipos de _scroll-driven animations_:

- `scroll()` **Basado en la posición del contenedor _scrollable_**.

  > La animación progresa según **cuánto has scrolleado** en el contenedor. Útil para elementos/efectos globales tipo _progress bars_, _parallax_, etc.

- `view()` **Basado en la entrada/salida de cada elemento en el viewport**.
  > La animación progresa según **cuándo el elemento entra y sale** del viewport. Ùtil para animar elementos individuales de la lista.

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

## ⚠️ Importante: Compatibilidad

⚠️ **Característica experimental**: Requiere verificación de soporte del navegador.

```css
@supports (animation-timeline: scroll()) {
  /* Tu código de scroll-driven animation aquí */
  /* Solo se aplica si el navegador lo soporta */
}
```

## 📄 Ejercicio: Lista animada por scroll

Comenzamos por los _keyframes_.

> 🎨 Efecto visual: Cada elemento empieza pequeño y opaco, crece y se vuelve bold al llegar al centro, y vuelve a encogerse al salir."

```css
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
```

Y acabamos configurando la animación, envuelta en nuestra guarda de seguridad:

```css
@supports (animation-timeline: scroll()) {
  .list-item {
    animation: scroll-highlight cubic-bezier(0.5, 0, 0.5, 1);
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
}
```

## 💡 Conceptos Clave para Recordar

### 1. **Nuevas propiedades CSS:**

- `animation-timeline` = qué controla la animación
- `animation-range` = cuándo empieza y termina
- `@supports` = detección de compatibilidad

### 2. **Timing functions automáticos:**

> "No necesitamos `duration` - el scroll del usuario **ES** la duración."

### 3. **Performance nativa:**

> "El navegador optimiza estas animaciones automáticamente - mejor performance que JavaScript."

## Características destacadas

1. ✅ **Sin JavaScript** - Nativo de CSS
2. ✅ **Mejor rendimiento** - Optimizado por el navegador
3. ✅ **Control granular** - Con `animation-range`
4. ⚠️ **Soporte limitado** - Característica nueva, verificar compatibilidad
5. ✅ **Accesible** - Respeta `prefers-reduced-motion`
