# 03 Importar

En esta muestra vamos a empezar a trabajar con los módulos ES6 (importar).

Empezaremos con el ejemplo _02 Boilerplate_ y añadiremos un nuevo servicio de JavaScript que
mantendrá un simple algoritmo para calcular la media de puntos de un array.

Usaremos este array de JavaScript en el archivo principal students.js, importandolo.

Resumen:

- Agregar un nuevo archivo `averageService.js`
- Añade una matriz en `students.js`
- Importa el servicio promedio en `students.js`
- Usa las características del servicio promedio dentro del código `students.js`
- Transpilar y probar en `index.html`

# Pasos para construirlo

## Requisitos previos

Necesitarás tener instalado Node.js (al menos v8.9) en tu ordenador. Para poder seguir las guías de este paso, también necesitarás tomar el ejemplo _01 BoilerPlate_ como punto de partida.

## Pasos

- `npm install` para instalar las dependencias de muestra anteriores:

```
npm install
```

- Añadamos un nuevo archivo llamado `averageService.js`. Este archivo contendrá una función que calculará el valor promedio de un array dado, esta función será exportada (haciéndola visible a otros módulos que necesiten usarla). Por lo tanto, añade el siguiente contenido a `averageService.js`:

_./averageService.js_

```javascript
export function getAvg(scores) {
  return getTotalScore(scores) / scores.length;
}

function getTotalScore(scores) {
  return scores.reduce((score, count) => score + count);
}
```

- Actualicemos `students.js` para importar el archivo anterior y usarlo:

_./students.js_

```diff
-  // Usemos algunas características de ES6
+  import { getAvg } from './averageService';

+  const scores = [90, 75, 60, 99, 94, 30];
-  const averageScore = "90";
+  const averageScore = getAvg(scores);

  const messageToDisplay = `average score ${averageScore}`;

  document.write(messageToDisplay);
```

- Por último, vamos a ejecutar webpack desde la línea de comandos ejecutando el siguiente comando:

```
npm start
```

Es hora de hacer doble clic en el `index.html` y comprobar que la nueva función de promedio está en marcha y ha sido incluida en el archivo `bundle.js`.

## Apéndice - Módulo de uso alternativo

En nuestro ejemplo anterior hemos cubierto un solo uso nombrado de exportación, pero hay otras formas de usar módulos:

### Exportación por defecto

Una forma popular es usar **`export default`** como la palabra clave de exportación. Esto indicará que, por defecto, sólo habrá una **exportación única por módulo**. Entonces, podremos usar directamente un importar _alias_ (omitiendo las llaves {}) y esto apuntará a nuestro elemento exportado por defecto (función _averarge_ en nuestro ejemplo).

- Uso de la exportación por defecto en `averageService.js`:

_./averageService.js_

```diff
- export function getAvg(scores) {
+ export default function getAvg(scores) {
return getTotalScore(scores) / scores.length;
}

function getTotalScore(scores) {
  return scores.reduce((score, count) => {
    return score + count;
  });
}

```

- Uso de importar por defecto en `students.js`:

_./students.js_

```diff
- import {getAvg} from "./averageService";
+ import getAvg from "./averageService";

const scores = [90, 75, 60, 99, 94, 30];
const averageScore = getAvg(scores);

const messageToDisplay = `average score ${averageScore}`;

document.write(messageToDisplay);
```nt.write(messageToDisplay);
```

### Multiple named exports

Consideremos dos funciones, _getAvg_ y _getTotalScore_, por el bien de este ejemplo. Podemos exportar ambas usando exportaciones nombradas, sólo añadiendo la palabra clave **export** en cada función.

- Uso de múltiples exportaciones en `averageService.js`:

_./averageService.js_

```diff
- export default function getAvg(scores) {
+ export function getAvg(scores) {
return getTotalScore(scores) / scores.length;
}

- function getTotalScore(scores) {
+ export function getTotalScore(scores) {
  return scores.reduce((score, count) => {
    return score + count;
  });
}
```

Ahora, podemos importarlos de varias maneras en `students.js`:

- Importar ambos elementos en el ámbito actual:

`_./students.js_

```diff
- import getAvg from "./averageService";
+ import {getAvg, getTotalScore} from "./averageService";

const scores = [90, 75, 60, 99, 94, 30];
const averageScore = getAvg(scores);
+ const totalScore = getTotalScore(scores);

- const messageToDisplay = `average score ${averageScore}`;
+ const messageToDisplayAvg = `average score ${averageScore} `;
+ const messageToDisplayTotal = `total score ${totalScore}`;

- document.write(messageToDisplay);
+ document.write(messageToDisplayAvg);
+ document.write(messageToDisplayTotal);

```

- Importa el contenido de todo el módulo usando el comodín `*` y un _name_ para nuestro módulo. Este _name_ contendrá todos los elementos exportados en nuestro ámbito actual (se utiliza _name_ como espacio de nombres):

_./students.js_

```diff
- import {getAvg, getTotalScore} from "./averageService";
+ import * as averageService from "./averageService";

const scores = [90, 75, 60, 99, 94, 30];
- const averageScore = getAvg(scores);
- const totalScore = getTotalScore(scores);
+ const averageScore = averageService.getAvg(scores);
+ const totalScore = averageService.getTotalScore(scores);

const messageToDisplayAvg = `average score ${averageScore} `;
const messageToDisplayTotal = `total score ${totalScore}`;

document.write(messageToDisplayAvg);
document.write(messageToDisplayTotal);
```

# Acerca de Basefactor + Lemoncode

Somos un equipo innovador de expertos en Javascript, apasionados por convertir sus ideas en productos robustos.

[Basefactor, consultoría de Lemoncode](http://www.basefactor.com) proporciona servicios de consultoría y entrenamiento.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provee servicios de entrenamiento.

Para la audiencia de LATAM/España estamos haciendo un Master Online en Front End, más información: http://lemoncode.net/master-frontend