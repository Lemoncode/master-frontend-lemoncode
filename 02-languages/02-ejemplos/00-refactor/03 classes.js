///-- CLASSES *******************************************************

// Las clases se introdujeron en ES6 como una forma abreviada de
// implementar el modelo de prototipos. Es puro azúcar sintáctico.
// Recordemos que no existen clases como tales en JS. Todo se basa en
// funciones constructoras, prototipos y el operador new.

// Recordemos:
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
// Por debajo una clase es realmente una función constructora. No hay un tipo "class".
// Desentrañaremos este misterio más adelante con el modelo prototípico

// HERENCIA

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

// PROPIEDADES ESTÁTICAS

class Employee {
  // Propiedad estática
  static minSalary = 1200;

  constructor(name, salary) {
    this.name = name;
    this.salary = salary;
  }

  getDetails() {
    const diffSalary = Employee.minSalary - this.salary;
    const diffToString = Employee.isMinimumSalary(this.salary) > 0 ? 'más' : 'menos';
    return `${this.name} gana ${this.salary}€ (${Math.abs(diffSalary)}€ ${diffToString} que el SMI)`;
  }

  // Método estático
  static isMinimumSalary(salary) {
    return salary >= Employee.minimumSalary;
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

// PROPIEDADES PRIVADAS

// Sólo pueden ser accedidas desde métodos creados dentro del cuerpo de una clase

class Person {
  // [!] Deben ser declaradas dentro de la clase
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

  // Método estático
  static #isMinimumSalary(salary) {
    return salary >= Employee.#minimumSalary;
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


// Las clases también pueden ser anónimas, al igual que las funciones.
// Veamos un ejemplo de FACTORÍA DE CLASES. Usaremos una clase como ciudadano
// de primer orden (puesto que es una función): a esto se le llama 'class expression'.
// Aqui estamos usando el concepto de CLOSURE para 'recordar' el mensaje
// y crear clases especializadas (distintas) con distinto mensaje.
const makeClass = (message) => {
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

/// THIS & ARROW FUNCTIONS

// Las funciones flecha tienen una característica muy importante, y es el motivo de su existencia:
// *** Mantienen a "this" apuntando al contexto en el que fueron creadas ... SIEMPRE ***
// Es decir, el "this" dentro de una lambda siempre se refiere al contexto donde dicha
// lambda fue creada. "this" deja de ser el que llama a la lambda.
// Dicho de otro modo, las lambdas no tienen contexto propio porque siempre lo toman
// prestado desde el contexto donde fueron creadas.

// *** Ejemplos ***

function f() {
  console.log(this.age);  // Aqui el contexto es el "caller" de la función. this -> caller.
}

// Si llamo a f haciendo que su contexto sea un objeto que tenga 'age',
// no habrá problemas:
f.call({ age: 35 }); // 35

// De lo contrario:
f(); // undefined

// A menos que me cree una propiedad "age" en el contexto global "window":
age = 35;
f(); // 35

// Una arrow function no tiene contexto como tal sino que lo toma de donde
// ha sido definida.
const g = () => console.log(this.surname);

// Por tanto, no puedo hacer esto ahora, porque su contexto es siempre "window",
// tal y como ha sido definida la fat arrow.
g.call({ surname: "calzado" }); // undefined pq window no tiene "surname".
g(); // undefined pq window no tiene "surname".

// Creemos un "surname" en "window":
surname = "camargo";
g.call({ surname: "calzado" }); // camargo.
g(); // camargo.

// *** Problemática de las funciones clásicas vs arrow functions ***

// Las arrow function irrumpieron no solo por ser más expresivas y compactas sino
// para ofrecer una alternativa de funciones cuyo contexto fuese invariante, no cambiase,
// siempre es el mismo (ya que lo toma prestado el contexto en el que fue creada).
// De este modo el 'this' siempre se refiere a lo mismo en una 'arrow function', a diferencia
// de las funciones clásicas que pueden inducir a errores en ciertos casos. Veamos un ejemplo:

class Person {
  constructor(age) {
    this.age = age;
  }

  sayAge() {
    console.log(this.age);
  }

  sayDelayedAge() {
    setTimeout(function() {
      console.log(this.age);
    }, 1000);
  }
}

const me = new Person(38);
me.sayAge(); // 38, se muestra inmediatamente, this apunta a 'me'
me.sayDelayedAge(); // transcurrido un segundo se muestra ... undefined ... a que apunta this?

// Problema: al usar funciones clásicas como callbacks desconocemos quien las está invocando y como,
// perdemos la pista. En este ejemplo, el setTimeout registra ese callback pero es el ámbito global
// (el objeto window) quien invoca la función, por tanto this se refiere a window.

// Para demostrarlo basta hacer lo siguiente:
window.age = 50; // Añade esta linea al final y ejecuta de nuevo.


// *** FIX 1: 'Self' ***
class Person {
  constructor(age) {
    this.age = age;
  }

  sayAge() {
    console.log(this.age);
  }

  sayDelayedAge() {
    const self = this;
    setTimeout(function() {
      console.log(self.age);
    }, 1000);
  }
}

// *** FIX 2: Bind ***
class Person {
  constructor(age) {
    this.age = age;
  }

  sayAge() {
    console.log(this.age);
  }

  sayDelayedAge() {
    const sayAge = function() {
      console.log(this.age);
    };
    setTimeout(sayAge.bind(this), 1000);
  }
}

// *** FIX 3: Arrow function! ***
class Person {
  constructor(age) {
    this.age = age;
  }

  sayAge() {
    console.log(this.age);
  }

  sayDelayedAge() {
    setTimeout(() => {
      console.log(this.age);
    }, 1000);
  }
}
