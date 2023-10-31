///-- DESTRUCTURING ******************************************************************************

// Destructuring es una técnica rápida para asignar propiedades de objetos a variables, o items
// de un array a variables.

// "DESTRUCTURING" SOBRE OBJETOS

// Ejemplo a mano, sin "destructuring":
const student = {
  name: "Evan",
  surname: "Smith",
  country: "USA",
};
const name = student.name;
const surname = student.surname;
console.log(name); // "Evan"
console.log(surname); // "Smith"

// Pero con "destructuring" podemos asignar propiedades ya existentes a variables de forma directa,
// en una línea:
const student = {
  name: "Evan",
  surname: "Smith",
  country: "USA",
};
const { name, surname } = student;
console.log(name); // "Evan"
console.log(surname); // "Smith"

// La de arriba es una forma abreviada a la notación clave-valor, por lo que es equivalente a
// hacer:
const student = {
  name: "Evan",
  surname: "Smith",
  country: "USA",
};
const { name: name, surname: surname } = student;
console.log(name); // "Evan"
console.log(surname); // "Smith"

// Aunque si queremos, también podemos reemplazar el nombre de las variables donde vamos asignando
// nuestras propiedades:
const student = {
  name: "Evan",
  surname: "Smith",
  country: "USA",
};
const { name: studentName, surname: studentSurname } = student;
console.log(studentName); // "Evan"
console.log(studentSurname); // "Smith"

// También podemos hacer un "destructuring" profundo, es decir, extraer propiedades de objetos
// anidados:
const student = {
  name: "Evan",
  surname: "Smith",
  country: {
    id: 21,
    name: "Spain",
    iso3: "SPA",
  },
};
const { name, country: { name: countryName, iso3 } } = student;
console.log(name); // "Evan"
console.log(countryName); // "Spain"
console.log(iso3); // "SPA"

// Incluso podemos aplicar "destructuring" sobre objetos que se pasan como argumento de una
// función:
const student = {
  name: "Evan",
  surname: "Smith",
  country: "USA",
};
const getName = ({ name }) => name;
console.log(getName(student)); // "Evan"

// "DESTRUCTURING" SOBRE ARRAYS

// Ejemplo a mano, sin "destructuring":
const students = ["Alan", "Evan", "Ana"];
const first = students[0];
const second = students[1];
const third = students[2];
const fourth = students[3];
console.log(first); // "Alan"
console.log(second); // "Evan"
console.log(third); // "Ana"
console.log(fourth); // undefined

// Pero con "destructuring" podemos asignar elementos existentes en el array a variables de forma
// directa, en una línea:
// ⚠ El orden en la asignación se mantiene
const students = ["Alan", "Evan", "Ana"];
const [first, second, third, fourth] = students;
console.log(first); // "Alan"
console.log(second); // "Evan"
console.log(third); // "Ana"
console.log(fourth); // undefined

// Podemos omitir elementos intermedios usando la coma (,)
const students = ["Alan", "Evan", "Ana"];
const [, , third] = students;
console.log(third); // "Ana"

// Se puede aplicar "destructuring" sobre arrays pasados como argumento de una función:
const students = ["Alan", "Evan", "Ana"];
const getSecond = ([, second]) => second;
console.log(getSecond(students)); // "Evan"

// También se puede aplicar "destructuring" profundo en arrays bidimensionales.
const matrix = [
  [0, 0, 0],
  [0, 10, 0],
  [0, 0, 0],
];

const [, [, center]] = matrix;
console.log(center); // 10;

// "DESTRUCTURING" PARA REASIGNAR VARIABLES

// Se pueden hacer cosas bastante bizarras con el destructuring, como por ejemplo hacer un swap de
// variables de una sola vez. Veamos:

let a = "a";
let b = "b";

// Swap clásico, nos tenemos que apoyar en variables auxiliares
let temp = a;
a = b;
b = temp;

console.log(a);
console.log(b);

// Sin embargo, recurriendo al destrúcturing, se puede hacer un swap inmediato, en una sola línea:
[a, b] = [b, a];

console.log(a);
console.log(b);

// El equivalente con destructuring de objetos podría ser:
({ a: b, b: a } = { a, b });
