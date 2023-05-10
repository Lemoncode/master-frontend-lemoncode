///--  HOISTING **********************************************************************************

// En Javascript, la declaración de determinadas entidades, concretamente las funciones, variables
// o clases, pueden estar sometidas a un curioso proceso que se denomina "hoisting".
// Basta el siguiente ejemplo para entenderlo:

// Habitualmente, en cualquier lenguaje, seguimos un orden lógico donde declaramos primero funciones
// y despues las usamos, algo como esto:
function shout(value) {
  console.log(value.toUpperCase() + "!!");
}

shout("hi guys"); // "HI GUYS!!"


// Sin embargo, en JS ¡podemos usar funciones antes de declararlas!
shout("hi guys"); // "HI GUYS!!"

function shout(value) {
  console.log(value.toUpperCase() + "!!");
}

// A esto se le conoce como "hoisting": JS procesa las declaraciones antes que cualquier otro 
// código, lo que es equivalente en la práctica a colocar las declaraciones arriba, justo al
// principio del ámbito en el que han sido declaradas.
// ¡ Pero OJO, solo ⚠ LAS DECLARACIONES ⚠ !


///-- VAR ****************************************************************************************

/*
Hasta ahora, conocíamos 2 formas de declarar variables en JS: let y const. No obstante, estas
declaraciones fueron introducidas en ES6 (2015, recordemos), por lo que se puede decir que son 
relativamente modernas o recientes. 

Hasta entonces, el lenguaje sólo permitía una forma única de declarar variables, la forma clásica o
declaración mediante "var". Técnicamente, var nos permitía declarar variables:
- Con ámbito de función, si se declaraba dentro de ella.
- Con ámbito global, si se declaraba fuera.

Sin embargo, como veremos a continuación, var acarreaba una serie de problemas que la hacian 
propensa a errores, razones por las que fue deprecada en favor de let y const.
*/


///-- VAR: HOISTING ******************************************************************************

// Cuando declarábamos variables con var, aparentemente esto debería dar error:
console.log(a); // undefined
var a = 5;
console.log(a); // 5

// Sin embargo, gracias al "hoisting", a está declarada arriba del todo, aunque su asignación ⚠ 
// ocurre en la segunda línea. Esto sería equivalente a:
var a;
console.log(a); // undefined
a = 5;
console.log(a); // 5

// Es decir, ⚠ solo las declaraciones hacen "hoisting" ⚠, las asignaciones no.


///-- VAR: SCOPE *********************************************************************************

/*
Cuando declaramos variables con var, su ámbito (scope) será el actual contexto de ejecución, esto
es: 
- o bien una Función si ha sido declara dentro de ella, 
- o bien el contexto Global si está fuera.

Por lo tanto, los bloques "if/else" o bucles "for" no constitutyen un ámbito diferente o privado 
para la declaración de variables var.
*/

// "if/else" ejemplo
if (true) {
  var name = "Lara";
  console.log(name); // "Lara"
}
console.log(name); // "Lara"

// equivalente a:
var name;
if (true) {
  name = "Lara";
  console.log(name); // "Lara"
}
console.log(name); // "Lara"

// "for" ejemplo
// Ambas variables message son la misma realmente, hay shadowing ⚠.
var collection = ["hey", "ho", "let's go"];
var message = "No one says nothing";
for (var i = 0; i < collection.length; i++) {
  var message = "Someone says: " + collection[i];
  console.log(message);   // "Someome says: hey"
}                         // "Someone says: ho"
                          // "Someone says: let's go"
console.log(i); // 3
console.log(message); // "Someone says: let's go"

// Equivalente a:
var collection, message, i;
collection = ["hey", "ho", "let's go"];
message = "No one says nothing";
for (i = 0; i < collection.length; i++) {
  message = "Someone says: " + collection[i];
  console.log(message); // "Someome says: hey"
}                       // "Someone says: ho"
                        // "Someone says: let's go"
console.log(i); // 3
console.log(message); // "Someone says: let's go"

// Recuerda, las funciones si constituyen un ámbito (scope) nuevo. Esto podría dar lugar a 
// confusión o error:

var n = 1;  // Contexto => Global

function printSomething() {
  console.log(n); // undefined. Contexto => printSomething()
  var n = 2;
  console.log(n); // 2
}
printSomething();

// esto es equivalente a:
var n;
n = 1;

function printSomething() {
  var n;
  console.log(n); // undefined
  n = 2;
  console.log(n); // 2
}
printSomething();


///-- LET & CONST ********************************************************************************

/*
Las nuevas keywords "let" y "const" fueron introducidas en ES6 como alternativa a la declaración
tradicional de variables con "var", con el principal objetivo de eliminar la confusión y la 
propensión a errores que suponía el uso de "var", debido principalmente al hoisting y su ámbito
de función, que le propiciaban un manejo poco intuitivo con respecto a otros lenguajes.

Así nacen let y const, como declaraciones locales, de ámbito de bloque ("block-scoped"), que 
funcionan de manera muy similar a como estamos acostumbrados en muchos otros lenguajes:
- Al tener ámbito de bloque, los bloques tales como "if/else" o bucles "for" suponen un espacio
privado para ellas, de igual modo que los cuerpos de las funciones. Se dice que estas variables son
locales o privadas en el bloque en el que se declaran.
- Esto tiene una implicación importante: no son susceptibles al hoisting como si lo era var.

¿Por qué entonces 2 formas de declarar variables de bloque, let y const? La principal diferencia
entre ellas es que:
- let está diseñado para valores reasignables, permite declarar la variable (con inicialización 
  opcional) y modificarla tantas veces como queramos. 
- const, sin embargo, es constante, por lo que debe ser declarada e inicializada obligatoriamente,
  y no puede ser reasignada en un futuro.
*/

// var
var a = 13;
a = 14;
console.log(a);

// let
let b; // let b = 13 . Inicialización opcional.
b = 14;
console.log(b);

// const
const c;  // Uncaught SyntaxError: unexpected token (requiere inicialización)

const c = 13; // Hay que inicializarla en su declaración.
console.log(c);
c = 14;  // Uncaught SyntaxError: Assignment to constant variable

// Cuidado por tanto y no usar "const" en sitios donde deba reasignarse
for (const i = 0; i < 10; i++) { // Uncaught TypeError: Assignment to constant variable
  console.log(i);
}


///-- LET & CONST: HOISTING **********************************************************************

// A diferencia de "var", aquellas variables que se declaren usando let y const no les será 
// aplicado el hoisting:

// Con "var" gracias al hoisting:
function main() {
  console.log(message);
  var message = "hello";
  console.log(message);
}
main(); // undefined
// "hello"

// Si cambiamos la declaración a "let", no habrá hoisting y la función lanzará un error:
function main() {
  console.log(message);
  let message = "hello";
  console.log(message);
}
main(); // Uncaught ReferenceError: message is not defined


///-- LET & CONST: SCOPE *************************************************************************

// El ámbito pasa a ser de bloque, las variables let o const declaradas en bloques no puede ser 
// accedidas desde fuera, son locales o privadas dentro de ese bloque:
const list = [1, 2, 3];
for (let i = 0; i < list.length; i++) {
  console.log(list[i]);
}
console.log(i); // Uncaught ReferenceError: i is not defined

// Otro ejemplo con const:
function greet(mood) {
  const message = "How are you?";
  if (mood === "happy") {
    const message = "Wow, so nice to see you again!"
    console.log(message);
  }
  console.log(message);
}

greet();  // How are you?
greet("happy"); // Wow, so nice to see you again! How are you?

// *Si reemplazamos const por var en este ejemplo vemos que el funcionamiento con el mood "happy" 
// no es el esperado.


///-- VAR vs LET vs CONST: RESUMEN ****************************************************************

/*
- var
    + Ámbito: función
    + Hoisting: SI
    + Redeclarable: SI
    + Reasignable: SI
- let
    + Ámbito: bloque
    + Hoisting: NO
    + Redeclarable: NO 
    + Reasignable: SI
- const
    + Ámbito: bloque
    + Hoisting: NO
    + Redeclarable: NO
    + Reasignable: NO

NOTA:
- Ámbito de función: sólo las funciones representan un ámbito privado para ellas.
- Ámbito de bloque: cualquier bloque, incluidas funciones, representan ámbito privado para ellas.
*/
