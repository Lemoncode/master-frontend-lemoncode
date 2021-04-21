///-- ARROW FUNCTIONS *******************************************************


// SINTAXIS

// Funciones flecha o también llamadas "lambda". Siempre son anónimas.
const toUpper = (text) => {
  return text.toUpperCase();
};

// Si solo tenemos la sentencia "return" podemos acortar la función y ahorrarnos
// la palabra clave "return" y las llaves:
const toUpper = (text) => text.toUpperCase();

// También podemos omitir los paréntesis cuando el argumento es único:
const toUpper = text => text.toUpperCase();
// Sólo cuando es único, porque sino la coma de separación de argumentos se 
// podría confundir con el operador coma.

// En caso de que lo que devuelva sea un objeto literal hay que tener cuidado:
const toObject = (name, surname, age) => {
  return { name, surname, age }
}
// y utilizar paréntesis para devolver en la forma corta, ya que las llaves de
// objeto literal se confundirían con las llaves de ámbito de función.
const toObject = (name, surname, age) => ({ name, surname, age })


// Las "fat arrow" o "lambdas" puede utilizarse como si de un objeto se tratara, y 
// puede ser pasadas como argumentos de otra función, o devueltas como valor de retorno.
function createCounter() {
  let i = 0;
  return () => console.log(i++);
}
const printCounter = createCounter();
printCounter(); // 0
printCounter(); // 1
printCounter(); // 2


// THIS

// ¿Por qué otra forma de expresar funciones? ¿Es sólo estética? No, las funciones flecha
// tienen una característica muy importante, y es el motivo de su existencia:
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
f.call({age: 35}); // 35

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
g.call({surname: "calzado"}); // undefined pq window no tiene "surname".
g(); // undefined pq window no tiene "surname".

// Creemos un "surname" en "window":
surname = "camargo";
g.call({surname: "calzado"}); // camargo.
g(); // camargo.


// *** Problemática de las funciones clásicas vs arrow functions ***

// Las arrow function irrumpieron no solo por ser más expresivas y compactas sino
// para ofrecer una alternativa de funciones cuyo contexto fuese invariante, no cambiase,
// siempre es el mismo (ya que lo toma prestado el contexto en el que fue creada).
// De este modo el 'this' siempre se refiere a lo mismo en una 'arrow function', a diferencia
// de las funciones clásicas que pueden inducir a errores en ciertos casos. Veamos un ejemplo:

function Person(age) {
  this.age = age;
}

Person.prototype.sayDelayedAge = function() {
  setTimeout(function() { 
    console.log(this.age);  // Undefined
  }, 1000);
}

const me = new Person(37);
me.sayDelayedAge();


// Problema: al usar funciones clásicas como callbacks desconocemos quien las está invocando y como,
// perdemos la pista. En este ejemplo, el setTimeout registra ese callback pero es el ámbito global
// (el objeto window) quien invoca la función, por tanto this se refiere a window.

// Para demostrarlo basta hacer lo siguiente:
window.age = 50; // Añade esta linea al final y ejecuta de nuevo.


// *** FIX 1: 'Self' ***
Person.prototype.sayDelayedAge = function() {
  const self = this;
  setTimeout(function() {
    console.log(self.age);
  }, 1000);
}

// *** FIX 2: Bind ***
Person.prototype.sayDelayedAge = function() {
  const sayAge = function() {
    console.log(this.age);
  };
  setTimeout(sayAge.bind(this), 1000);
}

// *** FIX 3: Arrow function! ***
Person.prototype.sayDelayedAge = function() {
  setTimeout(() =>console.log(this.age), 1000);
}


// QUE NO SE PUEDE HACER CON LAS ARROW FUNCTIONS

// 1. Las "arrow functions" no pueden hacer tracking de sus argumentos a través
// de la variable dinámica "arguments".
function sum() {
  let total = 0;
  for (const num of arguments) {  // Aprovechar y explicar el for..of
    total += num;
  }
  return total;

  // Alternativa más compacta: Reduce!!!
  //return Array.from(arguments).reduce((acc, val) => acc + val);
}
console.log(sum(1, 2, 3)); // 6;

// Si lo intentamos nos petará (OJO en Stackblitz no peta)
const sum = () => {
  return Array.from(arguments).reduce((acc, val) => acc + val);
};
console.log(sum(1, 2, 3)); // Uncaught ReferenceError: arguments is not defined

// [!] No obstante, si lo que queremos es trackear argumentos, veremos en el capítulo
// de spread-rest operator como hacerlo fácilmente, ya sea una lambda o función. (...args)

// 2. Las funciones flecha no se pueden usar como constructores, no pueden
// ser llamadas con el operador "new", precisamente por el contexto:
const Person = (name) => {
  this.name = name; // "this" aqui sería el objeto "window".
};

const dan = new Person("Dan"); // Uncaught TypeError: Person is not a constructor

// 3. Y tampoco tienen propiedad "prototype" puesto que no puede ser constructoras.
const Person = (name) => {
  this.name = name;
};

console.log(Person.prototype); // undefined. (OJO en Stackblitz)