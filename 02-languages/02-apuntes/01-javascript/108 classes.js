///-- CLASSES ************************************************************************************

/*
Las notación de clases se introdujo en ES6 como una forma abreviada de implementar el modelo de
prototipos**. Veamos sus características principales:

**IMPORTANTE: Como veremos más adelante en el capítulo de clases avanzadas, una vez hayamos
asimilado el concepto del prototipo y su herencia, descubriremos que la notación de clases no es
más que azúcar sintáctico que nos abstraen y simplifican la tarea de trabajar a más bajo nivel con
funciones constructoras, prototipos y el operador new. RECORDAD: en javascript las clases como tales
no existen!
*/


// *** SINTAXIS

class Person {
  // Esta función se ejecutará cada vez que creemos una instancia
  constructor(name) {
    this.name = name;
  }

  // Este método es creado una única vez y es compartido por todas las instancias
  greet() {
    console.log("Hello, I'm " + this.name);
  }
}

const antonio = new Person("Antonio");
antonio.greet(); // "Hello, I'm Antonio"

const javi = new Person("Javi");
javi.greet(); // "Hello, I'm Javi"

console.log(antonio.greet === antonio.greet);

console.log(typeof Person); // "function"
// Por debajo, una clase es realmente una función constructora. No hay un tipo "class".
// Desentrañaremos este misterio más adelante con el modelo prototípico.


// *** HERENCIA

class Automobile {
  constructor(wheels) {
    this.wheels = wheels;
    this.kms = 0;
  }

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

  service() {
    this.isOccupied = true;
  }

  drive(kms) {
    super.drive(kms);
    const serviceStatus = this.isOccupied ? "in service" : "free";
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


// *** PROPIEDADES ESTÁTICAS

class Employee {
  // Propiedad estática
  static minSalary = 1200;

  // Método estático
  static isMinimumSalary(salary) {
    return salary >= Employee.minSalary;
  }

  constructor(name, salary) {
    this.name = name;
    this.salary = salary;
  }

  getDetails() {
    const diffSalary = Employee.minSalary - this.salary;
    const diffToString = Employee.isMinimumSalary(this.salary) > 0 ? 'más' : 'menos';
    return `${this.name} gana ${this.salary}€ (${Math.abs(diffSalary)}€ ${diffToString} que el SMI)`;
  }
}

const juan = new Employee("Juán", 2010);
console.log(juan.getDetails());

const alan = new Employee("Alan", 1000);
console.log(alan.getDetails());

console.log(Employee.isMinimumSalary(900)); // false

// Las propiedades estáticas no existen en las instancias:
console.log(juan.minSalary); // undefined
console.log(juan.isMinimumSalary); // undefined


// *** PROPIEDADES PRIVADAS

// Sólo pueden ser accedidas desde métodos creados dentro del cuerpo de una clase

class Person {
  // ⚠ Deben ser declaradas dentro de la clase
  #name;
  constructor(name) {
    this.#name = name;
  }

  greet() {
    console.log("Hello, I'm " + this.#name);
  }
}

const antonio = new Person("Antonio");
antonio.greet();
console.log(antonio.name); // undefined
console.log(antonio.#name); // Error!

// Refactorización del mismo ejemplo Employee con propiedades privadas

class Employee {
  // Ahora este valor no es accesible de forma externa
  static #minSalary = 1200;

  // Método estático privado
  static #isMinimumSalary(salary) {
    return salary >= Employee.#minSalary;
  }

  #name;
  #salary;

  constructor(name, salary) {
    this.#name = name;
    this.#salary = salary;
  }

  getDetails() {
    const diffMinSalary = Math.abs(this.#salary - Employee.#minSalary);
    const diffMinSalaryToString = Employee.#isMinimumSalary(this.#salary) ? 'más' : 'menos';
    return `${this.#name} gana ${this.#salary}€ (${diffMinSalary}€ ${diffMinSalaryToString} que el SMI)`;
  }
}

const antonio = new Employee("Antonio", 2_000);
console.log(antonio.getDetails());


// *** CLASS FIELDS

// Podemos inicializar propiedades que parten de valores fijos sin usar constructor. Si te fijas
// las hemos visto anteriormente pero con otros modificadores: `static` y el prefijo de privado `#`.
// También podemos crear propiedades públicas de este modo:

class Counter {
  value = 0;
  increment() {
    this.value++;
  }

  decrement() {
    this.value--;
  }
}

const counter = new Counter();
console.log(counter.value); // 0
counter.increment();
console.log(counter.value); // 1
counter.decrement();
console.log(counter.value); // 0
