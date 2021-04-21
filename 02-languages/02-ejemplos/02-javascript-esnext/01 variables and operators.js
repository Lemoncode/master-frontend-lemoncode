///-- VARIABLES LET/CONST *****************************************************

// "let" y "const" son 2 nuevas palabras reservadas en ES6 para declarar
// variables. Presentan una notable diferencia con respecto a "var",
// y es que tienen ámbito de bloque ("block scope") por lo tanto 
// se redefinen dentro de bloques tales como "if/else" o bucles "for".
// Mientras que "var" tenía ámbito de función (contexto de ejecución)
// ahora con "let" y "const" el ámbito es de bloque.
// Esto tiene una implicación: el "hoisting" tampoco es aplicado a 
// variables declaradas con "let" o "const".
// ¿Cuál es la diferencia entre ellas? "let" está pensado para valores
// reasignables, permite declarar la variable (con inicialización opcional)
// y modificarla tantas veces como queramos. "const", sin embargo, es
// constante, por lo que debe ser declarada e inicializada obligatoriamente,
// y no puede ser reasignada en un futuro.

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

// Debemos aclarar, sin embargo, que no es lo mismo reasignar que mutar. "const" no es
// reasignable (no podemos cambiar la referencia a la que apunta una vez declarada) pero
// en caso de que el contendio de la variable sea un objeto, si que podemos mutar sus
// propiedades o métodos, sin que esto viole su característica de no-reasignable, puesto
// que la referencia al objeto sigue siendo la misma.
// [!] Asi que importante, no entendais el "const" como contenido constante, sino 
// referencia constante.
const list = ["hey", "ho", "let's go"];
list[2] = "yay";
console.log(list); // ["hey", "ho", "yay"]

const user = {
  name: "Adam",
  age: 12,
};
user.age = 22;
console.log(user); // {"name": "Adam", "age": 22}



// HOISTING

// A diferencia de "var", aquellas variables que se declaren usando
// "let" y "const" no les será aplicado el "hoisting":

// Con "var" gracias al hoisting:
function main() {
  console.log(message);
  var message = "hello";
  console.log(message);
}
main(); // undefined
        // "hello"

// Si cambiamos la declaración a "let", no habrá hoisting y la función
// lanzará un error:
function main() {
  console.log(message);
  let message = "hello";
  console.log(message);
}
main(); // Uncaught ReferenceError: message is not defined



// ÁMBITO

// El ámbito pasa a ser de bloque, variables "let" o "const" declaradas
// en bloques no puede ser accedidas desde fuera:
var list = [1, 2, 3];
for (let i = 0; i < list.length; i++) {
  console.log(list[i]);
}
console.log(i); // Uncaught ReferenceError: i is not defined

// Otro ejemplo con "scope"
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

// *Si reemplazamos const por var en este ejemplo vemos que el funcionamiento
// con el mood "happy" no es el esperado.


// [!] A partir de ahora OLVIDAOS DE VAR :P :)


///-- OPERADORES *******************************************************

// *** Optional chaining (encadenamiento opcional). [!] Bajo implementación ES2020.

/*
El operador optional chaining nos permite acceder en profundidad a propiedades de 
objetos de manera segura, sin tener que realizar de forma explícita un chequeo
para validar si todas las propiedades de la cadena existen o no. Veamos la
problemática y como este operador la resuelve:
*/
const user = {
  name: "Javi",
  // stats: {
  //   likes: 38,
  //   rt: 56,
  // }
  // friends: ["Santi", "Ana"],
  // greet: () => console.log("Hey there! Whats up");
}

console.log(user.stats); // undefined. Acceso "seguro" porque user siempre existe como objeto.
console.log(user.stats.like); // undefined.like! no se puede acceder porque undefined no es un objeto.

// Forma clásica de solventar el problema. Chequeos inline -> Engorroso
console.log(user && user.stats && user.stats.likes);
// Forma aún más tediosa
// if(Boolean(user)) {
//   if (Boolean(user.stats)) {
//     if (Boolean(user.stats.likes)) {
//       console.log(user.stats.likes);
//     }
//   }
// }
// Con el operador optional chaining:
console.log(user?.stats?.likes);

// De igual modo el optional chaining se puede utilizar para acceso seguro a arrays
// incluso para funciones, con un pequeño matiz sintáctico:
console.log(user?.friends[1]);    // SyntaxError
console.log(user?.friends?.[1]);  // Acceso seguro
console.log(user?.greet());       // SyntaxError
console.log(user?.greet?.());       // Acceso seguro

/*
IMPORTANTE: el operador optional chaining comprueba si una propiedad o referencia
es 'nullish', es decir, null o undefined. Si es nullish, cortocircuita devolviendo
undefined, en caso contrario continúa.
*/


// *** Nullish coalescing. [!] Bajo implementación ES2020.

/*
El operador nullish coalescing es un operador lógico que devuelve el operando derecho
cuando el izquierdo es 'nullish', es decir, null o undefined. Viene a mejorar la forma
en que asignamos valores por defecto. Hasta ahora era frecuente utilicar el operador
lógico OR (||) a tal efecto, pero era problemático. ¿Por qué? Puesto que OR devolvería
el operando derecho cuando el izquierdo sea 'falsy'. Veámoslo:
*/

const quantity = 43;
console.log(quantity || "unknown"); 
// Este uso del cortocircuito del OR ha sido muy común para devolver valores por defecto.
// Pero ... ¿qué pasa si quantity es 0? Probarlo! (devolvería 'unknown' cuando no lo es).

// Con el nullish coalescing comprobamos que el valor sea nullish en lugar de falsy:
console.log(quantity ?? "unknown");

// Es común combinar nullish coalescing con optional chaining para hacer accesos seguros
// y con valores por defecto en caso de no existir. Siguiendo el ejemplo anterior:
console.log(user?.stats?.likes ?? "Not available");

// IMPORTANTE: 
// Estos dos operadores permiten construir código robusto y resiliente a errores.

// *** Asignaciones con operadores lógicos. [!] Bajo implementación ES2022.
let a = true;
a &&= false;    // a = a && false
console.log(a); // false
a ||= true;     // a = a && true
console.log(a); // true

// *** Asignaciones con operador nullish coalescing. [!] Bajo implementación ES2022.
let a = null;
a ??= 'unavailable';    // a = a ?? false
console.log(a); // false