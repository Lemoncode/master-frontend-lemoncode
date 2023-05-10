///-- OBJETOS *******************************************************

/*
Datos estructurados siguiendo el formato clave-valor. A cada clave o 
alias lo llamamos propiedad.
*/

// Inicialización de objetos de forma literal, "object literals"
var person = { name: "John" }; // {} => inicializador de objetos

/* Las propiedades de un objeto también pueden inicializarse a partir
 de variables existentes */
var name = "John";
var person = { name: name };

/* Si los nombres de la propiedad y la variable coinciden, se puede
expresar de forma corta: */
var person = { name };

// Accediendo a propiedades
console.log(person.name); // "John"
console.log(person["name"]); // "John". Útil cuando el nombre de la propiedad nos viene dado por una variable.
console.log(person.lastname); // undefined

// Añadiendo nuevas propiedades
person.lastname = "Smith";
console.log(person.lastname); // "Smith"
person[21] = "twenty one";
console.log(person["21"]); // "twenty one"

// Las propiedades pueden ser a su vez otros objetos
person.country = { id: 5, name: "Spain" };
console.log(person.country); // { id: 5, name: "Spain" }

// Y también pueden ser funciones
person.greet = function () { console.log("Hello!"); };
console.log(person.greet); // function() { console.log("Hello!"); }
person.greet(); // logs "Hello!"
person["greet"](); // logs "Hello!"

// Iterando por las propiedades
/* [!] Used order === first assigned, first shown. */
for (var prop in person) {
  console.log(prop, person[prop]); // "21"        "twenty one"
}                                  // "name"      "John"
// "greet"     function() { console.log("Hello!"); }
// "lastname"  "Smith"
// "country"   {id: 5, name: "Spain"}


// Borrando propiedades
delete person.lastname;
console.log(person.lastname); // undefined
delete person.country.id;
console.log(person.country); // { name: "Spain" }

// [!] Comparando objetos
var boy = { age: 15 };
console.log(boy === { age: 15 }); // [!!!] false. Se comparan REFERENCIAS, no contenido.
console.log(boy === boy); // true
console.log(boy.toString()); // [object Object]


///-- ARRAYS *******************************************************

/*
Datos estructurados siguiendo un orden. Cada dato se identifica con un índice
que indica su posición dentro de la estructura.
*/

// Inicialización de arrays de forma literal.
var collection = ["hey", "ho", "let's go"]; // [] => Inicializador de arrays

// Accediendo a sus elementos
console.log(collection[0]); // "hey"
console.log(collection[3]); // undefined
console.log(collection.length); // 3

// Un array puede contener cualquier tipo de elemento
var mixedCollection = [1, 2, 3, "Go!", { object: true }];

// Equivalencia con un objeto:
var collection = {
  0: "hey",
  1: "ho",
  2: "let's go",
  length: 3,
};

// Añadiendo elementos al array:
collection.push("yay!");
console.log(collection); // ["hey", "ho", "let's go", "yay"]
collection[4] = "nice";
console.log(collection); // ["hey", "ho", "let's go", "yay", "nice"]
console.log(collection.length); // 5

// Sparse array: Solo almacena en memoria los valores que hayan sido asignados
collection[100] = "oops!";
console.log(collection); // ["hey", "ho", "let's go", "yay", "nice", empty x95, "oops!"]
console.log(collection.length); // 101

// Formas de iterar por los elementos de un array
// forEach()
collection.forEach(function (value) {
  console.log(value); // "hey", "ho", "let's go", "yay", "nice", "oops!"
});

// for(...)
for (var i = 0; i < collection.length; i++) {
  console.log(collection[i]); // "hey", "ho", "let's go", "yay", (x95) undefined, "oops!"
}

// [!] for..of disponible en ES6 para recorrer los items de un array.

// Comparando arrays
/* [!] Los arrays son objetos y por tanto implementan la misma comparación que éstos: */
var collection = [3];
console.log(collection === collection); // true
console.log(collection === [3]); // false. Different object.
console.log([] == ''); // true (type coertion). [].toString() => "" == ''
