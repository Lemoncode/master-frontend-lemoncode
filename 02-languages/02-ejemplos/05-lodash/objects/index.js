import * as _ from 'lodash';

// defaults (mutable)
// Crea un nuevo objeto mezclando las propiedades (incluyendo las de prototype)
// de los siguientes si no existen
var onlyX = { x: 2 };
var onlyY = { y: 3 };
var xAndZ = { x: 10, z: 9 };
console.log(_.defaults(onlyX, onlyY, xAndZ));
// ​​​​​{ x: 2, y: 3, z: 9 }​​​​​


// defaultsDeep (mutable)
// Crea un nuevo objeto mezclando las propiedades (incluyendo las de prototype)
// de los siguientes si no existen de forma recursiva
var locationWithX = {
  from: { x: 14 },
};
var fullLocation = {
  from: { x: 10, y: 13, z: -2 },
};
console.log(_.defaultsDeep(locationWithX, fullLocation));
// ​​​​​{ from: { x: 14, y: 13, z: -2 } }


// forIn
// Itera sobre las propiedades del objeto aplicando la función pasada como argumento
var Person = function (name) {
  this.name = name;
};

Person.prototype.greet = function () {
  return this.name;
};
var bob = new Person('Bob');
_.forIn(bob, (value, key) => {
  console.log(value, key);
});
// "Bob", "name"
// function, "greet"

// Si se devuelve false termina la iteración
_.forIn(bob, (value, key) => {
  console.log(value, key);
  return false;
});
// "​​​​​Bob", "name​​​​​"


// forInRight
// Itera sobre las propiedades del objeto aplicando la función pasada como argumento de derecha
// a izquierda
var Person = function (name) {
  this.name = name;
};

Person.prototype.greet = function () {
  return this.name;
};
var bob = new Person('Bob');
_.forInRight(bob, console.log);
// function,  "greet" Person
// "​​​​​Bob", "name" Person


// forOwn
// Itera sobre las propiedades (sólo propias) del objeto aplicando la función pasada como argumento de izuierda a derecha
var Person = function (name) {
  this.name = name;
};

Person.prototype.greet = function () {
  return this.name;
};
var bob = new Person('Bob');
_.forOwn(bob, console.log);
// "​​​​​Bob", "name", Person


// forOwnRight
var Person = function (name, surname) {
  this.name = name;
  this.surname = surname;
};

Person.prototype.greet = function () {
  return this.name;
};
var bob = new Person('Bob', 'Dalas');
_.forOwnRight(bob, console.log);
// "​​​​​Dalas", "surname", Person
// "Bob", "name", Person


// functions (inmutable)
// Obtiene el nombre de todas las propiedades enumerables del objeto que sean funciones
const obj = {
  x: 1,
  y: 2,
  z: 3,
  toString: function () {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}
console.log(_.functions(obj));
// ['toString']


// functionsIn (inmutable)
// Obtiene el nombre de todas las propiedades enumerables del objeto que sean funciones incluyendo las de prototype
var Person = function (name, surname) {
  this.name = name;
  this.surname = surname;
};

Person.prototype.greet = function () {
  return this.name;
};
console.log(_.functionsIn(new Person('Bob', 'Dalas')))
// ['greet']


// get (inmutable)
// Obtiene de un objeto el valor de la propiedad que le pasemos. Soporta profundidad y acepta valores por defecto.
var joe = {
  name: 'Joe',
  friends: [
    { name: 'Alan' },
    {name: 'Rita'},
  ]
};
console.log(_.get(joe, 'name'));
// "Joe"
console.log(_.get(joe, 'friends[0].name'));
// "Alan"
console.log(_.get(joe, 'friends[20].name', 'Nobody'));
// 'Nobody'


// set (mutable)
// Establece al objeto en la propiedad especificada un valor. Soporta profundidad.
var joe = {
  name: 'Joe',
  friends: [
    { name: 'Alan' },
    { name: 'Rita' },
  ]
};
_.set(joe, 'surname', 'Hoffman');
console.log(joe);
// ​​​​​{ name: 'Joe',​​​​​ friends: [{ name: 'Alan' }, { name: 'Rita' }], surname: 'Hoffman' }​​​​​
_.set(joe, 'friends[0].surname', 'Wake');
console.log(joe);
// ​​​​​{ name: 'Joe',​​​​​ friends: [{ name: 'Alan', surname: 'Wake' }, { name: 'Rita' }], surname: 'Hoffman' }​​​​​


// has (inmutable)
// Devuelve verdadero si la propiedad existe. Soporta profundidad.
var joe = {
  name: 'Joe',
  friends: [
    { name: 'Alan' },
    { name: 'Rita' },
  ],
  active: undefined,
};
console.log(_.has(joe, 'name'));
// true
console.log(_.has(joe, 'surname'));
// false
console.log(_.has(joe, 'active'));
// true
console.log(_.has(joe, 'friends[0].name'));
// true


// hasIn (inmutable)
var Person = function (name, surname) {
  this.name = name;
  this.surname = surname;
};

Person.prototype.greet = function () {
  return this.name;
};

var pepe = new Person('Peter', 'Williams');
console.log(_.hasIn(pepe, 'greet'));
// true


// merge (mutable)
// Combina un objeto con el resto de objetos que le pasemos como argumentos, mezclando sus propiedades de forma recursiva.
var defaultOptions = {
  overflow: 'auto',
  borderRadius: '3px',
  children: {
    span: {
      textTransform: 'uppercase',
      padding: '5px',
    },
    p: {
      marginBottom: '10px'
    }
  },
};

var withShadow = {
  boxShadow: '10px 10px 5px black',
  textShadow: '3px 3px 3px green',
};

var greenChildren = {
  children: {
    span: {
      color: 'green',
    },
    p: {
      color: 'green',
    },
  }
};

console.log(_.merge(defaultOptions, withShadow, greenChildren));
/*
​​​​​{
  overflow: 'auto',
​​​​​  borderRadius: '3px',
​​​​​  children: {
    span: { textTransform: 'uppercase', padding: '5px', color: 'green' },
    p: { marginBottom: '10px', color: 'green' }
  },
​​​​​  boxShadow: '10px 10px 5px black',
​​​​​  textShadow: '3px 3px 3px green'
}
*/
