///-- FUNCIONES ***********************************************************************************

// Tipar una función en TypeScript no es más que especificar los tipos de los argumentos que recibe
// y el tipo del valor que devuelve. Es importante tener en cuenta que aquellos parámetros que
// especifiquemos serán obligatorios, a menos que usemos un modificador de opcionalidad:

// Veamos un primer ejempo con funciones clásicas:
function shout(text: string, upperCase: boolean): string {
  return (upperCase ? text.toUpperCase() : text) + "!!!";
}

console.log(shout("hi")); // [ts] Expected 2 arguments, but got 1
console.log(shout("hi", true)); // "HI!!!"

// Su homólogo en arrow function:
const shout = (text: string, upperCase: boolean): string =>
  (upperCase ? text.toUpperCase() : text) + "!!!";

console.log(shout("hi")); // [ts] Expected 2 arguments, but got 1
console.log(shout("hi", true)); // "HI!!!"


// *** Argumentos opcionales y argumentos por defecto *********************************************

// Utilizando el operador [?] sobre un argumento podremos declararlo como opcional a la hora de 
// invocar la función:

const shout = (text: string, upperCase?: boolean): string =>
  (upperCase ? text.toUpperCase() : text) + "!!!";

// Si no pasamos explícitamente un argumento opcional su valor es, al igual que en otros casos
// ya vistos en JavaScript, undefined:
console.log(shout("hi")); // "hi!!!" ---> upperCase = undefined.

// Suele ser muy habitual en caso de argumentos opcionales establecer su valor por defecto, como ya 
// vimos en JavaScript. Cuando esto sucede hay 2 cosas a tener en cuenta:
//   - Primero, suele ser más legible no declarar el tipo del argumento y dejar que lo infiera del 
//     propio valor por defecto.
//   - Segundo, no podemos declararlo como opcional al mismo tiempo que ponemos valor por defecto. 
//     Esto es así porque en cuanto usamos valores por defecto TS lo reconoce automáticamente como
//     opcional.

const shout = (text: string, upperCase: boolean = true): string =>
  (upperCase ? text.toUpperCase() : text) + "!!!";

console.log(shout("hi")); // "HI!!!"


// *** Alias **************************************************************************************

// Hasta ahora, en los ejemplos vistos, el tipado de la funcion va integrado en la propia 
// declaración o definición de la función. Es decir, es un tipado en línea o inline. Sin embargo, 
// podemos extraer el tipo de una función aparte, y reusarlo cuando queramos. 
// A esto se le conoce como alias y para ello usamos el operador type:

type ShoutFunction = (text: string, upperCase?: boolean) => string;
const shout: ShoutFunction = (text, upperCase = true) =>
  (upperCase ? text.toUpperCase() : text) + "!!!";

console.log(shout("hi"));


// OPCIONAL: Reusando tipados de función con alias

type TextModifierFn = (text: string, modifier?: boolean) => string;

const shout: TextModifierFn = (text, upperCase = false) =>
  (upperCase ? text.toUpperCase() : text) + "!!!";

const hyphenize: TextModifierFn = (text, snake = false) => text.replace(" ", snake ? "_" : "-");

console.log(shout("hello world", true)); // HELLO WORLD!!!
console.log(hyphenize("hello world")); // hello-world
console.log(hyphenize("hello world", true)); // hello_world


// *** Funciones como argumentos ******************************************************************

// En el caso de pasar funciones como argumentos de otras, podemos tipar en línea dichos argumentos 
// del siguiente modo:

const shout = (text: string, exclamationCallback: () => string) =>
  text.toUpperCase() + exclamationCallback();

const exclamationGenerator = () => "!".repeat(Math.ceil(Math.random() * 10)); // Callback

console.log(shout("WoooW", exclamationGenerator));
console.log(shout("WoooW", exclamationGenerator));
console.log(shout("WoooW", exclamationGenerator));
console.log(shout("WoooW", exclamationGenerator));



// *** Sobrecarga de funciones ********************************************************************

function switchType(arg: number): string;
function switchType(arg: string): number;
function switchType(arg: string | number): string | number {
  if (typeof arg === "string") return Number(arg);
  else return String(arg);
}

const result1 = switchType("105");
console.log(result1, typeof result1);

const result2 = switchType(105);
console.log(result2, typeof result2);

switchType({});
        // ^^^ [ts] 1/2 Argument of type '{}' is not assignable to parameter of type 'number'
        // ^^^ [ts] 2/2 Argument of type '{}' is not assignable to parameter of type 'string'


// *** Tipando funciones con interfaces ***********************************************************

// O lo que es lo mismo, usando interfaces para diseñar funciones:

interface RepeatString {
  (text: string, n: number): string;
}

const repeatString: RepeatString = (text, n) => Array(n).fill(text).join(" ");

console.log(repeatString("echo", 3)); // "echo echo echo"

// ¿Para que es realmente útil esto?
// Para añadirle propiedades a una función. Ya dijimos que las funciones no dejan de ser objetos, y 
// por tanto podrían tener propiedades. De esta forma podríamos obligar a que una función tenga 
// ciertas propiedades tipadas de cierta forma:

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
