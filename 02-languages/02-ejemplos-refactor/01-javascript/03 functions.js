///-- FUNCTIONS ***********************************************************************************

/*
Las funciones son un tipo especial de OBJETOS 😲. Al igual que sucede en otros lenguajes, son 
elementos invocables que reciben una serie de argumentos y pueden devolver valores.
*/

// SINTAXIS

// Declaración básica de una función
function saySomething() {
  console.log("hello world");
}

console.log(typeof main); // "function" Aunque en el fondo, es también un objeto.

// Añadiendo argumentos
function saySomething(arg1, arg2) {
  console.log(arg1, arg2);
}
saySomething("hello", "world"); // hello world
saySomething("hello"); // hello undefined
saySomething(); // undefined undefined

// Es legítimo llamar a una función con más argumentos que los que han sido declarados
// Veremos como aprovechar este hecho un poco más abajo.
saySomething("hello", "wonderful", "world"); // hello wonderful

// Añadiendo valor de retorno
function saySomething(arg1, arg2) {
  console.log(arg1, arg2);
  return arg1 && arg2 ? true : false; // Expresión equivalente: return Boolean(arg1 && arg2);
}
console.log(saySomething("hello", "world")); // hello world, true
console.log(saySomething("hello")); // hello undefined, false

// VARIADIC FUNCTIONS

// Argumentos dinámicos o variables (variadic functions) mediante el objeto iterable arguments
function logArguments() {
  console.log(arguments); // "arguments" es un objeto array-like (iterable)
}
logArguments(); // {}
logArguments(true); // {0: true}

// Podemos iterar por "arguments" por comodidad
function logArguments() {
  for (const arg of arguments) { 
    console.log(arg);
  }
}
logArguments(1, true, "hello"); // 1, true, hello

// Ejemplo práctico de utilidad con "arguments"
function sum() {
  let total = 0;
  for (const num of arguments) {
    total += num;
  }
  return total;
}
console.log(sum(1, 2, 3)); // 6;


///-- ARROW FUNCTIONS *****************************************************************************

// SINTAXIS

// Funciones flecha o también llamadas "lambda". Siempre son anónimas.
const toUpper = (text) => {
  return text.toUpperCase();
};

// Si solo tenemos la sentencia "return" podemos acortar la función y ahorrarnos
// la palabra clave "return" y las llaves:
const toUpper = (text) => text.toUpperCase();

// También podemos omitir los paréntesis cuando el argumento es único:
const toUpper = text => text.toUpperCase();
// Sólo cuando es único, porque sino la coma de separación de argumentos se 
// podría confundir con el operador coma.

// En caso de que lo que devuelva sea un objeto literal hay que tener cuidado:
const toObject = (name, surname, age) => {
  return { name, surname, age }
}
// y utilizar paréntesis para devolver en la forma corta, ya que las llaves de
// objeto literal se confundirían con las llaves de ámbito de función.
const toObject = (name, surname, age) => ({ name, surname, age })





// TODO: Sintaxis, ¿transformar ejemplos anteriores?
// TODO: DIFERENCIAS
//  - ¿THIS?. Breve introducción a esta variable y su implicación con las funciones para explicar el this léxico en arrows
//  - No arguments disponible
