# Animaciones Básicas con CSS

Vamos a explorar los **conceptos fundamentales** de la propiedad `animation` en CSS a través de 3 loaders prácticos y útiles.

> "Los loaders son perfectos para aprender animaciones: son **simples, útiles y se utilizan en todas partes**."

## 🌀 Ejercicio 1: Spinner rotatorio

> "El spinner es el loader más básico y común. Solo necesita **rotar 360°** continuamente."

**El truco del borde**: Hay un truco clásico consistente en pintar un borde con color sólido y su borde contiguo dejarlo transparente. La unión de ambos bordes queda de forma 'angulada'. Cuando se aplica un radio 50%, se forma un arco que va de mas a menos, simulando la estela de un cometa. Es muy empleado para hacer spinners rotatorios.

```css
.spinner {
  border-radius: 50%;
  border-top: 0.2em solid var(--theme-color);
  border-right: 0.2em solid transparent;
}
```

> 🎯 "Los _keyframes_ en CSS definen los pasos o etapas de una animación: indican cómo cambia un elemento a lo largo del tiempo (por ejemplo, su posición, color o tamaño) desde un estado inicial hasta uno final."

Añadimos unos _keyframes_ super sencillos para plasmar un giro completo:

```css
@keyframes rotate {
  from {
    rotate: 0turn;
  }
  to {
    rotate: 1turn;
  }
}
```

Y finalmente aplicamos la animación de dichos _keyframes_ indicando duración, timing-function e iteración infinita.

> ℹ️ [Animation shorthand](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation)

```css
.spinner {
  animation: rotate 1s linear infinite;
}
```

- `linear` = velocidad constante (perfecto para rotación)
- `infinite` = bucle continuo
- `0turn` y `1turn` = más semántico que grados

## ⚫⚫⚫ Ejercicio 2: _Dots_ progresivos (5 min)

> "Los dots añaden **timing escalonado** - cada punto empieza en un momento diferente (delay)."

En este caso, la animación base que queremos para cada _dot_ implica, partir de un punto pequeño y transparente, hasta llegar a uno grande y sin opacidad:

```css
/* prettier-ignore */
@keyframes pulse { 
  from { scale: 0.2; opacity: 0 } 
  to { scale: 1.4; opacity: 1; } 
}
```

**El secreto** está en añadir delays progresivos a cada _dot_ en la animación, para que arranque de forma escalonada:

```css
/* prettier-ignore */
.dots span {
    animation: pulse 600ms ease infinite alternate;
    /* Progressive delays using nth-child */
    &:nth-child(1) { animation-delay: 200ms; }
    &:nth-child(2) { animation-delay: 400ms; }
    &:nth-child(3) { animation-delay: 600ms; }
}
```

- `alternate` = va y viene automáticamente
- `animation-delay` = controla cuándo empieza cada animación

## 📡 Ejercicio 3: Radar avanzado

> "El radar combina **2 animaciones simultáneas**: el _beam_ rotatorio y el _target_ pulsante."

Para el _beam_ el truco está en usar un gradiente cónico para simular un barrido. En cuanto a animación, podemos reusar el `rotate` hecho anteriormente para el _spinner_.

```css
.radar .beam {
  background: conic-gradient(transparent, 340deg, var(--theme-color));
  animation: rotate 1.5s linear infinite;
}
```

Para simular que el radar encuentra un 'objetivo', vamos a trabajar con un simple _dot_. Podemos jugar con su escala y opacidad en las siguientes _keyframes_:

```css
/* prettier-ignore */
@keyframes alert { 
  0% { scale: 0.5; opacity: 1 } 
  10% { opacity: 1; } 
  20% { opacity: 0; scale: 3; } 
  100% { opacity: 0; scale: 3; } 
}
```

Basta con animarlo, en este caso empleando una función `ease-in` suavizada al comienzo pero acelerada hacia el final:

```css
.radar .target {
  animation: alert 1.5s ease-in infinite;
}
```

**🔥 Conceptos avanzados:**

- `conic-gradient()` = gradiente circular
- **Múltiples animaciones** en el mismo contenedor
- **Keyframes con múltiples pasos** (0%, 10%, 20%, 100%)
- **Sincronización** entre animaciones (misma duración)

## ℹ️ Anatomía de animation

```css
animation: name duration timing-function delay iteration-count direction fill-mode play-state;
```

- `name` → nombre de los @keyframes usados.
- `duration` → cuánto dura una iteración (ej. 2s, 500ms).
- `timing-function` → cómo progresa la animación (ej. ease, linear, cubic-bezier(...)).
- `delay` → cuándo empieza tras aplicarse (ej. 1s).
- `iteration-count` → cuántas veces se repite (1, 3, infinite).
- `direction` → dirección del ciclo (normal, reverse, alternate, etc.).
- `fill`-mode → qué estilo mantiene fuera del tiempo activo (none, forwards, backwards, both).
- `play-state` → si está corriendo o pausada (running, paused).

### Tips - Optimización de performance

- Usa `transform` y `opacity` (GPU accelerated)
- Evita animar `width`, `height`, `left`, `top`
