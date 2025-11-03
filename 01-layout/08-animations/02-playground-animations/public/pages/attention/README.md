# Timing Functions Avanzadas - Guión de Clase

## 🎯 Objetivo del Ejercicio

Demostrar cómo las **timing functions** nos permiten crear animaciones realistas con pocos keyframes, imitando la física real sin complejidad.

## 🎬 Introducción (2-3 min)

> "Tradicionalmente, crear animaciones realistas requería cientos de keyframes, como en una película de animación. Hoy veremos cómo CSS moderno nos permite lograr el mismo efecto con **2 keyframes + timing functions inteligentes**."

### Mostrar el problema clásico:

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

## 🏀 Demo 1: Pelota que Rebota (5 min)

> "Observen cómo una pelota real rebota: **pierde energía gradualmente** en cada rebote."

### Código simple:

```css
@keyframes drop {
  from {
    translate: 0 -200%;
  }
  /* to: implícito = 0 */
}
```

### La magia está en el timing:

```css
animation: drop 2.5s var(--timing-bounce) infinite;
```

**🔍 Punto clave:**

> "Solo 2 keyframes (inicio y fin), pero el `--timing-bounce` simula **todos los rebotes intermedios**."

## ⏰ Demo 2: Despertador que Tiembla (3 min)

> "Un despertador no vibra linealmente, sino con **oscilaciones irregulares** que van perdiendo intensidad."

### Keyframes mínimos:

```css
@keyframes wobble {
  from {
    rotate: -5deg;
  }
  to {
    rotate: 5deg;
  }
}
```

### Timing complejo:

```css
animation: wobble 1s var(--timing-wiggle) infinite;
```

**🎯 Enfoque pedagógico:**

> "Imaginen crear esta vibración con keyframes tradicionales... ¡necesitarían 50+ pasos!"

## ❤️ Demo 3: Corazón con Efecto Muelle (3 min)

> "Los efectos de 'glow' naturales no son lineales, tienen **elasticidad** como un muelle."

### Animación básica:

```css
@keyframes glow-flash {
  0% {
    text-shadow: 0 0 5px rgba(255, 75, 75, 0.3);
  }
  100% {
    text-shadow: 0 0 25px rgb(199, 41, 78);
  }
}
```

### Timing orgánico:

```css
animation: glow-flash 1s var(--timing-spring) infinite;
```

## 🛠️ Herramientas Profesionales (2 min)

> "Estas timing functions no las inventamos nosotros. Usamos herramientas profesionales:"

- **[Easing Wizard](https://easingwizard.com/)** - Genera timing functions visuales
- **[Cubic-bezier.com](https://cubic-bezier.com/)** - Editor clásico
- **[Easings.net](https://easings.net/)** - Biblioteca de efectos

## 💡 Conceptos Clave para Recordar

### 1. **Separación de responsabilidades:**

- **Keyframes** = ¿QUÉ cambia? (posición, color, escala)
- **Timing Functions** = ¿CÓMO cambia? (velocidad, aceleración, rebotes)

### 2. **Ventajas del approach moderno:**

- ✅ **Menos código** (2 keyframes vs 50+)
- ✅ **Más realismo** (basado en física real)
- ✅ **Mejor performance** (navegador optimiza)
- ✅ **Más mantenible** (cambias el timing, no 50 keyframes)

### 3. **Cuándo usar cada timing:**

- **Bounce**: Objetos que caen, pelotas, elementos físicos
- **Wiggle**: Vibraciones, alertas, notificaciones
- **Spring**: Efectos suaves, transiciones orgánicas, UI moderna

## 🎯 Ejercicio Práctico (10 min)

> "Ahora experimenten ustedes:"

1. **Modificar** los valores de timing existentes
2. **Crear** una nueva animación usando `--timing-spring`
3. **Comparar** el efecto con `ease-in-out` tradicional

### Pregunta para reflexionar:

> "¿Cuántos keyframes habrían necesitado para recrear el efecto de rebote de la pelota manualmente?"

## 🚀 Conclusión (1 min)

> "Las timing functions modernas nos permiten **pensar como animadores profesionales**: definir el movimiento esencial y dejar que las matemáticas generen el realismo físico."

**Mensaje final:**

> "En proyectos reales, esto marca la diferencia entre animaciones que se sienten 'artificiales' y animaciones que se sienten **naturales y profesionales**."

---

## 📚 Recursos Adicionales

### Documentación técnica:

- [MDN: animation-timing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function)
- [CSS Linear() Function Spec](https://drafts.csswg.org/css-easing-2/#linear-easing-function)

### Herramientas recomendadas:

- [Linear Easing Generator](https://linear-easing-generator.netlify.app/)
- [CSS Easing Functions Cheat Sheet](https://easings.net/)

### Ejemplos de timing functions predefinidas:

```css
/* Básicas */
ease: cubic-bezier(0.25, 0.1, 0.25, 1);
ease-in: cubic-bezier(0.42, 0, 1, 1);
ease-out: cubic-bezier(0, 0, 0.58, 1);
ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);

/* Avanzadas (Material Design) */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
--ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
--ease-accelerate: cubic-bezier(0.4, 0, 1, 1);
```
