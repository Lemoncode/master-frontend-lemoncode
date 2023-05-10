// COMPOSICIÓN **********************************************************

// La composición no es más que agrupar un conjunto de pequeñas funciones que reciben un número de parámetros en cadena
// y devolver una función que vaya ejecutando una a una de las funciones pasadas en cadena pasando el resultado de
// las funciones ejecutadas a las funciones siguiente (como una tubería)

// Supongamos el siguiente ejemplo:
const toUpper = text => text.toUpperCase();
console.log(toUpper("hey you"));

const exclamate = text => text + '!!';
console.log(exclamate("hey you"));

const coupledShout = text => exclamate(toUpper(text));

console.log(coupledShout("hey you"));

// Como vemos la función "shout" realiza una llamada a "toUpper" y a "exclamate"
// Aunque a simple vista puede parecer un poco ilegible lo que vemos es que dichas funciones están encadenadas
// la entrada de "shout" es utilizada por "toUpper" y devuelve una salida que a su vez es la entrada de "exclamate"
// cuya salida es el resultado final de "shout"
// Si tuviésemos más funciones el resultado podría ser más difícil de apreciar a simple vista:

const nextCharFromNumberImperative = char => {
  const trimmed = char.trim();
  const number = parseInt(trimmed);
  const nextNumber = number + 1;
  return String.fromCharCode(nextNumber);
}

console.log(nextCharFromNumberImperative(' 64 '));

// Si intentamos reducirlo a una sola línea vemos que es aún más difícil entender qué está pasando
const nextCharFromNumberOneLine = char => String.fromCharCode(parseInt(char.trim()) + 1);

// Aquí es donde brilla la composición
// Por definición:
// compose = f · g
// compose :: (b -> c) -> (a -> b) -> (a -> c)
// Se lee "Compose es una función que recibe como argumento una función que transforma de 'B' a 'C' y otra función
// que transforma de 'A' a 'B' y devuelve una función que transforma de 'A' a 'C'"
const composeTwo = (f, g) => x => f(g(x));

const shout = composeTwo(exclamate, toUpper); // Tiene el mismo orden qque exclamate(toUpper(x))

console.log(shout("hey you"));

// Veamos cómo corregir la función "nextCharFromNumberOneLine" para que se vea más claras las transformaciones
// utilizando "composeTwo"

const addOne = num => num + 1;
const trim = str => str.trim();
const fromCharCode = num => String.fromCharCode(num);

const nextCharFromNumberComposedTwo = composeTwo(fromCharCode, composeTwo(addOne, composeTwo(parseInt, trim)));

console.log(nextCharFromNumberComposedTwo(' 64'));

// Vemos que anidar "composeTwo" tampoco resuelve el problema por lo que crearemos una función "compose" que reciba
// un número de funciones dinámicas:
const compose = (...functions) => functions.reduce((f, g) => (...args) => f(g(...args)))

const nextCharFromNumber = compose(fromCharCode, addOne, parseInt, trim);

console.log(nextCharFromNumber(' 64'));

// Gracias a la composición podemos evitarnos el iterar múltiples veces sobre un array.
// Veamos el siguiente ejemplo:
const numbers = [16, 31, 46, 57, 66];
const result = numbers.map((x) => x * 15).map((x) => x / 3);
console.log(result);

// Si extraemos y componemos las funciones de cada map conseguiremos una única función que genere un mismo resultado
const mutiplyBy15 = x => x * 15;
const divideBy3 = x => x / 3;
const transformation = compose(divideBy3, mutiplyBy15);
console.log(numbers.map(transformation));
