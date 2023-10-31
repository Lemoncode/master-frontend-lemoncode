///-- FUNCIONES ***********************************************************************************

// Tipar una función en TypeScript no es más que especificar los tipos de los argumentos que recibe
// y el tipo de dato que devuelve. Es importante tener en cuenta que el número de argumentos que
// especifiquemos son obligatorios.
function shout(text: string, upperCase: boolean): string {
  return (upperCase ? text.toUpperCase() : text) + "!!!";
}

const t1 = shout("hi"); // [ts] Expected 2 arguments, but got 1
const t2 = shout("hi", true);
console.log(t2); // "HI!!!"

// Su homólogo en arrow function
const shout = (text: string, upperCase: boolean): string =>
  (upperCase ? text.toUpperCase() : text) + "!!!";

const t3 = shout("hi"); // [ts] Expected 2 arguments, but got 1
const t4 = shout("hi", false);
console.log(t4); // "hi!!"

// *** Argumentos Opcionales
// Utilizando el operador [?] sobre un argumento significa que dicho argumento es opcional
// a la hora de invocar a la función
const shout = (text: string, upperCase?: boolean): string =>
  (upperCase ? text.toUpperCase() : text) + "!!!";

// Si no pasamos explícitamente un argumento opcional su valor es, al igual que
// en JavaScript, undefined.
console.log(shout("hi")); // "hi!!!" ---> upperCase = undefined.

// *** Argumentos por defecto
// También es posible declarar el tipo de valores por defecto, aunque por lo general es más legible
// el no declarar el tipo y dejar que TypeScript lo infiera del propio valor por defecto.
// ⚠ Al añadir un valor por defecto, no se puede usar el operador opcional de forma explícita.
// Será TS quien automáticamente lo marque como opcional si está inicializado con un valor por 
// defecto y no hay más argumentos obligatorios a continuación.

// el tipo ya es opcional
const shout = (text: string, upperCase: boolean = true): string =>
  (upperCase ? text.toUpperCase() : text) + "!!!";

console.log(shout("hi")); // "HI!!!"

// *** Funciones como argumentos
// También es posible tipar argumentos que son funciones:
const shout = (text: string, getNumExclamation: () => number): string =>
  text.toUpperCase() + "!".repeat(getNumExclamation());

const getRandom = () => Math.ceil(Math.random() * 10); // Este es mi callback.

console.log(shout("WoW", getRandom));
console.log(shout("WoW", getRandom));
console.log(shout("WoW", getRandom));
console.log(shout("WoW", getRandom));
console.log(shout("WoW", getRandom));
console.log(shout("WoW", getRandom));

// *** Alias
// En estos ejemplos vistos, el tipado de la funcion va integrado en la propia
// declaración/definición de la función. Sin embargo, podemos extraer el typo de una función
// aparte, y reusarlo cuando queramos. Para ello usamos el operador "type".
// Esto se conoce como ALIAS:
type ShoutFunction = (text: string, getNumExclamation: () => number) => string;
const shout: ShoutFunction = (text, getNumExclamation) =>
  text.toUpperCase() + "!".repeat(getNumExclamation());

console.log(shout("TS rocks", getRandom));

// *** Sobrecarga de funciones
function switchType(c: string): number;
function switchType(c: number): string;
function switchType(c) {
  if (typeof c === "string") {
    return Number(c);
  } else {
    return String(c);
  }
}

const r1 = switchType(3);
const r2 = switchType("65");
const r3 = switchType({}); // [ts] Argument of type '{}' is not assignable to parameter of type 'number'

// ⚠ Es posible sobrecargar funciones con diferente número de argumentos.

// *** Tipando funciones en un interfaz, o lo que es lo mismo, usando interfaces para
// diseñar funciones.
interface RepeatString {
  (text: string, n: number): string;
}

const repeatString: RepeatString = (text, n) => Array(n).fill(text).join(" ");

console.log(repeatString("echo", 3)); // "echo echo echo"

// ¿Para que es útil esto?
// Para añadirle propiedades a una función. Las funciones no dejan de ser objetos, de esta forma
// podríamos obligar a que una función tenga ciertas propiedades:

interface RepeatStringFunction {
  (text: string, n: number): string;
  description: string;
  maxLimit: number;
}

const repeatString: RepeatStringFunction = (text, n) =>
  Array(Math.min(repeatString.maxLimit, n)).fill(text).join(" ");
repeatString.maxLimit = 4;
repeatString.description = "Function to repeat n times a text"; // Si omito esto, el tipado fallará.

console.log(repeatString("echo", 8)); // "echo echo echo echo"
