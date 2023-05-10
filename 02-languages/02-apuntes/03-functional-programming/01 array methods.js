// ARRAY METHODS **********************************************************

// [MAP]
// Map es un método que realiza una iteración sobre todos los elementos de un array y devuelve
// como resultado un nuevo array aplicando sobre cada elemento una función transformadora
const getArea = ({ width, height }) => width * height;
const rectangles = [
  { width: 18, height: 2 },
  { width: 10, height: 9 },
  { width: 2, height: 4 },
  { width: 8, height: 3 },
];

console.log(rectangles.map(getArea));

// Implementación imperativa de map:
const map = (collection, transform) => {
  const result = [];
  for (let element of collection) {
    result.push(transform(element));
  }
  return result;
};

console.log(map(rectangles, getArea));

// [FILTER]
// Filter es un método que realiza una iteración sobre todos los elementos de un array y devuelve
// como resultado un nuevo array con los elementos que devuelvan verdadero al aplicarse un predicado
// Predicado: función que devuelve un valor booleano
const hasBigArea = (rectangle) => getArea(rectangle) > 50;
console.log(rectangles.filter(hasBigArea));

// Implementación imperativa de filter
const filter = (collection, predicate) => {
  const result = [];
  for (let element of collection) {
    if (predicate(element)) {
      result.push(element);
    }
  }
  return result;
}

console.log(filter(rectangles, hasBigArea));

// [SOME]
// Some es un método que realiza una iteración sobre todos los elementos de un array y devuelve
// true si hay algún elemento al que al aplicar el predicato devuelva true
// En caso de que el array esté vacío devuelve false (ya que no hay ningún elemento al que aplicar el predicado)
const isTaller = ({ height }) => height > 5;
console.log(rectangles.some(isTaller));

// Implementación imperativa de some
const some = (collection, predicate) => {
  let done = false, { length } = collection;
  for (let i = 0; i < length && !done; i++) {
    done = predicate(collection[i]);
  }
  return done;
};

// console.log(some(rectangles, isTaller));

// [EVERY]
// Some es un método que realiza una iteración sobre todos los elementos de un array y devuelve
// true si el predicado devuelve true sobre TODOS los elementos del array
// En caso de que el array esté vacío devuelve true (verdad vacua / vacuous truth)
const hasEvenArea = (element) => getArea(element) % 2 === 0;

console.log(rectangles.every(hasEvenArea));
console.log([].every(hasEvenArea));
console.log([{ width: 11, height: 3 }, { width: 2, height: 3 }].every(hasEvenArea));

// Implementación imperativa
const every = (collection, predicate) => {
  let match = true, { length } = collection;
  for (let i = 0; i < length && match; i++) {
    match = predicate(collection[i]);
  }
  return match;
};

console.log(every(rectangles, hasEvenArea));
console.log(every([], hasEvenArea));
console.log(every([{ width: 11, height: 3 }, { width: 2, height: 3 }], hasEvenArea));

// [CONCAT]
// Concat es un método que devuelve un nuevo array donde se le añaden todos los elementos pasados como argumento.
// En caso de que algún elemento sea un array los une sin crear arrays anidados (sólo el primer nivel)
const shape1 = { width: 11, height: 2 };
const shape2 = { width: 22, height: 3 };
const otherShapes = [
  { width: 33, height: 4 },
  { width: 44, height: 5 },
];

console.log(rectangles.concat(shape1, shape2, otherShapes));

// Implementación imperativa
const concat = (collection, ...elements) => {
  const newCollection = [...collection];
  for (let element of elements) {
    if (Array.isArray(element)) {
      for (let deepElement of element) {
        newCollection.push(deepElement);
      }
    } else {
      newCollection.push(element);
    }
  }
  return newCollection;
};

console.log(concat(rectangles, shape1, shape2, otherShapes));

// [REDUCE]
// Reduce es una función recibe un reductor y, opcionalmente un valor inicial, que aplica por cada elemento del array
// dicho reductor junto con el valor inicial. Básicamente su función es de convertir un conjunto de elementos
// en uno más simple. En caso de no pasar el valor inicial el primer elemento se convierte en valor inicial

const sumAllAreas = (total, rectangle) => total + getArea(rectangle);
console.log(rectangles.reduce(sumAllAreas, 0));

// Implementación imperativa
function reduce(collection, reducer, initialValue) {
  let i = 0;
  let accumulator = arguments.length >= 3 ? initialValue : (i++ , collection[0]);
  for (const { length } = collection; i < length; i++) {
    accumulator = reducer(accumulator, collection[i]);
  }
  return accumulator;
};

console.log(reduce([1, 2, 3, 4], (a, b) => a + b));

// [REDUCERIGHT]
// ReduceRight no es más que la implementación de Reduce donde realiza la iteración desde el último hasta el primero
// en vez de desde el primero hasta el último

console.log(rectangles.reduceRight(sumAllAreas, 0));

// Implementación imperativa
function reduceRight(collection, reducer, initialValue) {
  let { length: i } = collection;
  let accumulator = arguments.length >= 3 ? initialValue : collection[--i];
  while (i > 0) {
    accumulator = reducer(accumulator, collection[--i]);
  }
  return accumulator;
};

console.log(reduceRight(rectangles, sumAllAreas, 0));

// Aunque a simple vista parezca una tontería el iterar de derecha a izquierda, dependiendo del reductor que usemos
// el orden es importante e incluso el valor inicial

const oneToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(oneToTen.reduceRight((a, b) => a + b, 0));
console.log(reduceRight(oneToTen, (a, b) => a + b, 0));
console.log(oneToTen.reduceRight((a, b) => a + b));
console.log(reduceRight(oneToTen, (a, b) => a + b));
console.log(oneToTen.reduceRight((a, b) => a - b, 0));
console.log(reduceRight(oneToTen, (a, b) => a - b, 0));
console.log(oneToTen.reduceRight((a, b) => a - b));
console.log(reduceRight(oneToTen, (a, b) => a - b));

// El método reduce es tan flexible que podemos utilizarlo para sustituir cualquier método de array:

const mapReduce = (collection, transform) =>
  collection.reduce((newCollection, element) => (newCollection.push(transform(element)), newCollection), []);

console.log(mapReduce(rectangles, getArea));

const filterReduce = (collection, predicate) => collection.reduce((newCollection, element) => {
  if (predicate(element)) newCollection.push(element);
  return newCollection
}, []);

console.log(filterReduce(rectangles, hasBigArea));

const concatReduce = (collection, ...elements) => elements.reduce((newCollection, element) => {
  if (Array.isArray(element)) {
    for (let deepElement of element) {
      newCollection.push(deepElement);
    }
  } else {
    newCollection.push(element);
  }

  return newCollection;
}, [...collection]);

console.log(concatReduce(rectangles, shape1, shape2, otherShapes));
