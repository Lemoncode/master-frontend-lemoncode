import * as _ from 'lodash';

// after
// Ejecuta el método especificado después de haber llamado a la función n veces
var calledThrice = () => {
  console.log('Function was called thrice');
};

var main = _.after(3, calledThrice);
main();
main();
main(); // 'Function was called thrice'

// before
// Ejecuta el método si se ha llamado hasta n veces
var notCalledThrice = () => {
  console.log('Function can not be called thrice');
};
var main = _.before(3, calledThrice);
main(); // 'Function can not be called thrice'
main(); // 'Function can not be called thrice'
main();

// ary (unary cuando arguments.length === 1)
// Crea una función que invoca a la función pasada con el número de parámetros que le especifiquemos
var oneArgParseInt = _.ary(parseInt, 1);
console.log(oneArgParseInt('F', 16));
// NaN

var oneArgParseInt = _.unary(parseInt);
console.log(oneArgParseInt('10', 16));
// 10

// curry
// Crea una versión currificada de los parámetros de la función
var applyOps = (num1, num2, num3) => num1 + num2 - num3;
var currified = _.curry(applyOps);
console.log(currified(4, 3, 10)); // -3
console.log(currified(4, 3)(10)); // -3
console.log(currified(4)(3, 10)); // -3
console.log(currified(4)(3)(10)); // -3

// curryRight
// Crea una versión currificada de los parámetros de la función en orden inverso (cuando se aplica bien la secuencia
// de llamadas con un argumento)
var applyOps = (num1, num2, num3) => num1 + num2 - num3;
var currified = _.curryRight(applyOps);
console.log(currified(4, 3, 10)); // -3
console.log(currified(4, 3)(10)); // -11
console.log(currified(4)(3, 10)); // 9
console.log(currified(4)(3)(10)); // 9


// debounce
// Ejecuta la función especificada tras el tiempo especificado. Si la función se llama en un
// intervalo inferior al tiempo especificado reinicia el temporizador
var greet = () => {
  console.log('Hello after a while');
};

var debouncedGreet = _.debounce(greet, 1000);
debouncedGreet();
setTimeout(() => {
  debouncedGreet();
  console.log('extend the debounce 500ms more');
}, 500);

// La nueva función se puede cancelar
var debouncedGreet = _.debounce(greet, 1000);
debouncedGreet();
setTimeout(() => {
  debouncedGreet.cancel();
  console.log('greet cancelado');
}, 500);

// O se puede invocar inmediatamente cancelando el temporizador
var debouncedGreet = _.debounce(greet, 1000);
debouncedGreet();
setTimeout(() => {
  debouncedGreet.flush();
  console.log('greet ejecutado al instante');
}, 500);

// defer
// Retrasa la ejecución de la función y la ejecuta de forma asíncrona.
var greet = (name) => {
  console.log(`Hello ${name}`);
};

_.defer(greet, 'world');
console.log('Executed before greet');
// Executed before greet
// Hello world

// memoize
// Almacena el resultado de llamar a la función y no recalcula el resultado si se pasan
// los mismos parámetros
var serializeCoords = (coords) => [coords.x * 2, coords.y * 3];
var memoized = _.memoize(serializeCoords);
var coords1 = { x: 1, y: 3 };
var coords2 = { x: 4, y: 1 };
console.log(memoized(coords1));
// [2, 9]

console.log(memoized(coords2));
// [8, 3]

coords1.x = 3;
console.log(memoized(coords1));
// [2, 9]


// once
// Ejecuta la función una sola vez
var greet = () => {
  console.log('Called greet');
};
var greetOnce = _.once(greet);
greetOnce(); // Called greet
greetOnce();

// negate
// Crea una función que devuelve el resultado opuesto.
var divisibleBy2 = (num) => num % 2 === 0;
var notDivisibleBy2 = _.negate(divisibleBy2);
console.log(divisibleBy2(4));
// true

console.log(notDivisibleBy2(4));
// false

// overArgs
// Crea una función que invoca la función pasada como primer argumento pasándole como parámetros
// el resultado de aplicar las funciones del segundo argumento en el mismo orden.
// Al primer argumento ejecuta la primera función, al segundo la segunda función, etc...
var joinWithSpaces = (...args) => args.join(' ');
var transformed = _.overArgs(joinWithSpaces, [_.kebabCase, _.camelCase]);
console.log(transformed('Hello world', 'Hola mundo'));
// hello-world holaMundo


// throttle
// Toma una función como parámetro y devuelve una nueva versión de la función que,
// cuando es invocada de manera repetida, no se ejecutará más de una vez por cada
//  espera en milisegundos

var greet = () => {
  console.log('Hello world');
};

var throttled = _.throttle(greet, 1000);
throttled();
throttled();
throttled();
