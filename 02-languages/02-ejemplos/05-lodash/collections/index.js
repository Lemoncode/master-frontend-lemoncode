import * as _ from 'lodash';

// countBy
// Crea un objeto cuya clave es el resultado de aplicar la función especificada y cuyo valor es
// el número de elementos que devuelven el mismo resultado
var elements = ['Matt', 'Jane', 'Eva', 'Tristan', 'Jax'];
console.log(_.countBy(elements, 'length'));
// { '3': 2, '4': 2, '7': 1 }


// groupBy
// Crea un objeto cuya clave es el resultado de aplicar la función especificada y cuyo valor el
// conjunto de elementos que devuelven el mismo resultado
var elements = ['Matt', 'Jane', 'Eva', 'Tristan', 'Jax'];
console.log(_.groupBy(elements, 'length'));
// {
//   '3': ['Eva', 'Jax'],
//   '4': ['Matt', 'Jane'],
//   '7': ['Tristan']
// }


// keyBy
// Crea un objeto cuya clave es el resultado de aplicar la función especificada y cuyo valor el
// objeto al que se le aplicó la función
var elements = ['Matt', 'Jane', 'Eva', 'Tristan', 'Jax'];
console.log(_.keyBy(elements, 'length'));
// { '3': 'Jax', '4': 'Jane', '7': 'Tristan' }


// orderBy
// Ordena los elementos por una o múltiples propiedades y diferente orden
var users = [
  { name: 'Mika', age: 40 },
  { name: 'Alan', age: 34 },
  { name: 'John', age: 34 },
  { name: 'Fred', age: 48 },
  { name: 'Paul', age: 36 },
];
console.log(_.orderBy(users, 'name', 'desc'));
// [
//   { name: 'Paul', age: 36 },
//   { name: 'Mika', age: 40 },
//   { name: 'John', age: 34 },
//   { name: 'Fred', age: 48 },
//   { name: 'Alan', age: 34 }
// ]


// Ordenar por varios campos
console.log(_.orderBy(users, ['age', 'name'], ['asc', 'desc']));
// [
//   { name: 'John', age: 34 },
//   { name: 'Alan', age: 34 },
//   { name: 'Paul', age: 36 },
//   { name: 'Mika', age: 40 },
//   { name: 'Fred', age: 48 }
// ]


// partition
// Separa los elementos del array según el resultado booleano de ejecutar la función especificada
var numbers = [1, 7, 2, 5, 3, 9, 1, 6];
var greaterThan5 = (num) => num > 5;
console.log(_.partition(numbers, greaterThan5));
// [[7, 9, 6], [1, 2, 5, 3, 1]]

var users = [
  { name: 'Mika', age: 40, active: false },
  { name: 'John', age: 34, active: true },
  { name: 'Fred', age: 48, active: true },
  { name: 'Paul', age: 36, active: false },
];
console.log(_.partition(users, 'active'));
// [
//   [{ name: 'John', age: 34, active: true }, { name: 'Fred', age: 48, active: true }],
//   [{ name: 'Mika', age: 40, active: false }, { name: 'Paul', age: 36, active: false }]
// ]


// reject
// El opuesto a filter. Devuelve aquellos elementos que no cumplan la condición.
var numbers = [1, 7, 2, 5, 3, 9, 1, 6];
var greaterThan5 = (num) => num > 5;
console.log(_.reject(numbers, greaterThan5));
// [1, 2, 5, 3, 1]


var users = [
  { name: 'Mika', age: 40, active: false },
  { name: 'John', age: 34, active: true },
  { name: 'Fred', age: 48, active: true },
  { name: 'Paul', age: 36, active: false },
];
console.log(_.reject(users, 'active'));
// [{ name: 'Mika', age: 40, active: false }, { name: 'Paul', age: 36, active: false }]


// sample
// Devuelve un elemento escogido de forma aleatoria. Aplicable tanto a arrays como objects
console.log(_.sample([10, 7, 3, 6, 1, 4, 16, 8, 2, 31])); // random
console.log(_.sample({ foo: 'bar', bar: 'baz', bax: 'bat' })); // random value

// sampleSize
// Devuelve tantas muestras aleatorias como especifiquemos
console.log(_.sampleSize([10, 7, 3, 6, 1, 4, 16, 8, 2, 31], 4)); // 4 números random
console.log(_.sampleSize({ x: 13, y: -1, z: 0 }, 2)) // 2 random values

// shuffle
// Desordena los elementos de un array o las propiedades de un objeto
console.log(_.shuffle([1, 2, 3, 4, 5])); // random
console.log(_.shuffle({ x: 13, y: -1, z: 0 })); // random property list

// sortBy
// Ordena en modo ascendente los elementos de un array según la función que pasemos como parámetro
// En caso de objeto se puede ordenar pasándole la propiedad
var users = [
  { name: 'Mika', age: 40, active: false },
  { name: 'John', age: 34, active: true },
  { name: 'John', age: 21, active: false },
  { name: 'Fred', age: 48, active: true },
  { name: 'Paul', age: 36, active: false },
];
console.log(_.sortBy(users, 'name'));
// [
//   { name: 'Fred', age: 48, active: true },
//   { name: 'John', age: 34, active: true },
//   { name: 'John', age: 21, active: false },
//   { name: 'Mika', age: 40, active: false },
//   { name: 'Paul', age: 36, active: false }
// ]


// Por varios campos
console.log(_.sortBy(users, ['name', 'age']));
// [
//   { name: 'Fred', age: 48, active: true },
//   { name: 'John', age: 21, active: false },
//   { name: 'John', age: 34, active: true },
//   { name: 'Mika', age: 40, active: false },
//   { name: 'Paul', age: 36, active: false }
// ]
