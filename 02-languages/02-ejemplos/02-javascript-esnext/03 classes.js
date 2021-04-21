///-- CLASSES *******************************************************

// Las clases se introdujeron en ES6 como una forma abreviada de
// implementar el modelo de prototipos. Es puro azúcar sintáctico.
// Recordemos que no existen clases como tales en JS. Todo se basa en
// funciones constructoras, prototipos y el operador new.

// Recordemos:
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function () {
  console.log("Hello, I'm " + this.name);
};
const antonio = new Person("Antonio");
antonio.greet(); // "Hello, I'm Antonio"

// Una forma rápida de conseguir esto mismo en ES6 es usando la
// palabra reservada "class".
class Person {
  constructor(name) {
    // Mi antigua función constructora
    this.name = name;
  }

  greet() {
    console.log("Hello, I'm " + this.name);
  }
}
const antonio = new Person("Antonio");
antonio.greet(); // "Hello, I'm Antonio"

// Formular pregunta, ¿que pensáis que dará esto?
console.log(typeof Person); // function!
// No hay tipo "class" en JS. Una clase equivale a su función constructora.

// HERENCIA

// La herencia se aplica usando la palabra clave "extends".
// Veamos el ejemplo de Automobile transformado a sintaxis de "class".

// Recordemos
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

function Taxi() {
  Automobile.call(this, 4); // super();
  this.isOccupied = false;
}

Taxi.prototype = Object.create(Automobile.prototype); // extends Automobile
Taxi.prototype.constructor = Taxi;
Taxi.prototype.service = function () {
  this.isOccupied = true;
};

// super.run()
Taxi.prototype.drive = function (kms) {
  Automobile.prototype.drive.call(this, kms); // super.drive()
  var serviceStatus = this.isOccupied ? "in service" : "free";
  console.log("And I am " + serviceStatus);
};

// @override;
Taxi.prototype.showKms = function () {
  console.log("Taxi Total Kms: " + this.kms);
};

const taxi = new Taxi();
console.log(taxi);
taxi.drive(100); // "Driving 100kms... And I am free"
console.log(taxi.isOccupied); // false
taxi.service();
console.log(taxi.isOccupied); // true
taxi.drive(50); // "Driving 50kms... And I am in service"
taxi.showKms(); // "Taxi total Kms: 150"

// Todo ese ejemplo sería equivalente a lo siguiente:
class Automobile {
  constructor(wheels) {
    this.wheels = wheels;
    this.kms = 0;
  }

  // Estos métodos se añadirán al objeto Automobile.prototype.
  drive(kms) {
    this.kms += kms;
    console.log("Driving " + kms + "kms...");
  }

  showKms() {
    console.log("Total Kms: " + this.kms);
  }
}

class Taxi extends Automobile {
  constructor() {
    super(4);
    this.isOccupied = false;
  }

  // Estos métodos se añadirán al objeto Taxi.prototype.
  service() {
    this.isOccupied = true;
  }

  drive(kms) {
    super.drive(kms);
    var serviceStatus = this.isOccupied ? "in service" : "free";
    console.log("And I am " + serviceStatus);
  }

  showKms() {
    console.log("Taxi Total Kms: " + this.kms);
  }
}
const taxi = new Taxi();
console.log(taxi);
taxi.drive(100); // "Driving 100kms... And I am free"
console.log(taxi.isOccupied); // false
taxi.service();
console.log(taxi.isOccupied); // true
taxi.drive(50); // "Driving 50kms... And I am in service"
taxi.showKms(); // "Taxi total Kms: 150"

// Las clases también pueden ser anónimas, al igual que las funciones.
// Veamos un ejemplo de FACTORÍA DE CLASES. Usaremos una clase como ciudadano
// de primer orden (puesto que es una función): a esto se le llama 'class expression'.
// Aqui estamos usando el concepto de CLOSURE para 'recordar' el mensaje
// y crear clases especializadas (distintas) con distinto mensaje.
function makeClass(message) {
  return class {
    talk() {
      console.log(message);
    }
  };
}

const Cat = makeClass("Meow!");
const cat = new Cat();
cat.talk();

const Dog = makeClass("Woof!");
const dog = new Dog();
dog.talk();
