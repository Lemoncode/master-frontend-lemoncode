///-- DECLARACIÓN VS EXPRESIÓN DE FUNCIONES *******************************************************

// Cuando trabajamos con funciones clásicas, podemos declararlas de 2 maneras diferentes:

// 1. Mediante declaración de funciones, o "function declaration":
function say(message) {
  console.log(message);
}

// 2. Mediante expresión de funciones, o "function expression". En este caso, la declaración no
// puede comenzar con la keyword function para no confundirla con la declaración de funciones:
const say = function(message) {
  console.log(message);
};
// NOTA: Las arrow functions también son function expressions.

// ¿Cual es mejor? Ninguno en especial.
// La diferencia a saber está en que no se puede acceder a una "function expression" ANTES de su 
// declaración debido al "hoisting", tanto si usas var, let o const:
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



///-- CLOSURE ************************************************************************************

// Las funciones puede acceder a variables declaradas en el ámbito superior (es decir, fuera):
const phone = "927372731";

function printPhone() {
  console.log(phone);
}

printPhone(); // "927372731"

// Las variables declaradas dentro de una función no son visibles desde fuera. En todos los casos,
// ya sean declaradas con var, let o const, las funciones crean un nuevo contexto o ámbito para
// ellas:
function printPhone() {
  const phone = "927372731";
  console.log(phone);
}
printPhone(); // "927372731"
console.log(phone); // "Uncaught ReferenceError: phone is not defined"

/*
Pero podemos ir más allá. Si las funciones son ciudadanos de primer orden, podemos crear una 
función que sea devuelta por otra, y que mantenga referencias a variables 'encerradas' en el
ámbito de la función padre (superior). Este mecanismo es lo que conocemos como CLOSURE (cierre).

En otras palabras, un closure nos da acceso al ámbito de una función superior (contexto léxico), 
desde una función interna o anidada. Y esto es posible gracias al propio lenguage que esta
diseñado para no eliminar las referencias de la función padre, si éstas sean referenciadas
por una función hija (hasta que dicha función hija deje de ser referenciada).
*/

function createCounter() {
  let count = 0;
  return function () {
    // Desde aqui tenemos acceso a la variable "count"
    console.log(count++);
  };
}

const counter = createCounter();
counter(); // 0
counter(); // 1
counter(); // 2
console.log(count); // "Uncaught ReferenceError: count is not defined"

// ⚠⚠ Los CLOSURES son tremendamente útiles para encapsular datos, para hacerlos privados.
// El ejemplo de antes se podría evolucionar un poco hasta obtener:
function createCounter() {
  let count = 0;
  return {
    increase: function() {
      count++;
    },
    decrease: function() {
      count--;
    },
    print: function() {
      console.log(count);
    }
  }
}

const counter = createCounter();
counter.increase();
counter.print(); // 1
counter.decrease();
counter.print(); // 0

/*
PREGUNTA: ¿A que nos recuerda esto? Pista: datos encapsulados, privados, con una interfaz para
manejarlos ... tic ... tac .... ¡CLASES!. 

⚠ Si bien se parecen bastante como mecanismo de encapsulación, hay una importante diferencia: los
métodos que devolvemos como interfaz para manejar datos (increase, decrease, print) se crean en
cada instancia. Por tanto, no es tan óptimo como el prototipo.
*/


///-- IIFE (Immediately Invoked Function Expression) ******************

// Las funciones se pueden invocar inmediatamente tras su declaración. A esto se le conoce como
// IIFE:
(function () {
  console.log("Automatic call"); // "Automatic call"
})();

// También pueden invocarse dentro de paréntesis:
(function () {
  console.log("Automatic call"); // "Automatic call"
}());

// Podemos encerrar una función dentro de un IIFE. Hagámoslo con el ejemplo anterior:
const counter = (function createCounter() {
  let count = 0;
  return function () {
    console.log(count++);
  };
})();

counter(); // 0
counter(); // 1
counter(); // 2
console.log(count); // "Uncaught ReferenceError: i is not defined"

/*
PREGUNTA: ¿A que nos recuerda este ejemplo donde combinamos closure con IIFE?

¡A un singleton! Solo podemos crear una instancia única de counter, puesto que la función factoria
que la crea es autoinvocada.
*/
