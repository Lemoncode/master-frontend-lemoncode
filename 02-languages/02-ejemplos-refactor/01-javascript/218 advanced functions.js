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
