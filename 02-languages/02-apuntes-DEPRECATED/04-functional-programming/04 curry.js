// CURRY **********************************************************

// Curry es la acción de convertir una función de múltiples argumentos en una secuencia de llamadas a funciones
// con un único argumento, también llamadas "unary" o de "arity of 1" / aridad (matemática) de 1

function createMessageUncurrified(sender, adjective, noun) {
  return `Hey!, ${sender} just want to tell you that you're a ${adjective} ${noun}!!`;
}

console.log(createMessageUncurrified("Eva", "awesome", "teacher"));

function createMessageClassicFunction(sender) {
  return function (adjective) {
    return function (noun) {
      return `Hey!, ${sender} just want to tell you that you're a ${adjective} ${noun}!!`;
    }
  }
}
console.log(createMessageClassicFunction("Eva")("awesome")("teacher"));

// En formato arrow function es más expresivo:
const createMessageArrow = sender => adjective => noun => `Hey!, ${sender} just want to tell you that you're a ${adjective} ${noun}!!`;

console.log(createMessageArrow("Eva")("awesome")("teacher"));


// ¿Por qué complicar las llamadas creando nuevas funciones? Porque nos ofrecen una manera de personalizar o
// configurar dichas funciones

const messageFromEva = createMessageArrow("Eva");
console.log(messageFromEva("awesome")("teacher"));

const awesomeMessageFromEva = messageFromEva("awesome");
console.log(awesomeMessageFromEva("teacher"));
console.log(awesomeMessageFromEva("parent"));

const badMessageFromEva = messageFromEva("bad");
console.log(badMessageFromEva("teacher"));
console.log(badMessageFromEva("parent"));

// Veamos otro ejemplo:

const multiply = num1 => num2 => num1 * num2;
const divide = divisor => dividend => dividend / divisor;

console.log(multiply(6)(10));

// Crear pequeñas funciones configurables nos ofrece muchísima flexibilidad y en algunos casos nos ayuda
// a evitar la duplicidad de código

const numbers = [35, 69, 48, 81, 20, 87, 71, 70];
const tripleIt = multiply(3);
const isEven = num => num % 2 === 0;
const mapUncurrified = (collection, transform) => collection.map(transform);

console.log(mapUncurrified(numbers, tripleIt));

// Vamos a currificar la función map:

const map = transform => collection => collection.map(transform);
const filter = predicate => collection => collection.filter(predicate);

const tripleEverything = map(tripleIt);
const getEvenFromList = filter(isEven);

console.log(tripleEverything(numbers));
console.log(getEvenFromList(numbers));

// Hay veces que nos interesa currificar funciones existentes. Para ello podemos crear una función que reciba una
// función como parámetro y se encargue de currificarla según los argumentos que reciba

const curry = originalFn => function curried(...args) {
  if (args.length >= originalFn.length) {
    return originalFn(...args);
  }
  return (...args2) => curried(...args, ...args2);
}

const createMessageCurried = curry(createMessageUncurrified);

console.log(createMessageCurried("Sandra", "nice", "guy"));
console.log(createMessageCurried("Sandra", "nice")("guy"));
console.log(createMessageCurried("Sandra")("nice", "guy"));
console.log(createMessageCurried("Sandra")("nice")("guy"));
