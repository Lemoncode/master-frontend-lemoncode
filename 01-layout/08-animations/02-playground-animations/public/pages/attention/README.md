# Timing Functions Avanzadas

Las **timing functions** nos permiten crear animaciones realistas con muy pocos keyframes, imitando la física real sin complejidad. Gracias a ellas, podemos describir movimientos cotidianos en forma de función, y aplicarlo a cualquier animación.

> ⚠️ Si no contáramos con ellas, crear animaciones realistas requería cientos de keyframes, pues habría que trabajar de manera tradicional como en una película de animación. Con CSS moderno podemos lograr el mismo efecto con **2 keyframes + timing functions inteligentes**

```css
/* ❌ Método tradicional: muchos keyframes */
@keyframes bounce-old {
  0% {
    transform: translateY(-200px);
  }
  10% {
    transform: translateY(-150px);
  }
  20% {
    transform: translateY(-100px);
  }
  30% {
    transform: translateY(-70px);
  }
  /* ... 50+ keyframes más ... */
  100% {
    transform: translateY(0);
  }
}
```

## 🏀 Ejercicio 1: Pelota que rebota

> "En el mundo real, una pelota rebota **perdiendo energía gradualmente** en cada bote."

Pero empecemos simple, y dejemos la simulación realista del movimiento para la timing function.
Si simplificamos su trayectoria, la pelota parte de cierta altura y acaba en el suelo, es decir, se desplaza de H1 a H0. En la práctica, los keyframes fundamentales podrían ser algo asi:

```css
/* prettier-ignore */
@keyframes drop {
  from { translate: 0 -200%; }
} /* to: implícito = 0 */
```

**La magia está en el timing**.
Apliquemos ahora la función `--timing-bounce` para animar nuestros keyframes. Esta función reproduce un movimiento de rebote realista simulado a partir de una función lineal. Extraida de [EasingWizard](https://easingwizard.com/)

```css
#ball {
  animation: drop 2.5s var(--timing-bounce) infinite;
}
```

> 🎯 Punto clave: Solo 2 keyframes (inicio y fin). La función `--timing-bounce` simula **todos los rebotes intermedios**.

## ⏰ Ejercicio 2: Despertador que tiembla

> "Un despertador no vibra linealmente, sino con **oscilaciones irregulares**, que van decreciendo en intensidad."

De nuevo, simplifiquemos su movimiento a la mínima expresión: balanceo leve hasta 10 grados, para lo que modificaremos el origen de la transformación.

```css
/* prettier-ignore */
@keyframes wobble {
  from { transform-origin: 50% 200%; rotate: 0deg; }
  to { transform-origin: 50% 200%; rotate: 10deg; }
}
```

Apliquemos otra función simulada con [EasingWizard](https://easingwizard.com/) llamada `--timing-wiggle` que imitia el efecto deseado. Esta función hará que la animación alcance el estado final (10deg) en numerosas ocasiones, decreciendo en energía, y parándose finalmente:

```css
#clock {
  animation: wobble 1s var(--timing-wiggle) infinite;
}
```

> 🎯 Crear esta vibración con keyframes tradicionales... ¡necesitaría 50+ pasos!

## ❤️ Ejercicio 3: Corazón con latido

> "Los efectos de 'resplandor' naturales no son lineales, tienen **elasticidad** como un muelle."

La animación básica en este caso consiste en plantear 2 sombreados para el momento de mínima y máxima intensidad:

```css
/* prettier-ignore */
@keyframes glow-flash {
  0% { text-shadow: 0 0 5px #ff4b4b4d; }
  100% { text-shadow: 0 0 25px #c7294e; }
}
```

Y le damos un timing orgánico, basado en un movimiento elástico (muelle):

```css
#heart {
  animation: glow-flash 1s var(--timing-spring) infinite;
}
```

## 💡 Conceptos Clave para Recordar

### Separación de responsabilidades

- **Keyframes** = ¿QUÉ cambia? (posición, color, escala)
- **Timing Functions** = ¿CÓMO cambia? (velocidad, aceleración, rebotes)

### Ventajas del approach moderno

- ✅ **Menos código** (2 keyframes vs 50+)
- ✅ **Más realismo** (basado en física real)
- ✅ **Mejor performance** (navegador optimiza)
- ✅ **Más mantenible** (cambias el timing, no 50 keyframes)

### Cuándo usar cada timing

- **Bounce**: Objetos que caen, pelotas, elementos físicos
- **Wiggle**: Vibraciones, alertas, notificaciones
- **Spring**: Efectos suaves, transiciones orgánicas, UI moderna

## 🛠️ Recursos

> "Estas timing functions no las inventamos nosotros. Usamos herramientas profesionales:"

- **[Easing Wizard](https://easingwizard.com/)** - Genera timing functions visuales
- **[Cubic-bezier.com](https://cubic-bezier.com/)** - Editor clásico
- **[Easings.net](https://easings.net/)** - Biblioteca de efectos
