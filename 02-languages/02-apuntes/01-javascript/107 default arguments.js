///-- DEFAULT ARGUMENTS **************************************************************************

// A partir de ES6 podemos asignar valores por defecto a los argumentos de una función:
const greet = (name = "Unknown") => console.log("Hello, " + name);

greet(); // "Hello, Unknown"
greet("Jake"); // "Hello, Jake"

// Los valores por defecto son aplicados si el argumento es específicamente undefined
greet(undefined); // "Hello, Unknown"
greet(null); // "Hello, null"

// Se pueden aplicar valores por defecto a variables asignadas por destructuring
const logName = ({ name = "Unknown" }) => console.log(name);
logName({ age: 24 }); // "Unknown"
logName({ name: "Carl" }); // "Carl"
logName({}); // "Unknown"

// PREGUNTA: Pero ¿que creeis que pasaría si llamo a la función sin argumento?
// ¿o con argumento null?

logName(); // ⚠ Si no inicializamos el parametro a {} esto daría TypeError.

// Para evitar esos errores tenemos que inicializar también el argumento completo como objeto
// vacío, no solo su propiedad name.
const logName = ({ name = "Unknown" } = {}) => console.log(name);

logName(); // Unknown. Ahora si!

// Este sería el único caso todavía problemático.
// Al ser null un objeto no se toma la inicialización por defecto, el problema es que no se puede
// hacer destructuring sobre null.
logName(null); // ⚠ Uncaught TypeError.

// No obstante, ahora que ya conocemos el destructuring y el operador nullish coalescing, tenemos
// una alternativa igual de elegante y concisa. La solución para cubrirnos todos los casos sería
// la siguiente:
const logName = user => {
  const { name = "Unknown" } = user ?? {};
  console.log(name);
}
logName({}); // "Unknown"
logName(); // "Unknown"
logName(null); // "Unknown"

// Ejemplo con arrays:
const sumDice = ([d1 = 0, d2 = 0] = []) => d1 + d2;
console.log(sumDice()); // 0
console.log(sumDice([])); // 0
console.log(sumDice([3])); // 3
