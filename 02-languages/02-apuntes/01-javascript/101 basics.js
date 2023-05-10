///-- EXPRESIONES BÁSICAS ************************************************************************

///-- VARIABLES

/*
Javascript es un lenguaje dinámico y débilmente tipado, lo que significa que las variables no están
asociadas a ningún tipo concreto. Por tanto, no tengo que declararlas especificando ningún tipo. 
Puedo asignar el valor que quiera, del tipo que quiera.

Tenemos varios operadores para declarar variables: `let`, `const` y `var`.
Actualmente `var` está desaconsejado debido a un concepto llamado "Hoisting" que veremos más 
adelante.
*/

// *** LET

// Utilizaremos `let` cuando queramos declarar una variable a la que, posteriormente, podamos ser 
// capaces de reasignar su valor
let a = 3;
a = 14;

// Podemos crear multiples declaraciones todas con el mismo tipo `let` separadas por coma
let b = 10, c = "hello";

// comentarios
let d = 4; // d value is 4

// Una vez tengamos una variable declarada no podemos redeclarar otra con el mismo nombre en el 
// mismo ámbito. Veremos con más detalle el ámbito más adelante
let a = 3;
let a = 14; // Error! La variable `a` ya ha sido redeclarada

// comentarios de bloque
/*
let c = 3;
let d = 4;
*/

// *** CONST
/*
Utilizaremos `const` cuando queramos declarar una variable que nunca queramos volver a reasignar.
Es importante entender que una vez que declaremos la variable no podemos volver a reasignar su valor.
Es por esto que una variable declarada con `const` debe incluir la asignación. Generalmente 
utilizaremos `const` para dar a entender de forma semántica que esa variable no seá reasignada.

⚠ Importante: Una variable declarada con `const` puede no ser "constante", es decir, de sólo
lectura. El concepto "constante" dependerá del tipo de dato que almacenemos.
*/

// Esto lanzará un error de ejecución
const a;

// Hay que incluir el valor
const a = 3;

// Reasignar su valor lanzará un error de ejecución
a = 14;

// Al igual que las variables `let` no podemos redeclarar una variable con el mismo nombre en el 
// mismo ámbito.
const a = 3;
const a = 14; // Error! La variable `a` ya ha sido redeclarada

// Es importante entender que no podemos utilizar una variable declarada con `let` o `const` antes 
//de su declaración.
console.log(a); // Error! Todavía no existe la variable `a`
let a = 10;


///-- TIPOS DE DATOS *****************************************************************************

/*
Distinguimos 2 grandes grupos de tipos de datos en Javascript:
- Tipos PRIMITIVOS (representan un único dato simple).
- Tipos estructurales (representan estructuras de datos) u OBJETOS.

7 PRIMITIVOS (2 de nueva incorporación) + OBJETOS
*/

// PRIMITIVOS

/*
DEFINICIÓN:
Aquellos que trae el lenguaje por defecto (built-in). Un tipo primitivo es aquel
que no es un objeto y por tanto no tiene métodos. Representan datos simples, sencillos.

CARACTERÍSTICAS:
- Todos los primitivos son inmutables. Una vez creado un valor primitivo no puede ser
alterado ni modificado (no confundir con reasignar una variable con otro valor).
- Operador 'typeof'
*/

// string
"hello world" // dobles comillas
'hello world' // comillas simples
`hello world` // backticks. Los strings creados con backticks tb se conocen como "template literals"
''
""
``

// string multilínea
`This is a
multiline string`

// Interpolación de expresiones (sólo en template literals)
// ⚠ Llamaremos "expresión" a cualquier tipo de valor que pueda ser almacenado en una variable.
// Una expresión puede ser un valor primitivo, objeto, valor devuelto por una función, resultado de
// una operación, etc.
const person = "Edward";
const message = `How are you, ${person}?`;
console.log(message); // "How are you, Edward?"


// number
101       // entero positivo
-200      // entero negativo
1220.31   // flotante
1e6       // notación exponencial (1 x 10^6)
Infinity  // infinito
NaN       // NotANumber** (de hecho es de tipo número)
// ⚠ Podemos separar los dígitos con un underscore [_] en cualquier posición para mejorar la 
// legibilidad.

/*
 Indeterminados (0 * Infinity), indefinidos (1 / 0), fuera del conjunto de los
 reales (sqrt(-1)), o errores al parsear (parseInt("abc"))
*/

// boolean
true
false

// null
/* ⚠ Primitivo especial de tipo "object". Raiz de la cadena de prototipos */
null

// undefined
undefined

/*
 ¿null o undefined?

 En general, se recomienda utilizar `null` para indicar la ausencia intencional de un valor, y 
 undefined para indicar que algo simplemente no está definido o no tiene un valor.
*/

// symbol
/* ⚠ Lo veremos más adelante ya que su uso está muy ligado a los objetos */

// bigint
/* ⚠ Nuevo tipo numérico para representar enteros de cualquier tamaño, con cualquier precisión. */
2n
BigInt(2)

// operador typeof para primitivos
console.log(typeof "");         // string
console.log(typeof 0);          // number
console.log(typeof 10n);        // bigint
console.log(typeof false);      // boolean
console.log(typeof undefined);  // undefined
console.log(typeof null);       // object** Se entenderá mejor con el modelo prototípico


// OBJETOS

/*
Se utilizan para representar datos estructurados, como los objetos en si mismos o
los arrays (que también son objetos en el fondo)

⚠ Los objetos y estructuras de datos (arrays) se darán en el siguiente capítulo.
⚠ Entre otros, las funciones son un tipo especial de objetos y las veremos más adelante.
⚠ Existen más tipos de estructuras de datos nativas como Map o Set que iremos viendo en sus 
propias secciones.
*/


///-- OPERADORES *********************************************************************************

// 1. Operadores ARITMÉTICOS
console.log(52 + 21); // 73
console.log("hello " + "world"); // "hello world"
console.log(10 - 5); // 5
console.log(10 * 10); // 100;
console.log(9 / 3); // 3
console.log(15 / 2); // 7.5;
console.log(15 % 3); // 0 (Módulo o resto)
console.log(2 ** 3); // 8 (Exponenciación)

// [copy-paste version]
console.log(52 + 21);
console.log("hello " + "world");
console.log(10 - 5);
console.log(10 * 10);
console.log(9 / 3);
console.log(15 / 2);
console.log(15 % 3);
console.log(2 ** 3);

// Asignaciones con operadores aritméticos
// ⚠ Importante: No podemos usar operadores de asignación con variables `const`
let num = 3;
console.log(num++); // 3 (increases after console.log)
console.log(num--); // 4 (decreases after console.log)
console.log(++num); // 4 (increases before console.log)
console.log(--num); // 3 (decreases before console.log)
num += 5;           // Equivalent to num = num + 5
console.log(num);   // 8
num -= 5;           // Equivalent to num = num - 5
console.log(num);   // 3
num *= 10;          // Equivalent to num = num * 10
console.log(num);   // 30
num /= 6;           // Equivalent to num = num / 6
console.log(num);   // 5
num %= 3;           // Equivalent to num = num % 3
console.log(num);   // 2
num **= 10          // Equivalent to ten times num * num or Math.pow(2, 10)
console.log(num)    // 1024

// [copy paste version]
let num = 3;
console.log(num++);
console.log(num--);
console.log(++num);
console.log(--num);
num += 5;
console.log(num);
num -= 5;
console.log(num);
num *= 10;
console.log(num);
num /= 6;
console.log(num);
num %= 3;
console.log(num);
num **= 10
console.log(num);


// 2. Operadores de COMPARACIÓN
// Mayor que, menor que, igualdad, desigualdad

console.log(3 > 0);   // true
console.log(3 < 0);   // false
console.log(3 > 3);   // false
console.log(3 < 3);   // false
console.log(3 >= 3);  // true
console.log(3 <= 3);  // true
console.log(5 == 5);  // true

// [copy paste version]
console.log(3 > 0);
console.log(3 < 0);
console.log(3 > 3);
console.log(3 < 3);
console.log(3 >= 3);
console.log(3 <= 3);
console.log(5 == 5);

// "TYPE COERCION"
/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Loose_equality_using
Puesto que JS no es un lenguaje tipado, se puede comparar miembros de distinta naturaleza 
(distinto tipo). En tal caso, la estrategia que sigue JS es convertir implicitamente uno de los 
miembros o los dos a un tipo común para poder realizar la comparativa. A esto se le llama
"type coercion" o "conversión implícita/automática".
*/
console.log(5 == "5");    // true // ⚠ Loose equality. Igualdad débil. (Por type coertion, "5" string se convierte a 5 numero)
console.log(5 === "5");   // false // ⚠ Strict equality. Igualdad fuerte.
console.log(5 != 5);      // false
console.log(5 != "5");    // false. (Por type coercion, "5" string se convierte a 5 numero)
console.log(5 !== 5);     // false
console.log(5 !== "5");   // true
console.log(0 == false);  // true. (Por type coercion, false se castea a 0)
console.log(0 === false); // false. (number != boolean)

// [copy paste version]
console.log(5 == "5");
console.log(5 === "5");
console.log(5 != 5);
console.log(5 != "5");
console.log(5 !== 5);
console.log(5 !== "5");
console.log(0 == false);
console.log(0 === false);

// Type coertion o casteo de tipos también se aplica a otros operadores
console.log(true + false); // 1. (1 + 0)
console.log(true - false); // 1. (1 - 0)
console.log("num" + 3); // "num3". 3 (numero) se castea a "3" (string) y se concatena.
console.log(3 + "num"); // "3num". 3 (numero) se castea a "3" (string) y se concatena.
// ¿Y esto que daría?
console.log("num" - 3); // NaN. Porque convierte "num" (string) a NaN (número) y NaN - 3 = NaN.
// ¿Pero y esto otro?
console.log("" - 3); // -3. Porque convierte "" (string vacio) a 0 (número) y 0 - 3 = -3.

// [copy paste version]
console.log(true + false);
console.log(true - false);
console.log("num" + 3);
console.log(3 + "num");
console.log("num" - 3);
console.log("" - 3);

// 3. Operadores LÓGICOS

// && AND
console.log(true && true);    // true
console.log(true && false);   // false
console.log(false && true);   // false
console.log(false && false);  // false

// || OR
console.log(true || true);    // true
console.log(true || false);   // true
console.log(false || true);   // true
console.log(false || false);  // false

/*
IMPORTANTE. De nuevo, JS puede tener operandos de distinta naturaleza.
Los operadores && y ||, cuando se usan con operandos no booleanos pueden devolver un resultado no
booleano, cualquiera: array, objeto ...
*/

// Por ejemplo:
const a = 3 || 20; // 3.

/*
Para saber que operando se devuelve, JS tiene que evaluarlos como booleanos ya que los operadores 
lógicos trabajan con operandos booleanos. En JavaScript, al convertir o evaluar cualquier valor 
como booleano, pueden suceder 2 cosas, que nos de true o que nos de false. 
A los valores que nos dan false se le conocen como "falsy values" y son sólamente estos:
*/
0;
NaN;
false;
"";
null;
undefined;
// el resto de valores serán evaluados como "truthy values"

// MAS EJEMPLOS:
let a;
a = 3 || 20; // 3. El 3 es el primer valor "truthy" que se encuentra el OR.
a = 0 || 20; // 20. El 20 es el primer valor "truthy" que se encuentra el OR.
a = Boolean(0 || 20); // true
a = 3 && 20; // 20
a = 0 && 20; // 0
a = Boolean(0 && 20); // false
a = 2 > 0 && "hello"; // "hello"
a = 2 < 0 && "hello"; // false

// [copy paste version]
let a;
a = 3 || 20;
a = 0 || 20;
a = Boolean(0 || 20);
a = 3 && 20;
a = 0 && 20;
a = Boolean(0 && 20);
a = 2 > 0 && "hello";
a = 2 < 0 && "hello";

// 4. Operadores BITWISE u operadores de bits
/*
No los daremos pero sabed que existen y que son poco frecuentes. Suelen ser utilizados en 
implementaciones de algoritmos más "a bajo nivel".
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Bitwise
*/



///-- DIRECTIVAS DE CONTROL **********************************************************************

// if else

// 1 sola rama
const count = 0;
if (count === 0) {
  console.log("zero");
}

// 2 ramas
if (count === 0) {
  console.log("zero");
} else {
  console.log("non-zero");
}

// n ramas
if (count === 0) {
  console.log("zero");
} else if (count === 1) {
  console.log("one");
} else {
  console.log("more than one");
}

// ¿1 sola línea en el cuerpo de las ramas? Se pueden eliminar los paréntesis
if (count === 0) console.log("zero");
else if (count === 1) console.log("one");
else console.log("more than one");


// switch
const pet = "dog";
switch (pet) {
  case "cat":
    console.log("medium pet");
    break;
  case "dog":
    console.log("large pet");
    break;
  case "bird":
    console.log("small pet");
    break;
  default:
    console.log("unknown size");
}

// switch con reuso de casos
const pet = "dog";
switch (pet) {
  case "cat":
  case "dog":
    console.log("mammal");
    break;
  case "bird":
  default:
    console.log("non-mammal");
}

// operador ternario
const age = 20;
const status = (age >= 18) ? "adult" : "minor";

// operador ternario sin paréntesis, no necesario
const status = age >= 18 ? "adult" : "minor";

// anidamiento de ternarios "ternary nesting"
const status = age >= 18 ? "adult" : (age >= 14 ? "teen" : "kid");

// bucle "for". ⚠ Importante el uso de `let` aquí
const limit = 10;
for (let i = 0; i < limit; i++) {
  console.log(i);
}

// múltiples asignaciones en bucle "for"
for (let i = 0, limit = 10; i < limit; i++) {
  console.log(i);
}

// bucle "while"
const limit = 10;
let i = 0;
while (i < limit) {
  console.log(i);
  i++;
}

// bucle "do while"
const limit = 10;
let i = 0;
do {
  console.log(i);
  i++;
} while (i < limit);

// ⚠ for..in que será vista con los objetos
// ⚠ forEach() se verá con los arrays
// ⚠ for..of se verá con los arrays

// operador coma en expresiones
const a = (2 + 4, 9);
console.log(a); // 9
const b = 3;
const c = (b += 5, 10);
console.log(c); // 10
console.log(b); // 8;
