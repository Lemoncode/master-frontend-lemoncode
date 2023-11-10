///-- OPTIONAL CHAINING **************************************************************************

/*
El operador optional chaining nos permite acceder en profundidad a propiedades de objetos de manera
segura, sin tener que realizar de forma explícita un chequeo para validar si todas las propiedades
de la cadena existen o no. Veamos la problemática y como este operador la resuelve:
*/

const user = {
  name: "Javi",
  // stats: {
  //   likes: 38,
  //   rt: 56,
  // },
  // friends: ["Santi", "Ana"],
  // greet: () => console.log("Hey there! Whats up"),
}

console.log(user.stats); // undefined. Acceso "seguro" porque user siempre existe como objeto.
console.log(user.stats.like); // undefined.like! no se puede acceder, undefined no es un objeto!

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

// De igual modo el optional chaining se puede utilizar para acceso seguro a arrays incluso para
// funciones, con un pequeño matiz sintáctico:
console.log(user?.friends[1]);    // SyntaxError
console.log(user?.friends?.[1]);  // Acceso seguro
console.log(user?.greet());       // SyntaxError
console.log(user?.greet?.());     // Acceso seguro

/*
IMPORTANTE: el operador optional chaining comprueba si una propiedad o referencia es 'nullish',
es decir, null o undefined. Si es nullish, cortocircuita devolviendo undefined, en caso contrario
continúa.
*/


///-- NULLISH COALESCING **************************************************************************

/*
El operador nullish coalescing es un operador lógico que devuelve el operando derecho cuando el
izquierdo es 'nullish', es decir, null o undefined. Viene a mejorar la forma en que asignamos
valores por defecto. Hasta ahora era frecuente utilicar el operador lógico OR (||) a tal efecto,
pero era problemático. ¿Por qué? Puesto que OR devolvería el operando derecho cuando el izquierdo
sea 'falsy'. Veámoslo:
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

// *** Asignaciones con operadores lógicos. ⚠ Bajo implementación ES2022.
let a = true;
a &&= false;    // a = a && false
console.log(a); // false
a ||= true;     // a = a && true
console.log(a); // true

// *** Asignaciones con operador nullish coalescing. ⚠ Bajo implementación ES2022.
let a = null;
a ??= 'unavailable';    // a = a ?? false
console.log(a); // false
