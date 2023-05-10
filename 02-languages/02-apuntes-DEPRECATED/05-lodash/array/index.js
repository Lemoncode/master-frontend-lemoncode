import * as _ from 'lodash';

// chunk (immutable)
// Agrupa los elementos del array en subarrays de longitud n
var measures = [5.12, 42.20, 43.1, 0.10, 19.20, -32.1, 25.3, 22.2];
var grouppedInPairs = _.chunk(measures, 4);
console.log(grouppedInPairs);
// [ [ 5.12, 42.2, 43.1, 0.1 ], [ 19.2, -32.1, 25.3, 22.2 ] ]


// difference (inmutable), pullAll (mutable)
// Devuelve los items del primer array que no pertenezcan a los siguientes
var webLangs = ['Ruby', 'Python', 'JavaScript', 'PHP', 'Java', 'C#'];
var mobileLangs = ['Java', 'Objective-C', 'Swift', 'C#'];

var difference = _.difference(webLangs, mobileLangs);
console.log(difference);
// ['Ruby', 'Python', 'JavaScript', 'PHP']


// differenceBy (inmutable) pullAllBy (mutable)
// Igual que difference pero se le pasa una función que es aplicada antes
// de realizar la búsqueda
var positives = [14, 22, 5, 10, 20, 17, 53];
var negatives = [-16, -1, -15, -10, -71, -9, -5];

var difference = _.differenceBy(positives, negatives, Math.abs);
console.log(difference);
// [ 14, 22, 20, 17, 53 ]


// Se puede aplicar con colecciones objetos donde en lugar de una función
// se le pase una o varias propiedades
var animalCollection1 = [
  { type: 'dog', name: 'Mishka' },
  { type: 'hamster', name: 'Jasper' },
  { type: 'cat', name: 'Kata' },
];
var animalCollection2 = [
  { type: 'dog', name: 'Toby' },
  { type: 'cat', name: 'Luna' },
  { type: 'fish', name: 'Bob' },
];

var difference = _.differenceBy(animalCollection1, animalCollection2, 'type');
console.log(difference);
// [{ type: 'hamster', name: 'Jasper' }]


// differenceWith (inmutable), pullAllWith (mutable)
// Igual que differenceBy pero en vez de un modificador se le pasa un comparador
// por cada elemento del primero se itera sobre todos los del segundo

var wordCollection1 = ['trabaja', 'plasma', 'las', 'palabras', 'hazlas', 'balas'];
var wordCollection2 = ['atrapa', 'ráfagas', 'sal', 'machaca', 'cada', 'sala'];

var sameLength = (element1, element2) => element1.length === element2.length;
var difference = _.differenceWith(wordCollection1, wordCollection2, sameLength);
console.log(difference);
// ['palabras', 'balas']


// Se puede aplicar a colecciones objetos
var coordinatesCollection1 = [
  { x: -10, y: 21 },
  { x: 30, y: -4 },
  { x: 12, y: 0 },
];
var coordinatesCollection2 = [
  { x: 3, y: 3 },
  { x: -1, y: 0 },
  { x: 12, y: -8 },
];

var sameY = (element1, element2) => element1.y === element2.y;
var difference = _.differenceWith(coordinatesCollection1, coordinatesCollection2, sameY);
console.log(difference);
// [{ x: -10, y: 21 }, { x: 30, y: -4 }]


// drop (inmutable)
// Elimina tantos elementos del principio como le especifiquemos
var notes = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si', 'do'];
var chunk = _.drop(notes, 2);
console.log(chunk);
// ['mi', 'fa', 'sol', 'la', 'si', 'do']


// dropRight (inmutable)
// Elimina tantos elementos del final como le especifiquemos
var notes = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si', 'do'];
var chunk = _.dropRight(notes, 2);
console.log(chunk);
// ['do', 're', 'mi', 'fa', 'sol', 'la']


// dropWhile (inmutable)
// Va eliminando elementos del principio hasta que la función da false
var multipleBy2And3 = (num) => num % 2 === 0 && num % 3 === 0;
var numbers = [18, 36, 48, 6, 96, 50, 48, 100, 4, 34, 67];
var result = _.dropWhile(numbers, multipleBy2And3);
console.log(result);
// [50, 48, 100, 4, 34, 67]


// dropRightWhile (immutable)
// Va eliminando elementos del final hasta que la función da false
var lowerThan10 = (num) => num > 10;
var numbers = [18, 36, 48, 6, 96, 50, 48, 100, 4, 34, 67];
var result = _.dropRightWhile(numbers, lowerThan10);
console.log(result);
// [18, 36, 48, 6, 96, 50, 48, 100, 4]


// flatten (inmutable)
// Aplana el array un nivel
var elements = [1, 2, [3, 4], [[5]], [[[6]]]];
var flattened = _.flatten(elements);
console.log(flattened);
// [1, 2, 3, 4, [5], [[6]]]


// flattenDeep (inmutable)
// Aplana el array con profundidad
var elements = [1, 2, [3, 4], [[5]], [[[6]]]];
var flattened = _.flattenDeep(elements);
console.log(flattened);
// [1, 2, 3, 4, 5, 6]


// flattenDepth (inmutable)
// Aplana el array con hasta la profundidad que le especifiques
var elements = [1, 2, [3, 4], [[5]], [[[6]]]];
var flattened = _.flattenDepth(elements, 3);
console.log(flattened);
// [1, 2, 3, 4, 5, 6]


// fromPairs (inmutable)
// Crea un array compuesto por parejas de clave-valor
var serializedArray = [
  ['name', 'Santiago'],
  ['password', 'test'],
  ['role', 'user'],
];
var user = _.fromPairs(serializedArray);
console.log(user);
// { name: 'Santiago', password: 'test', role: 'user' }


// toPairs (inmutable)
// Crea un array basándose en las propiedades de un objeto y su valor
var style = {
  color: 'red',
  padding: 10,
  margin: 20,
  textTransform: 'uppercase',
};
var serialized = _.toPairs(style);
console.log(serialized);
// [['color', 'red'], ['padding', 10], ['margin', 20], ['textTransform', 'uppercase']]


// intersection (inmutable)
// Crea un array con los valores que se repiten entre diferentes arrays
var frontend = ['HTML', 'CSS', 'JavaScript', 'WebAssembly'];
var backend = ['C#', 'Java', 'Python', 'JavaScript', 'Ruby'];
var repeatedLangs = _.intersection(frontend, backend);
console.log(repeatedLangs);
// ['JavaScript']


// intersectionBy (inmutable)
// Realiza intersection aplicando previamente una función en los elementos
// Ojo! Coge los elementos del primer array si los elementos no son iguales
var twoSquared = (num) => Math.pow(num, 2);
var positives = [17, 2, 10, 22, 5];
var negatives = [-6, -14, -2, -5];
var sameSquare = _.intersectionBy(positives, negatives, twoSquared);
console.log(sameSquare);
// [2, 5]


// Se pueden aplicar sobre objetos para obtener aquellos con las mismas propiedades
// Devuelve del primer array si son diferentes
var inputCollection1 = [
  { type: 'text', value: 'foo' },
  { type: 'number', value: 23 },
];
var inputCollection2 = [
  { type: 'email', value: 'user@example.com' },
  { type: 'text', value: 'user' },
];
var intersection = _.intersectionBy(inputCollection1, inputCollection2, 'type');
console.log(intersection);
// [{ type: 'text', value: 'foo' }]


// intersectionWith (inmutable)
// Realiza intersection aplicando un comparador. Al igual que intersectionBy
// Si el elemento no es igual coge el del primer array
var coordinatesCollection1 = [
  { x: 1, y: 3 },
  { x: 3, y: -1 },
];
var coordinatesCollection2 = [
  { x: 3, y: 2 },
  { x: -1, y: 3 },
];

var lowerY = (coord1, coord2) => coord1.y < coord2.y;
var intersection = _.intersectionWith(coordinatesCollection1, coordinatesCollection2, lowerY);
console.log(intersection);
// [{ x: 3, y: -1 }]


// sortedIndex (inmutable)
// Devuelve el índice donde un elemento debería ser insertado para mantener el orden
// en el array
var sortedNumbers = [10, 20, 30, 40, 50];
var num = 25;
var index = _.sortedIndex(sortedNumbers, num);
console.log(index);
// 2


// sortedIndexBy (inmutable)
// Ejecuta sortIndex pero aplicando previamente una función
var sortedNumbers = [10, 20, 30, 40, 50];
var num = 15;
var divideBy3 = (num) => num % 2 === 0 ? num / 2 : num;
var index = _.sortedIndexBy(sortedNumbers, num, divideBy3);
console.log(index);
// 2


// También con objetos
var coordinates = [
  { x: 0, y: 3 },
  { x: 2, y: 5 },
  { x: 7, y: 8 },
  { x: 10, y: 10 },
];
var coordinate = { x: 3, y: 12 };
var index = _.sortedIndexBy(coordinates, coordinate, 'x');
console.log(index);
// 2


// sortedLastIndex (inmutable)
// Como sortedIndex pero te devuelve el último índice aplicable
var sortedNumbers = [1, 2, 2, 2, 3, 4, 5];
var num = 2;
var index = _.sortedLastIndex(sortedNumbers, num);
console.log(index);
// 4


// sortedLastIndexBy (inmutable)
// Como sortIndexBy pero devolviendo el último índice aplicable
var sortedNumbers = [10, 20, 30, 30, 30, 30, 40, 50];
var num = 15;
var divideBy3 = (num) => num % 2 === 0 ? num / 2 : num;
var index = _.sortedLastIndexBy(sortedNumbers, num, divideBy3);
console.log(index);
// 6


// También con objetos
var coordinates = [
  { x: 0, y: 3 },
  { x: 2, y: 5 },
  { x: 2, y: 4 },
  { x: 2, y: 7 },
  { x: 7, y: 8 },
  { x: 10, y: 10 },
];
var coordinate = { x: 2, y: 12 };
var getX = ({ x }) => x;
var index = _.sortedLastIndexBy(coordinates, coordinate, 'x');
console.log(index);
// 4


// union (inmutable)
// Devuelve un array de valores únicos de todos los arrays
var project1Empoyees = ['Anne', 'Paul', 'Jordi'];
var project2Employees = ['Alex', 'Jordi', 'Peter'];
var project3Employees = ['Peter', 'Jack', 'Mary'];
var employees = _.union(project1Empoyees, project2Employees, project3Employees);
console.log(employees);
// ['Anne', 'Paul', 'Jordi', 'Alex', 'Peter', 'Jack', 'Mary']


// unionBy (inmutable)
// Devuelve un array de valores únicos entre arrays aplicándoles previamente una función
const getNameLength = (name) => name.length;
var project1Empoyees = ['Anne', 'Paul', 'Jordi'];
var project2Employees = ['Alex', 'Jordi', 'Peter'];
var project3Employees = ['Peter', 'Jack', 'Mary'];
var employees = _.unionBy(project1Empoyees, project2Employees, project3Employees, getNameLength);
console.log(employees);
// ['Anne', 'Jordi']


// También con objetos
var coordinatesCollection1 = [
  { x: 0, y: 3 },
  { x: 2, y: 5 },
  { x: 2, y: 4 },
];
var coordinatesCollection2 = [
  { x: 0, y: 7 },
  { x: 1, y: 8 },
  { x: 2, y: 10 },
];
var union = _.unionBy(coordinatesCollection1, coordinatesCollection2, 'x');
console.log(union);
// [{ x: 0, y: 3 }, { x: 2, y: 5 }, { x: 1, y: 8 }]


// unionWith (inmutable)
// Devuelve un array de valores únicos entre arrays mediante un comparador
// Primero saca los únicos del primer array y de ahí va mirando los siguientes
var project1Empoyees = ['Anne', 'Paul', 'Jordi', 'Aaron'];
var project2Employees = ['Jack', 'Peter', 'Mary', 'Janne'];
var project3Employees = ['Alex', 'John', 'Bob', 'Patricia'];
var startsWithSameLetter = (emp1, emp2) => emp1.charAt(0) === emp2.charAt(0);
var employees = _.unionWith(project1Empoyees, project2Employees, project3Employees, startsWithSameLetter);
console.log(employees);
// ['Anne', 'Paul', 'Jordi', 'Mary', 'Bob']


// También con objetos
var coordinatesCollection1 = [
  { x: 0, y: 3 },
  { x: 2, y: 0 },
  { x: 2, y: 4 },
];
var coordinatesCollection2 = [
  { x: 4, y: 7 },
  { x: -2, y: 0 },
  { x: 0, y: 6 },
];
const equalsX = (coord1, coord2) => coord1.x === coord2.x;
var union = _.unionWith(coordinatesCollection1, coordinatesCollection2, equalsX);
console.log(union);
// [{ x: 0, y: 3 }, { x: 2, y: 0 }, { x: 4, y: 7 }, { x: -2, y: 0 }]


// uniq (inmutable), sortedUniq (inmutable)
// Crea un array con valores únicos
var elements = [7, 1, 5, 3, 4, 6, 3, 4, 7, 1];
var uniqueElements = _.uniq(elements);
console.log(uniqueElements);
// [7, 1, 5, 3, 4, 6]


// uniqBy (inmutable), sortedUniqBy(inmutable)
// Crea un array con valores únicos previamente pasados por una función
var elements = [30, 54, 12, 32, 44, 10, 62, 4, 72];
var getTens = (num) => Math.trunc(num / 10);
var uniqueElements = _.uniqBy(elements, getTens);
console.log(uniqueElements);
// [30, 54, 12, 44, 62, 4, 72]


// También con objetos
var requests = [
  { method: 'GET', url: 'http://example.com' },
  { method: 'POST', url: 'http://google.es' },
  { method: 'PUT', url: 'http://lemoncode.net' },
  { method: 'GET', url: 'http//campus.lemoncode.net' },
  { post: 'DELETE', url: 'http://myapp.com/api/users/11' },
];
var uniqueRequestsByMehtod = _.uniqBy(requests, 'method');
console.log(uniqueRequestsByMehtod);
// [
//   { method: 'GET', url: 'http://example.com' },
//   { method: 'POST', url: 'http://google.es' },
//   { method: 'PUT', url: 'http://lemoncode.net' },
//   { post: 'DELETE', url: 'http://myapp.com/api/users/11' }
// ];


// uniqWith (inmutable)
// Al igual que uniq pero comparando elementos
var elements = [30, 54, 12, 32, 44, 10, 62, 4, 72];
var biggerThanElementPlus10 = (num1, num2) => num2 + 10 > num1;
var uniqueElements = _.uniqWith(elements, biggerThanElementPlus10);
console.log(uniqueElements);
// [30, 54, 72]


// También con objetos
var elements = [
  { url: 'www.example.com/hello', id: 22 },
  { url: 'www.example.com/hello', id: 22 },
  { url: 'www.example.com/hello-how-are-you', id: 23 },
  { url: 'www.example.com/i-like-pie', id: 24 }
];
const sameId = (req1, req2) => req1.id === req2.id;
var uniqueElements = _.uniqWith(elements, sameId);
console.log(uniqueElements);
// [
//   { url: 'www.example.com/hello', id: 22 },
//   { url: 'www.example.com/hello-how-are-you', id: 23 },
//   { url: 'www.example.com/i-like-pie', id: 24 }
// ]


// without (inmutable), pull (mutable)
// Crea un array excluyendo los elementos que les pasemos como parámetros
var elements = ['lorem', 'ipsum', 'dolor', 'sit', 'amen'];
var healtherElements = _.without(elements, 'dolor');
console.log(healtherElements);
// ['lorem', 'ipsum', 'sit', 'amen']


// xor (inmutable)
// Crea un array con la diferencia simétrica entre los arrays pasados como parámetros
var project1Empoyees = ['Anne', 'Paul', 'Jordi'];
var project2Employees = ['Alex', 'Jordi', 'Paul'];
var project3Employees = ['Jordi', 'Jack', 'Anne'];
var symDiff = _.xor(project1Empoyees, project2Employees, project3Employees);
console.log(symDiff);
// ['Alex', 'Jack']


// xorBy (inmutable)
// Igual que xor pero aplicando una función previamente
var measures1 = [1.2, 4.2, 3.9, 4.6, 3.5, 5.5];
var measures2 = [6.3, 3.5, 2.3, 8.7, 1.8, 9.0];
var symDiff = _.xorBy(measures1, measures2, Math.floor);
console.log(symDiff);
// [4.2, 5.5, 6.3, 2.3, 8.7, 9]


// También con objetos
var group1 = [
  { id: 12, name: 'Jennefer' },
  { id: 31, name: 'George' },
  { id: 21, name: 'Paula' },
];
var group2 = [
  { id: 31, name: 'George' },
  { id: 11, name: 'Jeb' },
  { id: 12, name: 'Jennefer' },
];
var symDiff = _.xorBy(group1, group2, 'name');
console.log(symDiff);
// [{ id: 21, name: 'Paula' }, { id: 11, name: 'Jeb' }]


// xorWith (inmutable)
// Crea un array con la diferencia simétrica aplicando un comparador
// Si da verdadero considera que son iguales. También elimina duplicados.
var group1 = [3, 6, 1, 3, 8];
var group2 = [12, 2, 14, 37];
var method = (num1, num2) => num1 % 2 === 0 && num1 > num2;
var symDiff = _.xorWith(group1, group2, method);
console.log(symDiff);
// [3, 1, 3, 37]


// También con objetos
var coordinatesCollection1 = [
  { x: 0, y: 3 },
  { x: 2, y: 0 },
  { x: 2, y: 4 },
];
var coordinatesCollection2 = [
  { x: 4, y: 7 },
  { x: -2, y: 0 },
  { x: 0, y: 6 },
];
const equalsX = (coord1, coord2) => coord1.x === coord2.x;
var symDiff = _.xorWith(coordinatesCollection1, coordinatesCollection2, equalsX);
console.log(symDiff);
// [{ x: 2, y: 0 }, { x: 4, y: 7 }, { x: -2, y: 0 }]

