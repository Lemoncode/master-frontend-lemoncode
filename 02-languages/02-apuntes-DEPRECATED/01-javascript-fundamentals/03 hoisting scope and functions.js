///-- HOISTING *******************************************************

// Habitualmente, declaramos primero funciones y despues las usamos
function shout(value) {
  console.log(value.toUpperCase() + "!!");
}

shout("hi guys"); // "HI GUYS!!"


// Pero en JS podemos usar funciones antes de declararlas
shout("hi guys"); // "HI GUYS!!"

function shout(value) {
  console.log(value.toUpperCase() + "!!");
}

/*
A esto se le conoce como "hoisting": JS procesa las declaraciones antes que
cualquier otro código, lo que es equivalente en la práctica a colocar las
declaraciones arriba. Pero OJO, solo LAS DECLARACIONES.
*/

// Veamos el caso de variables declaradas con var:
// Aparentemente esto debería dar error
console.log(a); // undefined
var a = 5;
console.log(a); // 5

// Sin embargo, gracias al "hoisting", a está declarada arriba del todo, aunque
// su asignación [!] ocurre en la segunda línea. Esto sería equivalente a:
var a;
console.log(a); // undefined
a = 5;
console.log(a); // 5

// Es decir, solo las declaraciones hacen "hoisting", las asignaciones no.


///-- VAR SCOPE *******************************************************

/*
Cuando declaramos variables con var, su ámbito (scope) será el actual contexto
de ejecución: o bien una Función si ha sido declara dentro de ella, o bien el
contexto Global si está fuera.

Por lo tanto, los bloques "if/else" o bucles "for" no constitutyen un scope para
la declaración de variables var.
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
// Ambas variables message son la misma realmente, hay shadowing.
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

// Recuerda, las funciones si constituyen un ámbito (scope) nuevo.
// Esto podría dar lugar a confusión o error:

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



///-- DECLARACIÓN VS EXPRESIÓN DE FUNCIONES *******************************************************

// Declaración de funciones, "function declaration"
function print(message) {
  console.log(message);
}

// Expresión de funciones, "function expression"
var print = function(message) {
  console.log(message);
};

// ¿Cual es mejor? Ninguno.
// Pero no se puede acceder a una "function expression" ANTES de su declaración
// debido al "hoisting":
say("hello world"); // "Uncaught TypeError: say is not a function"

var say = function(message) {
  console.log(message);
};

// lo anterior sería equivalente a:
var say;
say("hello world"); // "Uncaught TypeError: say is not a function"

say = function(message) {
  console.log(message);
};



///-- CLOSURE & SCOPE *******************************************************

// Las funciones puede acceder a variables declaradas fuera:
var phone = "927372731";

function printPhone() {
  console.log(phone);
}

printPhone(); // "927372731"

// Las variables declaradas dentro de una función no son visibles desde fuera.
// Las funciones crean un nuevo contexto, un cierre (CLOSURE):
function printPhone() {
  var phone = "927372731";
  console.log(phone);
}
printPhone(); // "927372731"
console.log(phone); // "Uncaught ReferenceError: phone is not defined"

// Una funcion dentro de otra, puede acceder a variables creadas antes:
function createCounter() {
  var i = 0;
  return function () {
    // Desde aqui tenemos acceso a la variable "i"
    console.log(i++);
  };
}

var counter = createCounter();
counter(); // 0
counter(); // 1
counter(); // 2
console.log(i); // "Uncaught ReferenceError: i is not defined"

// [!!!] Los CLOSURES son muy útiles para encapsular datos, hacerlos privados.
// El ejemplo de antes se podría evolucionar un poco hasta obtener:
function createCounter() {
  var i = 0;
  return {
    increase: function() {
      i++;
    },
    decrease: function() {
      i--;
    },
    print: function() {
      console.log(i);
    }
  }
}

var counter = createCounter();
counter.increase();
counter.print(); // 1
counter.decrease();
counter.print(); // 0

/*
PREGUNTA. ¿A que nos recuerda esto? Pista: datos encapsulados, privados con una
interfaz para manejarlos ... tic ... tac .... CLASES!!! Se verán más adelante.
*/


///-- IIFE (Immediately Invoked Function Expression) ******************

// Las funciones se pueden invocar inmediatamente tras su declaración:
(function () {
  console.log("Automatic call"); // "Automatic call"
})();

// También pueden invocarse dentro de paréntesis:
(function () {
  console.log("Automatic call"); // "Automatic call"
}());

// Podemos encerrar una función dentro de un IIFE.
// Hagámoslo con el ejemplo anterior:
var counter = (function createCounter() {
  var i = 0;
  return function () {
    console.log(i++);
  };
})();

counter(); // 0
counter(); // 1
counter(); // 2
console.log(i); // "Uncaught ReferenceError: i is not defined"
