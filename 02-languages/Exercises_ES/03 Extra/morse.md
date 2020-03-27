# Morse

Vamos a crear... ¡un transmisor Morse!

## Descripción

El ejercicio consiste en, dado cualquier mensaje de entrada, representar por consola el estado de las señales morse que resultan de transmitir dicho mensaje. Para facilitarte la tarea piensa en la típica bombilla de un transmisor morse:

- Cuando recibe un punto, se enciende brevemente.
- Cuando recibe una raya, se enciende más prolongadamente.
- El tiempo que la bombilla permance apagada ayuda a discernir la separación entre letras y también entre palabras.

Por tanto, la salida por consola será una sucesión de estados: `ON`/`OFF`, `Encendido`/`Apagado`, `1`/`0`, como prefieras.

## Implementación

Para ello tendremos que implementar una factoría de transmisores. Recuerda que una factoría es una función que devuelve un objeto o clase. Esa decisión es a tu,
la entidad transmisor podrá ser objeto o clase, como prefieras. Esta factoría necesita una serie de "ingredientes" para configurar el transmisor:

- Un mapa que traduzca de carácter a su representación morse. Sírvete del objeto auxiliar `morseAlphabet` que se adjunta más abajo.
- Una función que implemente un mecanismo de timeout para espaciar los símbolos a transmitir. Este mecanismo será como un setTimeout con la diferencia de que en lugar de tomar milisegundos como entrada, será el número de puntos a esperar. Un punto, como explicaremos más abajo, es la unidad temporal básica de referencia.
- Un función `writer` que será la encargada de escribir por consola el estado de nuestra bombilla. Usa `ON`/`OFF`, `1`/`0` o lo que prefieras.
- Un callback para cuando el mensaje se haya terminado de transmitir completamente. La entidad transmisor deberá tener una función para transmitir el mensaje deseado, que admita dicho mensaje como parámetro.

### NOTA

Utiliza Typescript y proporciona un tipado lo más completo posible.

## Timing

La unidad temporal de referencia será la duración de 1 punto en lugar de trabajar en milisegundos. La duración real en ms. de dicho punto es a tu elección, puede ser de 50ms o de 1seg. si estás haciendo pruebas y quieres ir despacio. Dicho esto deberás saber que, en morse:

- La duración de 1 punto es la referencia temporal.
- Las rayas duran 3 puntos.
- La separación entre cada punto o cada raya es también de 1 punto.
- La separación entre letras es de 3 puntos.
- La separación entre palabras es de 7 puntos.

Más info sobre el código Morse:
https://en.wikipedia.org/wiki/Morse_code

## Objeto auxiliar

```js
const morseAlphabet = {
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "!": "-.-.--",
  "-": "-....-",
  "/": "-..-.",
  "@": ".--.-.",
  "(": "-.--.",
  ")": "-.--.-",
};
```
