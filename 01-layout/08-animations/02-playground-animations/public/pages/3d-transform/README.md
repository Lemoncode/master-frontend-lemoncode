# Transformaciones 3D en CSS

Las transformaciones 3D en CSS se aplican mediante un conjunto de propiedades que permiten **modificar la posición, orientación y perspectiva** de los elementos HTML dentro de un espacio tridimensional —es decir, con ancho `X`, alto `Y` y profundidad `Z`.

> ⚡ A diferencia de las transformaciones 2D —que solo afectan a los ejes `X` e `Y`—, las transformaciones 3D añaden un **tercer eje `Z`** que permite rotar, trasladar o escalar los elementos en profundidad, generando un efecto visual de volumen o perspectiva.

## 🧊 Ejercicio: Cubo 3D

### 📐 Punto de partida: 2D layout

- En primer lugar, creamos un contenedor (`.container`) que agrupará las seis caras del cubo.
  Cada cara se define con un `div` y un identificador único. Además, añadiremos el nombre de cada cara en un `span`:

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

- Antes de aplicar transformaciones 3D, vamos a representar el desarrollo 2D del cubo —"_net_"— para lo que usaremos posicionamiento absoluto. Damos estilo al contenedor y a las caras para disponerlas en su posición, formando una cruz:

  ```css
  .container {
    position: relative;
    width: var(--item-size);
    height: var(--item-size);
    left: calc(-1 * var(--item-size) / 2);
  }

  /* Disposición en plano 2D (opcional, solo para visualizar la "net") */
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

  > ⚡ "En esta fase, todavía no hay profundidad ni rotaciones. Simplemente estamos colocando cada cara en relación con el centro del contenedor para visualizar su posición 2D."

### 🧊 Transformación en las 3 dimensiones

- Usamos la propiedad `transform-style` en el padre —contenedor— para que los hijos se rendericen en el espacio 3D del contenedor —sin esta propiedad, todos los hijos se proyectarían ('aplastarían') contra el plano del contenedor.
- Añadimos un `transform` para rotar el sistema de coordenadas y ver nuestro contenedor en proyección isométrica —sin perspectiva.

  > ⚠️ "**El orden de las transformaciones es crítico.** Cada transformación se aplica en el sistema de coordenadas resultante de la transformación anterior."
  >
  > Por defecto, al aplicar transformaciones, los ejes `X`, `Y` y `Z` están alineados con la horizontal, la vertical y la profundidad de la pantalla —_viewport_—, respectivamente. Sin embargo, al rotar un elemento, **sus ejes locales también rotan con él**, lo que significa que las transformaciones sucesivas se aplicarán tomando como referencia la nueva orientación del elemento y no la del documento. Por eso, **el orden de las transformaciones es importante: cada rotación cambia la dirección de los ejes** y, por tanto, el resultado de las transformaciones que se apliquen después.

  ```diff
  .container {
    position: relative;
    width: var(--item-size);
    height: var(--item-size);
  - left: calc(-1 * var(--item-size) / 2);

  + transform-style: preserve-3d;
  + transform: rotateX(-30deg) rotateY(45deg);
  }
  ```

- Mirando la pantalla y teniendo en mente donde se encuentran los ejes `X`, `Y`, `Z` del contenedor, rotamos todas las caras:

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

- 🔍 Vemos que las caras han rotado con respecto al centro del contenedor. Para que cada una tome su posición en el cubo, habrá que moverlas una distancia igual a la mitad del ancho de la cara del cubo, todas en su correspondiente eje `Z`.

  ```css
  /* Precalculamos la mitad de una cara */
  .container {
    --half-size: calc(var(--item-size) / 2);
  }

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

- Por último, aplicamos un efecto de transparencia al `hover` de cada cara:

  ```css
  .item {
    &:hover {
      opacity: 50%;
      background-color: var(--highlight);
    }
  }
  ```

### 👁️ Añadiendo perspectiva

- Si quitamos la propiedad `transform` del contenedor, el cubo deja de estar rotado en el espacio y la cámara vuelve a su vista por defecto, es decir, mirando de frente al plano Z.

  ```diff
  - transform: rotateX(-30deg) rotateY(45deg);
  ```

- En esta posición solo podemos ver la cara frontal y, si hacemos _hover_, la trasera, porque las demás caras (izquierda, derecha, superior e inferior) están alineadas perpendicularmente a la pantalla.

  > ⚡ "Esto no significa que el cubo se haya desconfigurado: las caras siguen ahí, pero al estar colocadas en ángulo recto respecto al plano de visión, lo único que vemos de ellas es su proyección, una línea muy delgada (su canto). En otras palabras, el cubo sigue siendo tridimensional, solo que lo estamos observando justo de frente, sin perspectiva."

- Veamos que ocurre entonces cuando aplicamos la perspectiva:

  ```diff
  .container {
    --half-size: calc(var(--item-size) / 2);
    position: relative;
    width: var(--item-size);
    height: var(--item-size);

    transform-style: preserve-3d;
  + perspective: 15rem;
  }
  ```

  > ⚡ `perspective` define la distancia entre el observador y el plano z=0, creando sensación de profundidad en transformaciones 3D. Cuanto menor es el valor, más fuerte es el efecto de perspectiva (los objetos lejanos parecen más pequeños).

- Y al desplazar el punto de fuga con `perspective-origin`:

  ```diff
  .container {
    --half-size: calc(var(--item-size) / 2);
    position: relative;
    width: var(--item-size);
    height: var(--item-size);

    transform-style: preserve-3d;
    perspective: 15rem;
  + perspective-origin: 10em 8em;
  }
  ```

  > ⚡ `perspective-origin` define la posición del punto de fuga en el plano de proyección. A efectos prácticos, se puede entender como el punto desde el cual el observador "mira" la escena 3D. Por defecto está en el centro (50% 50%).

- Recuperamos el transform del contenedor y aplicamos directamente la perspectiva.

  ```diff
  .container {
    --half-size: calc(var(--item-size) / 2);
    position: relative;
    width: var(--item-size);
    height: var(--item-size);

    transform-style: preserve-3d;
  - perspective: 15rem;
  - perspective-origin: 10em 8em;
  + transform: perspective(15rem) rotateX(-30deg) rotateY(45deg);
  }
  ```

  > ⚠️ `perspective-origin` no funciona cuando usamos `perspective()` dentro de transform porque en ese caso la perspectiva se aplica dentro del propio elemento, no desde un punto de vista externo (la “cámara”), por lo que no existe un origen de perspectiva que mover.
