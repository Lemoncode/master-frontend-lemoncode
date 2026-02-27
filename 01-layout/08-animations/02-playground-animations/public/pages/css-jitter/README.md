# _Jitter_ en animaciones CSS

🎯 En este ejercicio aprenderemos a crear **animaciones que no causen layout jitter o CSS jitter** usando la técnica del **placeholder** para mantener el espacio del elemento durante las transformaciones.

> "Una de las diferencias entre animaciones amateur y profesionales es el **layout jitter** - cuando los elementos animados empujan a otros elementos de su lugar, o entran en bucle de histéresis. Hoy aprenderemos a evitarlo completamente."

### El problema del Layout Jitter

- ❌ **Elementos que se mueven** afectan a sus vecinos
- ❌ **Layout recalculations** causan performance issues
- ❌ **Experiencia visual jarring** para el usuario
- ❌ **Elementos que 'saltan'** durante animaciones

### Ejemplo

```css
.item {
  transition: all 125ms ease-in-out;

  &:hover {
    /* ❌ Empuja a sus vecinos al hacer hover, layout recalc */
    width: 300px;
    /* ❌ Incluso peor, entramos en histéresis por el hover */
    width: 0;
  }
}
```

### Propiedades transicionables _layout-friendly_

```css
/* ✅ Estas NO causan layout recalculation porque no afectan al flujo del documento */
transform: translate(), scale(), rotate();
opacity: 0-1;
filter: blur(), brightness();

/* ❌ Estas SÍ causan layout jitter */
width, height, margin, padding;
top, left, right, bottom;
```

### Hover sigue siendo delicado

> Aún transicionando propiedades seguras, hay casos donde podría aparecer CSS jitter.

Hay que prestar atención a aquellos casos donde el hover dispara la animación y el elemento se desplaza, provocando que:

- Al desplazarse y salir fuera del cursor, se desactiva el hover.
- Al desactivarse el hover vuelve a su posición original.
- En la posición original, el hover se vuelve a disparar pues el cursor está encima.

```css
.item {
  transition: all 125ms ease-in-out;

  &:hover {
    scale: 0.1 0.1;
    translate: 0 -125%;
  }
}
```

## ✨ La solución: _placeholder container_

> "**Separar el espacio del contenido** - el _placeholder_ mantiene el layout, el _item_ se anima libremente."

```html
<div class="placeholder">
  <div class="item"></div>
</div>
```

## 📦 Ejercicio: Hover effect sin jitter

Para transformar el código propuesto con jitter, separaremos responsabilidades:

- `.placeholder` invisible para mantener el espacio (layout) y disparar la animación _on hover_.
- `.item` interno recibe la transformación.

```css
/* Solución sencilla con placeholder/container wrapper */
.placeholder {
  /* Importante ajustar la forma del placeholder idéntica a la del item */
  border-radius: 0.5em;
  /* Ayuda visual para reconocer el placeholder */
  background-color: #ffffff11;

  & .item {
    transition: all 125ms ease-in-out;
  }

  &:hover .item {
    scale: 0.1 0.1;
    translate: 0 -125%;
    border-radius: 50%;
  }
}
```

**🔍 Puntos clave:**

- **`placeholder`** = contenedor que se mantiene fijo
- **`item`** = elemento que se anima libremente
- **`translate: 0 -125%`** = mueve el item fuera de su espacio
- **`scale: 0.1 0.1`** = reduce drásticamente el tamaño

## 🎛️ Variaciones Creativas

### Escape lateral

```css
&:hover .item {
  scale: 0.2;
  translate: 200% 0;
  rotate: 360deg;
}
```

### _Shrink in place_

```css
&:hover .item {
  scale: 0.1;
  opacity: 0.3;
  filter: blur(2px);
}
```

### _Flip and fly_

```css
&:hover .item {
  scale: 0.1;
  translate: 0 -200%;
  rotate: 180deg;
  border-radius: 50%;
}
```

### _Morphing shapes_

```css
&:hover .item {
  scale: 0.05 2;
  translate: 0 -50%;
  border-radius: 2em;
}
```

### Efecto _melt_

```css
&:hover .item {
  scale: 1 0.1;
  translate: 0 50%;
}
```

### Efecto _explode_

```css
&:hover .item {
  scale: 3;
  opacity: 0;
  filter: blur(10px);
}
```
