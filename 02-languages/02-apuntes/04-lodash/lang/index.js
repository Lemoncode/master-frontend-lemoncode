import * as _ from 'lodash';

// castArray (inmutable)
// Envuelve el elemento en un array si no lo fuese
var num = 3;
var casted = _.castArray(num);
console.log(casted);
// [3]


// isArrayLike
// Comprueba si el elemento tiene length valido
// console.log(_.isArrayLike(document.body.children)); // true
console.log(_.isArrayLike('abc')); // true


// isArrayLikeObject
// Comprueba si el elemento es un arrayLike y además un objeto
// console.log(_.isArrayLikeObject(document.body.children)); // true
console.log(_.isArrayLike('abc')); // false


// isBoolean
// Comprueba si el elemento es booleano
console.log(_.isBoolean(true)); // true
console.log(_.isBoolean(0)); // false


// isString
// Comprueba si el elemento es un string
console.log(_.isString('abc')); // true
console.log(_.isString(123)); // false


// isNumber
// Comprueba si el elemento es un número
console.log(_.isNumber(123)); // true
console.log(_.isNumber('abc')); // false


// isDate
// Comprueba si el elemento es un objeto de tipo Date
console.log(_.isDate(new Date())); // true
console.log(_.isDate(123)); // false


// isEmpty
// Comprueba si el elemento es un objeto vacío o tiene longitud 0. Se consideran vacío también
// objetos sin propiedades
console.log(_.isEmpty(['abc'])); // false
console.log(_.isEmpty(123)); // true
console.log(_.isEmpty(null)); // true
console.log(_.isEmpty(true)); // true


// isEqual
// Compara dos valores y devuelve true si son iguales. Ejecuta comparación profunda
console.log(_.isEqual('abc', 'abc')); // true
console.log(_.isEqual(NaN, NaN)); // true
console.log(_.isEqual({ x: 1 }, { x: 1 })); // true


// isError
// Comprueba si el elemento es un error
console.log(_.isError(Error('Oops!!'))) // true
console.log(_.isError(333)); // false


// isFunction
// Devuelve true si el elemento es una función
console.log(_.isFunction(() => { })); // true
console.log(_.isFunction(Object)); // false
console.log(_.isFunction('33')); // false


// isNull
// Devuelve true si el elemento es null
console.log(_.isNull(null)); // true
console.log(_.isNull(undefined)); // false


// isNil
// Devuelve true si el elemento es null o undefined
console.log(_.isNil(null)); // true
console.log(_.isNil(undefined)); // true
console.log(_.isNil(false)); // false


// isUndefined
// Devuelve true si el elemento es undefined
console.log(_.isUndefined(null)); // false
console.log(_.isUndefined(undefined)); // true
console.log(_.isUndefined(false)); // false


// toArray
// Realiza una conversión del elemento a array. En caso de objetos coge los valores. En caso de no
// poder convertirlo devuelve array vacío.
console.log(_.toArray({ x: 1, y: 2 }));// [1, 2]
console.log(_.toArray(null)); // []
console.log(_.toArray('abc')); //  ['a', 'b', 'c']
console.log(_.toArray(123)); // []


// toInteger
// Castea el elemento a número entero. En caso de no poder convertirlo devuelve 0
console.log(_.toInteger('4.2'));
console.log(_.toInteger(3.4));
console.log(_.toInteger('abc'));


// toString
// Castea el elemento a string. Devuelve string vacío con null y undefined
console.log(_.toString(123)); // 123
console.log(_.toString(null)); // ''
console.log(_.toString(undefined)); // ''
console.log(_.toString([4, 3, 2, 1])); // '4,3,2,1'


// toNumber
// Castea el elemento a number.
console.log(_.toNumber()); // NaN
console.log(_.toNumber('abc')); // NaN
console.log(_.toNumber('4.2')); // 4.2


// gt
// Compara si el elemento es mayor que el siguiente
console.log(_.gt(3, 4)); // false
console.log(_.gt(4, 3)); // true
console.log(_.gt(4, 4)); // false


// lt
// Compara si el elemento es menor que el siguiente
console.log(_.lt(3, 4)); // true
console.log(_.lt(4, 3)); // false
console.log(_.lt(4, 4)); // false


// gte
// Compara si el elemento es mayor o igual que el siguiente
console.log(_.gte(3, 4)); // false
console.log(_.gte(4, 3)); // true
console.log(_.gte(4, 4)); // true


// lte
// Compara si el elemento es menor o igual que el siguiente
console.log(_.lte(3, 4)); // true
console.log(_.lte(4, 3)); // false
console.log(_.lte(4, 4)); // true


// clone
// Crea una copia no profunda del elemento. Soporta booleanos, objetos, arrays. No clona nodos
// errores, functions y devuelve en su caso un objeto vacío
console.log(_.clone([1, 'foo', false, null, undefined, { x: 3, y: 4 }]));
// [1, 'foo', false, null, undefined, { x: 3, y: 4 }]

console.log(_.clone({ name: 'John', friends: [{ name: 'Jack' }] }));
// { name: 'John', friends: [{ name: 'Jack' }] }


// cloneDeep
// Realiza una copia profunda del elemento
console.log(_.cloneDeep([1, 2, 3, [4, 5]]));
// [1, 2, 3, [4, 5]]

console.log(_.clone({ name: 'John', friends: [{ name: 'Jack' }] }));
// { name: 'John', friends: [{ name: 'Jack' }] }
