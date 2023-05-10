///-- REST/SPREAD OPERATOR ***********************************************************************

// A partir de 2015 con la llegada de ES6 podemos extender o agrupar los valores de los arrays
// gracias a los operadores "spread"/"rest".

// Podemos extender los valores de un array en un nuevo array:
const original = ["one", "two", "three"];
const copy = [...original]; // Extendemos cada elemento del array origen en el array destino
console.log(original); // ["one", "two", "three"]
console.log(copy); // ["one", "two", "three"]
// Plantear pregunta, ¿entonces, que nos dará esto?
console.log(original === copy); // false
console.log(original[0] === copy[0]); // true

// Cuando se hace "spread" de los items, se aplica una copia "poco profunda" o "shallow copy",
// es decir, los objetos no se clonan, se pasan por referencia.
const original = [{ name: "Alan" }, { name: "Evan" }, { name: "Ana" }];
const copy = [...original];
console.log(original[0]); // {name: "Alan"}
console.log(copy[0]); // {name: "Alan"}
console.log(original[0] === copy[0]); // true

// Si muto alguno de los objetos, se verá reflejado en ambos arrays:
copy[0].age = 23;
console.log(original[0]); // {name: "Alan", age: 23}
console.log(copy[0]); // {name: "Alan", age: 23}

// También se pueden extender valores de una rray como argumentos de una función:
function main(first, second, third) {
  console.log(first);
  console.log(second);
  console.log(third);
  console.log(arguments);
}
const values = ["hey", "ho", "let's go", "yay"];
main(...values);  // "hey"
// "ho"
// "let's go"
// Arguments(4) ["hey", "ho", "let's go", "yay" ... ]

// El operador "rest" hace justo lo contrario que "spread", aunque su notación es la misma: 
// agrupa argumentos en un array. Es decir, asigna todo los argumentos pasados a una funcion a
// elementos de un array. ¿Os acordáis de que las lambdas no tenían variable dinámica "arguments"?
// Se puede emular con el operador "rest":
const sum = (...nums) => nums.reduce((acc, num) => acc + num, 0);
console.log(sum()); // 0
console.log(sum(1, 2, 3)); // 6

// Cuando utilizamos "rest" podemos aislar argumentos iniciales y agrupar los restantes:
// ⚠ el operador "rest" siempre va el último
const sumAllButFirst = (_first, ...nums) => nums.reduce((acc, num) => acc + num, 0);
console.log(sumAllButFirst()); // 0
console.log(sumAllButFirst(1, 2, 3)); // 5


// A partir de ES9 (2018) podemos hacer "rest/spread" también en propiedades de objetos:

// Podemos extender propiedades existentes en un objeto, a otro objeto nuevo:
const original = {
  name: "Evan",
  surname: "Smith",
  country: "USA",
};
const copy = { ...original }; // Extendemos cada propiedad de "original" a otro objeto nuevo
console.log(original); // {name: "Evan",surname: "Smith",country: "USA"}
console.log(copy); // {name: "Evan",surname: "Smith",country: "USA"}
console.log(original === copy); // false
console.log(original.name === copy.name); // true

// De nuevo, la copia de propiedades es poco profunda o "shallow copy". No se clonan sino que se
// pasan por referencia.
const original = {
  name: "Evan",
  surname: "Smith",
  country: {
    id: 21,
    name: "Spain",
    iso3: "SPA",
  },
};

const copy = {...original};
console.log(copy.country); // {id: 21,name: "Spain",iso3: "SPA"}
console.log(original.country === copy.country); // true

// Asi pues un cambio de "country" se refleja en ambos objetos, el original y la copia.
copy.country.id = 23;
console.log(original.country); // {id: 23,name: "Spain",iso3: "SPA"}
console.log(copy.country); // {id: 23,name: "Spain",iso3: "SPA"}

// Una combinación potente es aplicar "destructuring" y "rest" al mismo tiempo para aislar
// propiedades de objetos en argumentos de funciones, por ejemplo:
const student = {
  name: "Evan",
  surname: "Smith",
  country: {
    id: 21,
    name: "Spain",
    iso3: "SPA",
  },
};

const excludeCountry = ({country, ...others}) => others;
const nameAndSurname = excludeCountry(student);
console.log(nameAndSurname); // {name: "Evan", surname: "Smith"}
// Esto es útil para eliminar propiedades de objetos de forma inmutable, o dicho de forma llana,
// para quedarnos "con lo que nos interesa".
