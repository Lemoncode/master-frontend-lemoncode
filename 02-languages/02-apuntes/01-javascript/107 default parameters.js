///-- DEFAULT PARAMETERS *************************************************************************

// FUNCIONES

// A partir de ES6 podemos asignar valores por defecto a los parámetros de una función:
const greet = (name = "Unknown") => console.log(`Hello, ${name}!`);

greet(); // "Hello, Unknown!"
greet("Jake"); // "Hello, Jake!"

// Los valores por defecto se aplican para argumentos explicita o implicitamente undefined
// pero null se excluye:
greet(undefined); // "Hello, Unknown!"
greet(null); // "Hello, null!"

// DESTRUCTURING ASSIGNMENT en OBJETOS

// Se pueden aplicar valores por defecto a variables asignadas por destructuring
const greet = ({ name = "Unknown" }) => console.log(`Hello, ${name}!`);
greet({ age: 24 }); // "Hello, Unknown!"
greet({ name: "Carl" }); // "Hello, Carl!"
greet({}); // "Hello, Unknown!"

// PREGUNTA: Pero ¿que creeis que pasaría si llamo a la función sin argumento?
// ¿o con argumento null?

greet(); // ⚠ Si no inicializamos el parametro a {} esto daría TypeError.

// Para evitar esos errores tenemos que inicializar también el parámetro completo como objeto
// vacío, no solo su propiedad name.
const greet = ({ name = "Unknown" } = {}) => console.log(`Hello, ${name}!`);

greet(); // Hello, Unknown! Ahora si!

// Este sería el único caso todavía problemático.
// Al ser null un objeto no se toma la inicialización por defecto, el problema es que no se puede
// hacer destructuring sobre null.
greet(null); // ⚠ Uncaught TypeError.

// No obstante, ahora que ya conocemos el destructuring y el operador nullish coalescing, tenemos
// una alternativa igual de elegante y concisa. La solución para cubrirnos todos los casos sería
// la siguiente:
const greet = user => {
  const { name = "Unknown" } = user ?? {};
  console.log(`Hello, ${name}!`);
}
greet({}); // "Hello, Unknown!"
greet(); // "Hello, Unknown!"
greet(null); // "Hello, Unknown!"

// Si por último quisieramos considerar posibles casos donde name sea null, se puede
// reemplazar el destructuring por una combinación de optional chaining y nullish coalescing:
const greet = user => {
  const name = user?.name ?? "Unknown";
  console.log(`Hello, ${name}!`);
};

greet({ name: null }); // Hello, Unknown!

// // DESTRUCTURING ASSIGNMENT en ARRAYS

// Ejemplo con arrays:
const sumDice = ([d1 = 0, d2 = 0] = []) => d1 + d2;
console.log(sumDice()); // 0
console.log(sumDice([])); // 0
console.log(sumDice([3])); // 3

// CURIOSIDAD

// Los inicializadores por defecto de los parámetros de una función pueden ser expresiones.
// Además estas expresiones viven en un ámbito propio, superior al ámbito de función. Esto
// permite algo curioso: 
// Los parámetros a la izquierda están disponibles para las expresiones de inicialización
// por defecto de los parámetros a la derecha.

const greetWithMessage = (name = "Unknown", message = `Nice to see you ${name}`) =>
  console.log(`Hello, ${name}!`, message);

greetWithMessage("Javi", "Good morning!"); // Hello, Javi! Good morning!
greetWithMessage("Javi"); // Hello, Javi! Nice to see you Javi
greetWithMessage(); // Hello, Unknown! Nice to see you Unknown