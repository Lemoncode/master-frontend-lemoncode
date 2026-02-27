# Tailwind tour

Vamos a hacer un tour rápido por las características principales de Tailwind CSS.

Para ello recorremos el post de cheatseet:

https://www.almabetter.com/bytes/cheat-sheet/tailwind

Vamos a borrar la parte de base y apply del css.

# Responsive design

Talwind nos ofrece prefijos como `sm:`, `md:`, `lg:`, `xl:` y `2xl:` para aplicar estilos específicos según el tamaño de la pantalla.

Los cortes por defecto son:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Un ejemplo de como funciona:

```html
<div
  class="text-3xl bg-blue-500 sm:bg-red-500 md:bg-green-500 lg:bg-yellow-500 xl:bg-purple-500 2xl:bg-pink-500"
>
  Este div cambia de color según el tamaño de la pantalla.
</div>
```

Fijate que para los tamaños usamas ":" en vez de "-":

- El guión forma parte del nombre de la utility class.
- Los dos puntos se usan para activar una condición:
  - reponsive (sm:, md:...).
  - Estados: (hover:, focus:...)
  - Soportes: (dark:, print:)

Algo menos hortera:

```html
<div class="text-sm md:text-lg lg:text-2xl">Responsive text size example.</div>
```

## Layout utilities

Nos permiten controlar el ancho, alto, display, posición:

- Width: w-1/2, w-full, w-screen
- Height: h-16, h-full, h-screen
- Display: block, inline-block, flex, grid

Un ejemplo:

```html
<div class="w-full h-48 bg-gray-200">Full-width container</div>
```

¿Qué estamos diciendo aquí?

- w-full: Que tome todo el ancho del contenedor padre: w -> width, full -> 100%
- h-48: Que tenga una altura fija de 12rem (48 \* 0.25rem) = 192 px
- bg-gray-200: Que tenga un fondo gris claro

Vamos a probar un poco... si ponemos `h-screen` en lugar de `h-48`, ¿qué pasa?

Pero y si ponemos `h-full`?

Resulta que el contenedor padre no tiene una altura definida, así que el `h-full` no tiene referencia para calcular su altura.

Sin embargo si hacemos:

```diff
<body>
- <div id="app">
+ <div id="app" class="h-screen">
  <div class="h-full bg-gray-200">Full-height container</div>
</body>
```

También podemos jugar con w-full, y w-80

Vamos a ver un flexbox:

```html
<div class="flex gap-4 bg-gray-100 p-4">
  <div class="bg-red-200 p-4">Item A</div>
  <div class="bg-red-300 p-4">Item B</div>
  <div class="bg-red-400 p-4">Item C</div>
</div>
```

Y un grid:

```html
<div class="grid grid-cols-3 gap-4 bg-gray-100 p-4">
  <div class="bg-yellow-200 p-4">1</div>
  <div class="bg-yellow-300 p-4">2</div>
  <div class="bg-yellow-400 p-4">3</div>
</div>
```

### Texto y fuentes

Aquí tenemos las variantes:

- Tamaño: text-sm, text-lg, text-2xl
- Peso: font-thin, font-bold, font-black
- Alineación: text-left, text-center, text-right
- Color: text-gray-500, text-red-600

```html
<p class="text-3xl font-semibold text-center text-gray-700">
  Texto de ejemplo con Tailwind CSS
</p>
```

### Color y colores de relleno

Tailwind tiene una paleta de colores predefinida que podemos usar fácilmente, con sus diferentes tonalidades.

```html
<div class="bg-blue-600 text-white p-4 rounded">
  Este div tiene un fondo azul oscuro y texto blanco.
</div>
```

> Te toca: ¿Cómo le añadiríamos margen?

## Bordes y sombras

Lo mismo, aquí tenemos:

- Bordes: border, border-2, border-red-500, rounded, rounded-lg
- Sombras: shadow, shadow-md, shadow-lg
- rounded: rounded-sm, rounded-md, rounded-lg, rounded-full
- shadow: shadow-sm, shadow-md, shadow-lg, shadow-xl

```html
<div class="border-2 border-gray-800 shadow-lg rounded-lg">Border y sombra</div>
```

> Te toca: Si da tiempo a probar: quiero que tenga ancho 40, alto 30, margen de 5 y que centre el texto

### Espaciado y tamaño

Lo mismo para margin y padding:

- Margin: m-4, mt-2, mb-6, mx-8, my-3
- Padding: p-4, pt-2, pb-6, px-8,

```html
<div class="m-4 p-2 bg-gray-300 -mt-2">
  Ejemplo de espaciado con margin y padding
</div>
```

> Ojo que aquí a margin top le ponemos un valor negativo: -mt-2 (el signo menos delante de la m)

Mapoe de clases a valores:

https://tailwindcss.com/docs/width

| Clase | REM      | PX  |
| ----- | -------- | --- |
| 0     | 0rem     | 0px |
| 0.5   | 0.125rem | 2px |
| 1     | 0.25rem  | 4px |
| 1.5   | 0.375rem | 6px |
| 2     | 0.5rem   | 8px |
| ...   | ...      | ... |

### Transiciones y animaciones

Tailwind también soporta transiciones y animaciones básicas:

```html
<div
  class="transition duration-500 ease-in-out transform hover:scale-150 text-center"
>
  Elemento animado
</div>
```

Tenemos aquí:

- Transition and duration: habilitar transiciones con transition y definir duración con duration-150, duration-300, duration-500

- hover:escala: hace el elemento más grande on hover.

- transform: habilita las transformaciones CSS (mover, rotar...)

También hay clases de animación:

```html
<div class="animate-bounce">Elemento animado</div>
```

Muy bien pero yo quiero hacerlo en el hover...

```html
<div class="hover:animate-bounce">Elemento animado</div>
```

## Cheat

sheets https://tailkits.com/blog/tailwind-css-cheat-sheet/

https://flowbite.com/tools/tailwind-cheat-sheet/
