///-- MODELO PROTOTÍPICO *******************************************************

/*
JS no proporciona un modelo o implementación de clases en si mismo, sino que es
un lenguaje dinámico, basado en objetos, es decir, instancias en memoria.

Un ejemplo típico para explicar lo que es una clase versus un objeto es
el caso de un plano versus una casa. El plano es la representación de una
posible casa, pero no existe como tal, es sólo un papel. La casa, por su parte
sería la instancia, la materialización del plano hecho realidad. Podremos
obtener tantas casas queramos a partir de un plano.

Pues bien, en JS todo son objetos, es decir, casas. No existen los planos,
las clases. Hasta las funciones son objetos!. Y aunque existe la palabra
reservada "class", esto no es más que azúcar sintáctico.

---------------------------------------------------------------------------
Lo que vamos a hacer a continuación es emular una clase con un lenguaje, JS,
que no dispone de clases de serie. Y para ello nos serviremos de las
herramientas que si dispone el lenguaje, concretamente emplearemos 3
ingredientes:
1. Función Constructora.
2. Operador New.
3. Prototipo.
----------------------------------------------------------------------------
*/

// *** 1 y 2 Función constructora y Operador New ***

/*
Volviendo al simil de plano vs casas, todo sistema de clases tiene un mecanismo
para poder crear "casas a partir de planos", es decir, instancias de clase.
En JS para crear un objeto, una instancia nueva, que responda a un tipo especifico
necesitamos una función que llamaremos constructora, y un operador new:
*/

// Función constructora
function Person(name) {
  this.name = name;
}

// Con el operador new creamos INSTANCIAS independientes del tipo Person.
var dan = new Person("Dan");
var james = new Person("James");
console.log(dan); // Person {name: "Dan"}
console.log(james); // Person {name: "James"}
/*
El operador "new" hace por debajo 3 cosas:
1. Crear un objeto nuevo, vacío.
2. Hacer que ese objeto vacío invoque a la función constructora, por tanto 'this'
   representará al objeto recién creado.
3. ¿..? Además "new", tiene una particularidad, hace algo más, y ahi entra en juego
   el prototipo, pero esta tercera operación la desvelaremos un poco más adelante.
*/

// Podemos acceder a sus propiedades ("private", "protected" son conceptos que no
// existen en JS)
console.log(dan.name); // "Dan"
console.log(james.name); // "James"

/*
Puesto que son objetos, podemos crear propiedades solo para una instancia en
concreto sin que la otra se ve afectada. O si quisieramos, modificarlas también.
Podemos jugar con cada objeto de forma 100% independiente (a diferencia de las
clases tradicionales).
*/
dan.age = 26;
console.log(dan.age); // 26
console.log(james.age); // undefined

// También podemos crear estas propiedades directamente en el "constructor".
// Podemos crear funciones por ejemplo:
function Person(name) {
  this.name = name;
  this.greet = function () {
    console.log("Hello, I'm " + this.name);
  };
}

// Y si ahora creamos instancias independientes de "Person", tenemos:
var dan = new Person("Dan");
var james = new Person("James");
dan.greet(); // "Hello, I'm Dan"
james.greet(); // "Hello, I'm James"

/*
Pero aqui hay un problema. El constructor ha creado una nueva función cada vez que ha
sido invocado. Cada función será un objeto diferente, es decir, cada instancia tendrá
una función distinta. Si tenemos miles de instancias habrá miles de funciones "greet"
creadas.
En lugar de eso, ¿por qué no almacenamos una única función en un lugar común para que
todas las instancias apunten a la misma función?
*/

// *** 3 Prototipo ***

/*
A ese lugar común es a lo que llamamos "prototipo" y está representado por la propiedad
"prototype". El prototipo será por tanto ese almacén común que las distintas instancias
de un mismo tipo compartirán.
*/
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  console.log("Hello, I'm " + this.name);
};

var dan = new Person("Dan");
var james = new Person("James");
dan.greet(); // "Hello, I'm Dan"
james.greet(); // "Hello, I'm James"

/*
Como vemos, tanto "dan" como "james" son 2 objetos con el mismo prototipo, puesto que
han sido creados a partir de la misma función constructora. De dicho prototipo obtienen
la propiedad "greet" que ahora si, es una función única, que existe una única vez.
¿Donde? En el objeto prototipo (el prototipo es un objeto también, todo son objetos en JS!).

El vínculo entre un objeto y su prototipo lo establece el operador "new", es la pieza que
nos faltaba. Entre bambalinas, su tercera misión es vincularle el prototipo de la función
constructora. Es una manera de decirle, "como has sido creado por Person, tu tienes el
prototipo de Person".

Con el new generamos un objeto vacío, que invoca al constructor, y acaba asignandole
el prototipo adecuado:
new => {name: "Dan", __proto__: Person.prototype}
*/

console.log(Person.prototype); // Es el mismo objeto
console.log(Object.getPrototypeOf(dan)); // Es el mismo objeto
console.log(Person.prototype === Object.getPrototypeOf(dan)); // true
console.log(dan instanceof Person); // true

///-- HERENCIA PROTOTÍPICA *******************************************************

/*
El mecanismo de herencia en JS, gracias a los prototipos, se le conoce como herencia
prototípica. Cada objeto tiene una propiedad "prototype", que es un puntero o ref que
apunta hacia el prototipo del objeto. Pero es que el prototipo vuelve a ser un objeto,
que tendrá otro "prototype" que a su vez apuntará a su prototipo, y así sucesivamente.
Se forma una cadena de prototipos que termina finalmente apuntando a "null".

Veamos un ejemplo. Crearemos objetos de tipo Automobile via función constructora.
Y añadimos algunas funciones a su prototipo (que sería la equivalencia a hacer
métodos de clase).
*/

function Automobile(wheels) {
  this.wheels = wheels;
  this.kms = 0;
}

Automobile.prototype.drive = function (kms) {
  this.kms += kms;
  console.log("Driving " + kms + "kms...");
};

Automobile.prototype.showKms = function () {
  console.log("Total Kms: " + this.kms);
};

/*
A continuación creamos otro objeto algo más específico, un Taxi. Vamos a hacer que
Taxi "herede" de Automobile. Para eso, queremos que el objeto que llama al constructor
Taxi() invoque también al constructor Automobile().
*/
function Taxi() {
  Automobile.call(this, 4); // super();
  this.isOccupied = false;
}

/*
Hacemos que Taxi "herede" de Automobile. Para ello creamos un prototipo para Taxi,
gracias a Object.create que crea un nuevo objeto cuyo prototipo podemos hacer que apunte
a donde queramos. Ademas hay que setear su constructor.
*/
Taxi.prototype = Object.create(Automobile.prototype); // Crea un objeto nuevo {__proto__: arg}
Taxi.prototype.constructor = Taxi;
// Una forma equivalente sería directamente apuntando a donde queramos
// Taxi.prototype.__proto__ = Automobile.prototype;

// Añadimos también algún método a Taxi.
Taxi.prototype.service = function () {
  this.isOccupied = true;
};

// Este método se sirve de otro que está más arriba en la cadena de prototipos.
Taxi.prototype.drive = function (kms) {
  Automobile.prototype.drive.call(this, kms); // super.drive()
  var serviceStatus = this.isOccupied ? "in service" : "free";
  console.log("And I am " + serviceStatus);
};

// @override: Al estar antes en la cadena de prototipos, no se llegará nunca a invocar a
// Automobile.prototype.showKms
Taxi.prototype.showKms = function () {
  console.log("Taxi Total Kms: " + this.kms);
};

/*
Asi pues teneos Automobile y Taxi que hereda del primero. Cuando queremos acceder a
una propiedad de Taxi, buscamos en la instancia y si no está vamos a su prototipo.
Si no estuviera alli, se busca en el prototipo del prototipo, y así sucesivamente
hasta que se alcance el final de la cadena de prototiopos.
De este modo se comparten propiedades, sin copiarlas cada vez que creamos una instancia.
*/
var taxi = new Taxi();
console.log(taxi); // Inspección de la cadena de prototipos
taxi.drive(100); // "Driving 100kms... And I am free"
console.log(taxi.isOccupied); // false
taxi.service();
console.log(taxi.isOccupied); // true
taxi.drive(50); // "Driving 50kms... And I am in service"
taxi.showKms(); // "Taxi total Kms: 150"

console.log(taxi instanceof Taxi); // true
console.log(taxi instanceof Automobile); // true
console.log(taxi instanceof Object); // true

/*
Herencia simulada via cadena de prototipos
Taxi -----> Automobile -----> Object -----> null

Cadena Prototípica
Taxi.prototype
Taxi.prototype._proto_ ----> Automobile.prototype
                             Automobile.prototype._proto_ -----> Object.prototype
                                                                 Object.prototype._proto_: -----> null
*/

///-- CREACIÓN DE OBJETOS Y SU CADENA DE PROTOTIPOS **************

// Hay 3 formas de crear objetos que difieren en la cadena de prototipos
// que generan:

// 1. De forma literal:
var me = { name: "Javi" };
/*
me -----> Object.prototype -----> null
"name" sería una propiedad del objeto o instancia me.
*/

// 2. A través de un constructor y new:
function Person(name) {
  this.name = name;
}

Person.prototype.sayName = function () {
  console.log(this.name);
};

var me = new Person("Javi");
/*
me -----> Person.prototype -----> Object.prototype -----> null
"name" sería una propiedad del objeto construido.
"sayName" sin embargo, se obtiene heredado del prototipo (se accede, no se copia).
*/

// 3. Object.create()
var a = { name: "a" }; // a -----> Object.prototype -----> null.
var b = Object.create(a); // b -----> a -----> Object.prototype -----> null.
var c = Object.create(b); // c -----> b -----> a -----> Object.prototype -----> null.

///-- CONSTRUCTORES POR DEFECTO ***********************************

/*
Ahora que conocemos el prototipo y la herencia que se deriva de este modelo,
podemos responder a la pregunta de ... ¿que son todos esos métodos que aparecen
cuando declaramos una variable primitiva? Por ejemplo:
  var num = 4;
  num.toString();
El lenguaje incorpora funciones constructoras para los tipos primitivos, y se
aplican de forma transparente cada vez que inicializamos un primitivo, haciendo
que dicho primitivo incorpore toda la funcionalidad de su prototipo correspondiente.
*/

// String
var a = new String("foo");
console.log(a); // "foo"
console.log(a == "foo"); // true
console.log(a === "foo"); // false

// Number
var a = new Number(32);
console.log(a); // 32
console.log(a == 32); // true
console.log(a === 32); // false

// Boolean
var a = new Boolean(32);
console.log(a); // true
console.log(a == true); // true
console.log(a === true); // false

// Object
var a = new Object();
console.log(a); //{}
console.log(a == {}); // false
console.log(a === {}); // false

// Type conversion
console.log((32).toString()); // "32"
console.log(Number("32")); // 32
console.log(Boolean("32")); // true
console.log(!!"32"); // true

///-- THIS *******************************************************

// "this" es especial en JS y no está atado a ninguna "class"
function sayAge() {
  console.log("I'm " + this.age + " years old");
}
sayAge(); // I'm undefined years old.

/*
¿Porque undefined? Porque age no existe en this. ¿Y quien es this?
El que llama a la función sayAge, que en este caso es el contexto
global, es decir, el objeto "window".
*/

// Por tanto si hago esto, la cosa cambia:
age = 25; // equivalente a window.age = 25.
function sayAge() {
  console.log("I'm " + this.age + " years old");
}
sayAge(); // I'm 25 years old.

/*
Hemos creado una propiedad age al objeto global window.
window es el que llama a sayAge(), y como this apunta
al que llama (caller), ahora si funciona.
*/

// De forma equivalente:
var me = {
  name: "Javi",
  age: "36",
};
sayAge.call(me); // I'm 36 years old.

// Lo que podemos hacer es atar el contexto de la función a quien
// queramos, por ejemplo a 'me':
var sayMyAge = sayAge.bind(me);
sayMyAge(); // "I'm 36 years old"

// O como Instancias anonimas (alias object literal)
var me = {
  name: "Javi",
  age: 36,
  sayAge: function () {
    console.log("I'm " + this.age + " years old");
  },
};

me.sayAge(); // "I'm 36 years old"

///-- GETTERS & SETTERS *******************************************************

// La forma habitual de crear propiedades en objetos es la siguiente:
var book = {
  author: "Edward",
};

console.log(book.author); // "Edward"

// Pero también podemos crearlas a partir de "accessors" get/set.
// Con ello se tiene más control sobre la propiedad, que queda como privada.
var book = {
  get author() {
    return "I'm " + this._author; // Bucle infinto si llamamos a "this.author"
  },
  set author(newAuthor) {
    if (newAuthor !== "Alan") {
      // Bloqueo a Alan.
      this._author = newAuthor; // Same here.
    }
  },
};
book.author = "Edward";
console.log(book.author); // "I'm Edward"
book.author = "Alan";
console.log(book.author); // "I'm Edward"
console.log(book._author); // "Edward"
