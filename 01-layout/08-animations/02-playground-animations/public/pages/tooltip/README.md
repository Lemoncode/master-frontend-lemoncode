# 3D Tooltip

🎯 Vamos a crear un **tooltip 3D** que aparezca de forma fluida, usando una animación más pulida y cuidada que las habituales. Para ello, haremos que se "voltee" hacia el usuario al hacer hover, usando `transform` 3D y `perspective`.

## 🚀 Tooltip con efecto 3D

#### HTML estructura

```html
<div class="knob">
  <div class="item tooltip">ℹ️ Lorem ipsum dolor sit amet, consectetur adipiscing elit...</div>
</div>
```

#### Estado inicial (oculto)

```css
.tooltip {
  translate: calc(-50% + var(--knob-size) / 2) calc(-100% - 1em);

  opacity: 0;
  transform: rotateX(90deg);
  transform-origin: bottom;
  transform-style: preserve-3d;

  transition-property: transform, opacity;
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

#### Perspectiva en el contenedor y estado _on hover_

```css
.knob {
  /* Perspectiva en el elemento padre para transformaciones 3D */
  perspective: 600px;
  perspective-origin: center top;

  &:hover .tooltip {
    opacity: 1;
    transform: rotateX(0deg);
  }
}
```

## 🔍 Conceptos Clave

**1. Perspectiva en el padre:** `perspective` debe estar en el elemento contenedor, no en el que se transforma.

**2. Estado inicial rotado:** `rotateX(90deg)` hace que el tooltip esté "acostado" (invisible desde arriba).

**3. Transform-origin:** `bottom` hace que la rotación ocurra desde la base del tooltip.

**4. Timing function:** El cubic-bezier con bounce crea un efecto natural de "volteo".
