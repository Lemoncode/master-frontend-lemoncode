///-- OBJETOS ************************************************************************************

/*
Datos estructurados siguiendo el formato clave-valor.
A cada clave o alias lo llamamos propiedad.
*/

// Inicialización de objetos de forma literal, "object literals"
const person = { name: "John" }; // {} => inicializador de objetos

// Las propiedades de un objeto también pueden inicializarse a partir de variables existentes
const name = "John";
const person = { name: name };

// Si los nombres de la propiedad y la variable coinciden, se puede expresar de forma corta:
const person = { name };

// Accediendo a propiedades
console.log(person.name); // "John"
console.log(person.lastname); // undefined

// Acceso con corchetes, útil cuando la propiedad nos viene dada por una variable.
const propName = "name";
console.log(person[propName]); // John

// *** INCISO: Acceso con corchetes + literal, útil para acceder a propiedades numéricas*****
const person = { name, 43: true, "3dots": true };
console.log(person[43]); // true
console.log(person["43"]); // true
console.log(person["3dots"]); // true
// **********************************************************************************************

// Añadiendo nuevas propiedades
person.lastname = "Smith";
console.log(person.lastname); // "Smith"
person[21] = "twenty one";
console.log(person["21"]); // "twenty one"

// Las propiedades pueden ser a su vez otros objetos que llamaremos objetos anidados
person.country = { id: 5, name: "Spain" };
console.log(person.country); // { id: 5, name: "Spain" }

// Y también pueden ser funciones
person.greet = function () {
  console.log("Hello!");
};
console.log(person.greet); // function() { console.log("Hello!"); }
person.greet(); // logs "Hello!"
person["greet"](); // logs "Hello!"

// Iterando por las propiedades
// ⚠ Orden de aparición === orden de asignación/creación, excepto para propiedades puramente
// numéricas que aparecerán primero por orden ascendente.
for (const prop in person) {
  console.log(prop, person[prop]); 
} 
// "21"        "twenty one"
// "name"      "John"
// "greet"     function() { console.log("Hello!"); }
// "lastname"  "Smith"
// "country"   {id: 5, name: "Spain"}

// Borrando propiedades
delete person.lastname;
console.log(person.lastname); // undefined
delete person.country.id;
console.log(person.country); // { name: "Spain" }

// ⚠ Comparando objetos
const boy = { age: 15 };
console.log(boy === { age: 15 }); // ⚠⚠ false. Se comparan REFERENCIAS! NO SE COMPARA CONTENIDO!.
console.log(boy === boy); // true
console.log(boy.toString()); // [object Object]


///-- ARRAYS *************************************************************************************

/*
Datos estructurados siguiendo un orden. Cada dato se identifica con un índice que indica su
posición dentro de la estructura.
*/

// Inicialización de arrays de forma literal.
const collection = ["hey", "ho", "let's go"]; // [] => Inicializador de arrays

// Accediendo a sus elementos
console.log(collection[0]); // "hey"
console.log(collection[3]); // undefined
console.log(collection.length); // 3

// Un array puede contener cualquier tipo de elemento
const mixedCollection = [1, 2, 3, "Go!", { object: true }];

// *** INCISO: Equivalencia con un objeto ... los arrays SON OBJETOS! ****************************
const collectionObject = {
  0: "hey",
  1: "ho",
  2: "let's go",
  length: 3,
};
console.log(collection, collectionObject); // Inspeccionar ambas estructuras
//************************************************************************************************

// Añadiendo elementos al array:
collection.push("yay!");
console.log(collection); // ["hey", "ho", "let's go", "yay"]
collection[4] = "nice";
console.log(collection); // ["hey", "ho", "let's go", "yay", "nice"]
console.log(collection.length); // 5

// Sparse array: Solo almacena en memoria los valores que hayan sido asignados. Es posible puesto
// que los arrays son objetos con claves numéricas, no hay reserva de memoria consecutiva.
collection[100] = "oops!";
console.log(collection); // ["hey", "ho", "let's go", "yay", "nice", empty x95, "oops!"]
console.log(collection.length); // 101

// Formas de iterar por los elementos de un array
// 1. forEach()
collection.forEach(function (item) {
  console.log(item); // "hey", "ho", "let's go", "yay", "nice", "oops!"
});

// 2. for(...)
for (let i = 0; i < collection.length; i++) {
  console.log(collection[i]); // "hey", "ho", "let's go", "yay", (x95) undefined, "oops!"
}

// 3. for..of (azúcar sintáctico para objetos iterables)
for (const item of collection) {
  console.log(item); // "hey", "ho", "let's go", "yay", (x95) undefined, "oops!"
}

// Un string, por ejemplo, implementa el patrón iterable y puede ser recorrido con for..of
for (const char of "javi") {
  console.log(char); // "j", "a", "v", "i"
}

// Comparando arrays
// ⚠ Los arrays son objetos y por tanto implementan la misma comparación que éstos:
const collection = [3];
console.log(collection === [3]); // false. Different object.
console.log(collection === collection); // true
console.log([] == ""); // true (type coertion). [].toString() => "" == ''


///-- MUTABILIDAD EN ESTRUCTURAS DE DATOS ********************************************************

/*
En javascript tenemos, principalmente, dos formas de declarar variables: "let" y "const".
Estas 2 formas diferenciadas se entenderán mejor cuando expliquemos una tercera, mediante la 
keyword "var", que se empleaba de forma primigenia hasta la llegada de "let" y "const".

Las diferencias entre ellas tienen más que ver con su ámbito y su capacidad de ser re-declaradas
y re-asigandas. Y esto último es muy importante: RE-ASIGNCIÓN.

UN ERROR COMÚN es pensar que "const" hace "constante" cualquier variable. Es decir, que "const"
de algún modo congela el valor que le hayamos asignado, no siendo posible mutarlo en la práctica.
PERO ESTO ES FALSO! "const" simplemente significa que la variable NO puede ser RE-ASIGNADA!

El motivo principal para pensar así suele venir de los valores primitivos. Al declararlos con
"const" solemos pensar: "ya no puedo cambiarlo nunca más". Pero realmente, lo que no podemos es
RE-ASIGNAR la variable declarada con "const". Los primitivos ya son no-mutables por naturaleza, 
"const" no les confiere ningún superpoder para 'congelarse'.
*/

const primitive = true;
primitive = false; // TypeError: Assignment to constant variable

/*
SIN EMBARGO, cuando declaramos con "const" estructuras de datos, si que podemos mutarlas puesto
que "const" no nos previene de ello, simplemente evita que reasignemos la variable.
*/

const list = ["hey", "ho", "let's go"];
list[2] = "yay";
console.log(list); // ["hey", "ho", "yay"]
list = []; // TypeError: Assignment to constant variable


const user = {
  name: "Adam",
  age: 12,
};
user.age = 22;
console.log(user); // {"name": "Adam", "age": 22}
user = {}; // TypeError: Assignment to constant variable