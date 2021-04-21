// EJEMPLO FIZZBUZZ CON RAMDA **********************************************************

// Definición del problema: Implementar una funcionalidad que reciba un número y devuelva una lista
// de números del 1 al número introducido donde:
// - Los múltiplos de tres son mostrados como "Fizz"
// - Los múltiplos de cinco son mostrados como "Buzz"
// - Los múltiplos de tres y cinco son mostrados como "FizzBuzz"
// Ejemplo: fizzbuzz(15)
// Devuelve: [1, 2, "Fizz", 4, "Buzz", "Fizz", 7, 8, "Fizz", "Buzz", 11, "Fizz", 13, 14, "FizzBuzz"]
import {
  __,
  compose,
  concat,
  curry,
  equals,
  filter,
  flip,
  head,
  inc,
  isEmpty,
  last,
  lensIndex,
  map,
  modulo,
  not,
  of,
  over,
  times,
  view,
  when,
  xprod,
} from 'ramda';

const isMultipleOf = curry(compose(equals(0), flip(modulo)));
const rule = (predicate, result) => when(
  compose(predicate, head),
  over(lensIndex(1), concat(__, result))
);

const fizzBuzz = n => map(
  compose(
    last,
    filter(compose(not, isEmpty)),
    rule(isMultipleOf(5), 'Buzz'),
    rule(isMultipleOf(3), 'Fizz'),
  ),
  xprod(times(inc, n), of(''))
);

console.log(fizzBuzz(15));
