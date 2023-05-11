import * as _ from 'lodash';

// camelCase
// Convierte un string a formato camelCase
console.log(_.camelCase('What does the fox say?'));
// whatDoesTheFoxSay


// capitalize
// Pone la primera letra en mayúscula de cada palabra y el resto en minúscula
console.log(_.capitalize('what does the fox say?'));
// What does the fox say ?


// deburr
// Elimina tildes y signos de las palabras
console.log(_.deburr('pingüino'));
// pinguino


// escape
// Transforma los &, <, >, ' y " a entidades html
console.log(_.escape('<div class="container"></div>'));
// &lt;div class=&quot;container&quot;&gt;&lt;/div&gt;


// unescape
// Transforma entidades  &amp; &lt; &gt; &quot; y &#39 a sus correspondientes caracteres
console.log(_.unescape('&lt;span&gt;'));
// <span>


// kebabCase
// Transforma el string a formato kebabCase
console.log(_.kebabCase('What does the fox say?'));
// what-does-the-fox-say


// pad
// Añade los caracteres especificados por la izquierda y derecha hasta que llegue a la longitud requerida
console.log(_.pad('Hello', 15, '-'));
// -----Hello-----


// padStart
// Añade los caracteres especificados sólo por la izquierda hasta que llegue a la longitud requerida
console.log(_.padStart('Hello', 15, '-'));
// ----------Hello


// padEnd
// Añade los caracteres especificados sólo por la izquierda hasta que llegue a la longitud requerida
console.log(_.padEnd('Hello', 15, '-'));
// Hello----------


// snakeCase
// Transforma el string a formato SNAKE_CASE
console.log(_.snakeCase('What does the fox say?'));
// what_does_the_fox_say


// truncate
// Trunca el string en caso de ser más grande que la longitud especificada
console.log(_.truncate('What does the fox say?', { length: 18, omission: ',,,'}))
// What does the f,,,

// words
// Separa el string por palabras. Acepta expresión regular.
console.log(_.words('What does, the fox say?'));
// ['What', 'does', 'the', 'fox', 'say']

