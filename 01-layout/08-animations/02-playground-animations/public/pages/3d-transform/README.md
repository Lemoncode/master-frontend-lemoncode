# Transformaciones 3D en CSS

Las transformaciones 3D en CSS son un conjunto de propiedades que permiten **modificar la posición, orientación y perspectiva** de los elementos HTML dentro de un espacio tridimensional —es decir, con ancho (X), alto (Y) y profundidad (Z).

> A diferencia de las transformaciones 2D (que solo afectan a los ejes X e Y), las transformaciones 3D añaden un **tercer eje (Z)** que permite rotar, trasladar o escalar los elementos en profundidad, generando un efecto visual de volumen o perspectiva.

## 🧊 Ejercicio: Cubo 3D

### Punto de partida: 2D layout

En primer lugar, creamos un contenedor (.container) que agrupará las seis caras del cubo.
Cada cara se define con un div y un identificador único.

```html
<div class="container">
  <div id="front" class="item"><span>Front</span></div>
  <div id="back" class="item"><span>Back</span></div>
  <div id="right" class="item"><span>Right</span></div>
  <div id="left" class="item"><span>Left</span></div>
  <div id="top" class="item"><span>Top</span></div>
  <div id="bottom" class="item"><span>Bottom</span></div>
</div>
```

Antes de aplicar transformaciones 3D, damos estilo al contenedor y a las caras para que puedan posicionarse correctamente.
En este punto, las caras estarán dispuestas en un plano 2D como una cruz.

```css
.container {
  position: relative;
  width: var(--item-size);
  height: var(--item-size);
  left: calc(-1 * var(--item-size) / 2);
}

/* Disposición en plano 2D
(opcional, solo para visualizar la "net") */
#right {
  left: var(--item-size);
}
#left {
  right: var(--item-size);
}
#top {
  bottom: var(--item-size);
}
#bottom {
  top: var(--item-size);
}
#back {
  left: calc(var(--item-size) * 2);
}

/* Estilo general de las caras */
.item {
  position: absolute;
  border-radius: 0px;
  border: 1px dotted var(--highlight);
  box-sizing: border-box;
  cursor: default;
}
```

⚠️ En esta fase, todavía no hay profundidad ni rotaciones.
Simplemente estamos colocando cada cara en relación con el centro del contenedor para visualizar su posición en 2D.

### Transformación: Cubo 3D

- Usamos la propiedad `transform-style` en el contenedor para que los hijos mantengan su posición en 3D (si no, todos los hijos se 'aplastarían' contra el plano del contenedor).
- Añadimos un transform para rotar el sistema de coordenadas y ver nuestro contenedor en perspectiva isométrica (sin perspectiva)

> Cuando aplicamos transformaciones 3D en CSS, los ejes X, Y y Z coinciden inicialmente con la horizontal, la vertical y la profundidad de la pantalla, respectivamente. Sin embargo, al rotar un elemento, **sus ejes locales también rotan con él**, lo que significa que las siguientes transformaciones se aplicarán tomando como referencia la nueva orientación del elemento y no la del documento. Por eso, **el orden de las transformaciones es importante: cada rotación cambia la dirección de los ejes** y, por tanto, el resultado de las transformaciones que se apliquen después.

```diff
.container {
  position: relative;
  width: var(--item-size);
  height: var(--item-size);
  left: calc(-1 * var(--item-size) / 2);
+ transform-style: preserve-3d;
+ transform: rotateX(-30deg) rotateY(45deg);;
}
```

Mirando la pantalla y teniendo en mente donde se encuentran los ejes X, Y, Z del contenedor, rotamos todas las caras.

```css
#right {
  transform: rotateY(90deg);
}
#left {
  transform: rotateY(-90deg);
}
#top {
  transform: rotateX(90deg);
}
#bottom {
  transform: rotateX(-90deg);
}
#back {
  transform: rotateY(-180deg);
}
```

Vemos que las caras han rotado con respecto al centro del contenedor. Para que cada una tome su posición, habrá que moverlas una distancia igual a la mitad del ancho de la cara del cubo, todas en su correspondiente eje Z.

```css
#front {
  transform: translateZ(var(--half-size));
}
#right {
  transform: rotateY(90deg) translateZ(var(--half-size));
}
#left {
  transform: rotateY(-90deg) translateZ(var(--half-size));
}
#top {
  transform: rotateX(90deg) translateZ(var(--half-size));
}
#bottom {
  transform: rotateX(-90deg) translateZ(var(--half-size));
}
#back {
  transform: rotateY(-180deg) translateZ(var(--half-size));
}
```

Aplicamos un efecto de transparencia al `hover` de cada cara:

```css
.item {
  &:hover {
    opacity: 50%;
    background-color: var(--highlight);
  }
}
```

Si quitamos la propiedad transform del contenedor, el cubo deja de estar rotado en el espacio y la cámara vuelve a su vista por defecto, es decir, mirando de frente al plano Z.
En esta posición solo podemos ver la cara frontal y, si hacemos hover, la trasera, porque las demás caras (izquierda, derecha, superior e inferior) están alineadas perpendicularmente a la pantalla.

Esto no significa que el cubo se haya desconfigurado: las caras siguen ahí, pero al estar colocadas en ángulo recto respecto al plano de visión, lo único que vemos de ellas es su proyección, una línea muy delgada (su canto). En otras palabras, el cubo sigue siendo tridimensional, solo que lo estamos observando justo de frente, sin perspectiva.

- Veamos que ocurre entonces cuando aplicamos la perspectiva:

```diff
.container {
  --half-size: calc(var(--item-size) / 2);
  position: relative;
  width: var(--item-size);
  height: var(--item-size);
  left: calc(-1 * var(--item-size) / 2);
  transform-style: preserve-3d;
+ perspective: 8rem;
}
```

- Cambiamos el punto de fuga:

```diff
.container {
  --half-size: calc(var(--item-size) / 2);
  position: relative;
  width: var(--item-size);
  height: var(--item-size);
  left: calc(-1 * var(--item-size) / 2);
  transform-style: preserve-3d;
  perspective: 15rem;
+ perspective-origin: 10em 8em;
}
```

- Rcuperamos el transform del contenedor y aplicamos directamente la perspectiva.

> ⚠️ `perspective-origin` no funciona cuando usamos `perspective()` dentro de transform porque en ese caso la perspectiva se aplica dentro del propio elemento, no desde un punto de vista externo (la “cámara”), por lo que no existe un origen de perspectiva que mover.

```diff
.container {
  --half-size: calc(var(--item-size) / 2);
  position: relative;
  width: var(--item-size);
  height: var(--item-size);
  left: calc(-1 * var(--item-size) / 2);
  transform-style: preserve-3d;
- perspective: 15rem;
- perspective-origin: 10em 8em;
+ transform: perspective(15rem) rotateX(-30deg) rotateY(45deg);
}
```
