///-- TIPOS AVANZADOS *****************************************************************************

// Hasta ahora hemos visto la base de Typescript sobre la que se sustenta todo el chequeo de tipos.
// Pero la verdadera potencia llega con los tipos avanzado.


// *** ALIAS ***************

// Un alias no es más que un nuevo nombre para un tipo, sea cual sea, tipos primitivos, interfaces,
// funciones, uniones, etc. Es muy util para REUSAR tipos cuya definición es más compleja o verbosa
// de forma fácil y eficiente, abstrayéndola a un nombre simple, sin tener que repetirla una
// y otra vez.

// -- Caso Base --
type Message = string | number;
type FunctionVoid = () => void;
type Whatever<T> = {
  value: T;
};

// *** IMPORTANTE - INCISO: Los type alias también se pueden usar para declarar la forma de un 
// objeto, del mismo modo que hacen los interfaces. Tenemos por tanto 2 maneras de especificar la 
// firma de un objeto a nivel de tipos: interfaces y type alias. Y ambas formas permiten la 
// extensión, lo interfaces a través de 'extends' y los type alias mediante intersección de tipos 
// '&'. Entonces, ¿cual es la diferencia? Mientras que los interfaces son 'abiertos' y permiten 
// continuar extendiéndolos con múltiples declaraciones, los type alias son cerrados y solo podemos 
// definirlos 1 vez:

interface PersonI {
  name: string;
}
interface PersonI {
  age: number;
}
const me: PersonI = { name: "John", age: 30 };

type PersonT = { name: string };  // [ts] Duplicate identifier
type PersonT = { age: number };   // [ts] Duplicate identifier

// Por lo general se suele recomendar el uso de interfaces para tipar objetos debido a esta
// capacidad extra.
// https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces

// -- Caso Práctico Simple --

type StringValidator = (input: string) => boolean;

const isEvenWord: StringValidator = input => input?.length % 2 === 0;
const isEmail: StringValidator = input => /\S+@\S+\.\S+/.test(input);

console.log(isEvenWord("yes"));
console.log(isEvenWord("no"));
console.log(isEmail("not-an-email.com"));
console.log(isEmail("example@domain.com"));

// -- Caso Práctico Extendido (Reducer, opcional) --

// Alias es muy util para abstraernos de definiciones complejas. No crea nuevos tipos, solo nuevos
// nombres para referirse a ellos.
type VoidFn = () => void;
type ReducerFn<S> = (prevState: S) => S;

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
}

interface UserStorage {
  log: VoidFn;
  set: (reducer: ReducerFn<User>) => void;
  reset: VoidFn;
}

const userStorage = (initialUser: User): UserStorage => {
  let user: User = initialUser;

  return {
    log: () => console.log(...Object.values(user)),
    set: reducer => {
      user = reducer(user);
    },
    reset: () => {
      user = initialUser;
    },
  };
};

const myUser = userStorage({
  id: 238943,
  name: "Javier",
  surname: "Calzado",
  email: "javi.calzado@lemoncode.net",
});

myUser.log();
myUser.set(currentUser => ({ ...currentUser, name: "Santi", surname: "Camargo" }));
myUser.log();
myUser.reset();
myUser.log();


// *** INTERSECCIÓN ***************

// Con la intersección podemos combinar múltiples tipos en uno solo. Sería equivalente al operador
// AND lógico pero con tipos. Es muy util para hacer composiciones:

// -- Caso Base --
type Merged = { a: string } & { b: string };
const ab: Merged = { a: "A", b: "B" };

// Podría haber colisión, en tal caso, el tipado será never:
type MergedCollision = { a: string } & { a: number }; // a: never
const abc: MergedCollision = { a: 1 }; // Ni number ni string

// -- Caso Práctico --
const merge = <A, B>(a: A, b: B): A & B => ({ ...a, ...b });

const cat = merge({ type: "feline" }, { skill: "hunting" });
const pigeon = merge({ type: "bird" }, { wings: true });

console.log(cat.type);
console.log(pigeon.skill); // TS error: Property 'skill' is missing.


// *** UNIÓN ***************

// Siguiendo la analogía anterior, la unión de tipos sería entendida como el operador OR. La unión
// de tipos es muy util para indicar que una determinada entidad podrá ser de un tipo u otro,
// ámbos válidos.

// -- Caso Base --
type A = string;
type B = number;
type AB = A | B; // string | number

// -- Caso Práctico --

// Por ejemplo, sin unión, tendriamos que recurrir al any para admitir argumentos híbridos,
// es decir, que puedan ser de múltiples tipos (ejemplo: string o number):
const double = (value: any): any => (typeof value === "number" ? value * 2 : value + value);

console.log(double("hello")); // "hellohello"
console.log(double(4)); // 8

// Pero con la unión, restringimos el argumento a los tipos deseados:
const double = (value: string | number): string | number =>
  typeof value === "number" ? value * 2 : value + value;

double(true); // TS error: Argument of type 'true' is not assignable


// *** GUARDAS ***************

// La situación anterior, sin embargo, puede llevarnos a un escenario donde tengamos que comprobar
// de que tipo concreto es un determinado argumento recibido, de entre todos los posibles tipos de
// su unión.
// Por tanto, las guardas surgen ante la necesidad de tener que desambiguar uniones o
// aseverar tipos.

// Imaginemos la siguiente situacion, 2 interfaces y una función que
// devuelve uno u otro de forma aleatoria:

interface BaseResource {
  id: string;
  name: string;
  format: string;
}

interface VideoResource extends BaseResource {
  framerate: number;
  duration: number;
}

interface AudioResource extends BaseResource {
  album: string;
  duration: number;
}

type Resource = VideoResource | AudioResource;

// ¿Cómo se que tengo un hombre o una mujer devueltos?
declare const resource: Resource;
if (resource.framerate) {
} // TS error: Property 'framerate' does not exist on type 'AudioResource'
if (resource.album) {
} // TS error: Property 'album' does not exist on type 'VideoResource'

// ⚠ El acceso a estas propiedades causa un error porque tenemos que DESAMBIGUAR el tipo.
// Para ello recurrimos a las GUARDAS. Podemos construirlas de distintas maneras:

// -- Guardas Definidas por el Usuario

// Estas guardas se usan cuando queremos desambiguar objetos. Una forma podría ser aplicando
// "duck typing" mediante el operador "in" para comprobar de forma segura que una propiedad existe
// en un objeto:
if ("framerate" in resource) {
  console.log("Video resource:", resource.framerate);
} else if ("album" in resource) {
  console.log("Audio resource:", resource.album);
}

// Otra forma más habitual para hacer el "duck typing" consiste en hacer uso de la aseveración de
// tipos para discriminar entre uno u otro:
if ((resource as VideoResource).framerate !== undefined) {
  console.log("Video resource:", (resource as VideoResource).framerate);
} else if ((<AudioResource>resource).album !== undefined) {
  console.log("Audio resource:", (<AudioResource>resource).album);
}

// Hasta aqui bien, pero hemos tenido que 'engañar' a intellisense para que funcione correctamente.
// Una forma más eficiente para este tipo de guardas sería haciendo uso de de una funcion especial
// de chequeo que devuelve un "type predicate". Este tipo de funciones también son útiles cuando
// queremos desambiguar tipos usando comprobaciones en tiempo de ejecución mediante alguna
// computación:
const isVideoResource = (resource: Resource): resource is VideoResource => "framerate" in resource;

if (isVideoResource(resource)) {
  console.log("Video resource:", resource.framerate);
} else {
  console.log("Audio resource:", resource.album);
}

// -- Guardas con "typeof"

const randomBool = (): boolean => Math.random() >= 0.5;

// Cuando queremos desambiguar tipos primitivos, podemos recurrir al operador "typeof":
const value: string | number = randomBool() ? "hello" : 13;

// En este ejemplo utilizaremos el operador `as` ya que TypeScript es lo suficientemente listo
// para entender que acabamos de asignar un valor numérico devuelto por `Math.random()`

if (typeof value === "number") {
  console.log("It is a number", value.toFixed(2));
} else {
  console.log("It is a number", value.toUpperCase());
}

// -- Guardas con "instanceof"

// Cuando queremos desambiguar instancias de clases, es habitual recurrir al operador "instanceof":

const giveMeSomeInstance = (): Number | String =>
  randomBool() ? new Number(13) : new String("hello");

const someInstance = giveMeSomeInstance();
if (someInstance instanceof Number) {
  console.log("I'ts a Number instance");
} else {
  console.log("It's  a String");
}


// *** STRING & NUMERIC LITERALS ***************

// Muy útil para hacer que un tipo solo pueda tomar determinados valores literales, es decir,
// limitar el conjunto de posibles valores a un subconjunto finito. Se emplea habitualmente
// junto con la unión:

// -- Caso Práctico --
type WorkingDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
const day: WorkingDay = "sunday"; // TS error: '"sunday"' is not assignable to type 'WorkingDay'

// También es aplicable a números literales:
type Dice = 1 | 2 | 3 | 4 | 5 | 6;
const throwDice = (): Dice => Math.floor(Math.random() * 6 + 1) as Dice;


// *** TEMPLATE LITERALS ************************

// Los template literals nos traen la interpolación en los tipos literales, de modo que se puedan
// construir uniones de literales que respondan a un patrón o template, en lugar de indicarlos
// a mano uno a uno:

type DayMood = "happy" | "sad" | "crazy" | "frenzy" | "chaotic";
type MyDay = `${DayMood} ${WorkingDay}`;

// También funciona combinando interpolación de literales string y numéricos:
type MyDayWithScale = `${DayMood} ${WorkingDay} - Level ${1 | 2 | 3}`;


// *** KEYOF ***************

// Operador muy util para extraer las propiedades de un interfaz como posibles literales de un
// tipo concreto:

// -- Caso Base --
interface Person {
  name: string;
  age: number;
  adult: boolean;
}
type PersonKey = keyof Person; // type PersonKey = "name" | "age" | "adult";

// -- Caso Práctico --
const showProps = <O extends object>(obj: O, ...keys: (keyof O)[]) => {
  keys.forEach(key => console.log(key, obj[key]));
};

const javi: Person = { name: "Javi", age: 41, adult: true };
showProps(javi, "adult", "color"); // Check intellisense!;


// *** TIPOS MAPEADOS (MAPPED TYPES) ***************

// Nos permiten crear nuevos alias a partir de las propiedades de otro alias.

// -- Caso Práctico --
interface ProductItem {
  name: string;
  price: number;
}

// Index type => Acceder al tipo de una propiedad en un interface:
type ProductName = ProductItem["name"];

// El objeto resultante tendrá todas las propiedades de Obj y valores funciones transformadoras
type Evolver<Obj> = {
  [Key in keyof Obj]?: (arg: Obj[Key]) => Obj[Key];
};

// Función que devolverá una nueva copia del objeto aplicando  las transformaciones en
// las propiedades
const evolve = <Obj extends object>(transformations: Evolver<Obj>, obj: Obj): Obj => {
  return Object.entries(obj).reduce<Obj>((result, [key, value]) => {
    result[key] = key in transformations ? transformations[key](value) : value;
    return result;
  }, {} as Obj);
};

const product: ProductItem = {
  name: '  macbook Pro 16" ',
  price: 2638,
};

// Transformaciones:
const formatString = (str: string) => {
  str = str.trim();
  return str[0].toUpperCase() + str.slice(1);
};

const applyIVA = (price: number): number => price * 1.21;

// Aplicación
const updatedProduct = evolve({ name: formatString, price: applyIVA }, product);

console.log(updatedProduct);


// *** TIPOS CONDICIONALES ***************

// Permite mapear a diferentes tipos comprobando el valor de otro. En la practica es equivalente a
// poder usar ternarios para tipos.

// -- Caso Práctico --
type DarkColors = "black" | "grey";
type LightColors = "white" | "yellow" | "pink";

type Status = "sad" | "happy";

type Palette<P extends Status> = P extends "sad" ? DarkColors : LightColors;

const palette: Palette<"sad"> = "black"; // Only black or grey allowed.


// *** RECURSIVIDAD ***************

// -- Recursividad en Interfaces --

// Podemos plantearnos el tipado de una estructura en árbol del siguiente modo:
interface TreeNode<T> {
  value: T;
  children?: Array<TreeNode<T>>; // Colección opcional de más nodos (hijos)
}

const myTree: TreeNode<number> = {
  value: 1,
  children: [{ value: 2 }, { value: 3, children: [{ value: 4 }] }],
};

// -- Recursividad en Alias con Interfaces --

// Aunque aplicando la recursividad en interfaces si que podíamos hacer cosas muy interesantes
// como esta:
type IterableList<T extends object> = T & { next: IterableList<T> | null };

interface Student {
  name: string;
}

let classList: IterableList<Student> = {name: "Javi", next: { name: "Santi", next: null }};
classList.name;
classList.next?.name;
classList.next?.next?.name;

// -- Recursividad en Alias --

// * A partir de la version 3.7 de TS ya se soporta totalmente la recursión con Alias.
// Esto abre un abanico de nuevas posibilidades.
type RecursiveArray<T> = (T | RecursiveArray<T>)[];

const myRecursiveArray: RecursiveArray<number> = [
  1,
  2,
  [3, [4, 5], 2],
  [1, [3, [4]]],
];

// -- Limitación --

// Una limitación en los tipos recursivos es no poder recurrir a una 'auto-instanciación' inmediata
// o dicho de otro modo, un tipo que es recursivo, en su definición, no puede instanciarse a si 
// mismo, de lo contrario obtendremos un error de referencia circular:
type MyType<T> = T | MyType<T>;



// -- DEPRECATED --
// * Antes de la versión 3.7 de TS no se podía hacer recursividad en la declaración de los Alias.
// Es decir, que la declaración del alias se refiera a sí misma. De lo contrario nos daría un error
// de referencia circular.

// Para burlar esta limitación se usaba una técnica conocida como "middleman", con la que
// desdoblamos la parte recursiva y la extraíamos:
interface TreeChildren<T> extends Array<TreeNodeMM<T>> {} // Middleman.
type TreeNodeMM<T> = T | TreeChildren<T>;

const myTreeMM: TreeNodeMM<string> = ["hello", [["world"], "!"]];


// *** CASO PRÁCTICO RECURSIVIDAD y TIPOS CONDICIONALES: INFERENCIA EXPLÍCITA ***************

// Es habitual utilizar los tipos condicionales para intentar adivinar si un tipo tiene una
// "constraint" concreta o no, es decir, si tiene la forma que esperamos o no. Para ayudarnos
// en esta búsqueda, los tipos condicionales proporcionan un mecanismo de inferencia que
// introduce nuevos tipos genéricos ineridos sobre la marcha: la keyword "infer".

// EJEMPLO MÁS SENCILLO SIN RECURSIVIDAD ***************
type IsPrimitiveArray<T extends any[]> = T extends (infer Type)[] ? Type extends object? false : true : never;

type Result1 = IsPrimitiveArray<[1, 2]>;
type Result2 = IsPrimitiveArray<["a", "b"]>;
type Result3 = IsPrimitiveArray<[{}]>;

// EJEMPLO CON RECURSIVIDAD ****************************
type RemoveZeroes<T extends any[]> = T extends [infer Head, ...infer Tail]
  ? Head extends 0
    ? RemoveZeroes<Tail>
    : [Head, ...RemoveZeroes<Tail>]
  : T;

type Result4 = RemoveZeroes<[0, 1, true, 0, 2, 0, "hello", 0, {}]>;

// Y una implementación básica, podría ser:

// Fijaos como he añadido el genérico T como const para que lo interprete como una tupla.
const removeZeroes = <const T extends any[]>(array: T): RemoveZeroes<T> => 
  array?.filter(x => x !== 0) as any;

// Mira intellisense encima de 'result'
const result = removeZeroes([0, 1, true, "hello", 0, {name: "Santi"}, 0]);


// *** OPERADORES AVANZADOS *****************************************************************

/**
 * 1. Const inference
 * La palabra clave `const` puede usarse en TS para indicar al sistema de inferencia de tipos
 * que sea lo más específico posible, de manera que extraiga todos los valores literales exactos 
 * como tipos, en lugar de usar tipos convencionales como string, number, boolean, etc.
 * 
 * Esto es útil cuando queremos hacer ciertos valores inmutables y poder extarer su tipado de manera
 * literal, haciendo que su tipo sea exactamente los valores que tiene asignados.
 */

const DEBUG_CONFIG = { // Chequea el tipo inferido con y sin 'as const'
  env: 'development',
  debug: true,
} as const;

const ROLES = ["admin", "user", "viewer"] as const; // Chequea el tipo inferido con y sin 'as const'

/**
 * 2. Const type parameters
 * 
 * De igual modo, podemos utilizar la palabra clave const delante de parámetros de tipo (genéricos)
 * para indicar a TS que, una vez se pase algún valor como argumento de dicho parámetro, se extraiga
 * su tipo forma literal. 
 * 
 * Esto permite que los genéricos conserven los valores literales exactos. Suele ser muy útil para 
 * trabajar con tuplas e interfaces literales.
*/

// Sin const
const createTuple = <T extends any[]>(...items: T) => items;
const result = createTuple(1, "hello", true); // Tipo inferido => [number, string, boolean]

// Con const
const createTuple = <const T extends any[]>(...items: T) => items;
const result = createTuple(1, "hello", true); // Tipo inferido => [1, "hello", true]

/**
 * 3. Satisfies
 * 
 * El operador 'satisfies' verifica que un valor cumple exactamente con un tipo o interfaz, sin 
 * cambiar el tipo inferido del valor. 
 * 
 * Es útil para asegurar que un objeto literal respeta una estructura, pero mantiene sus tipos 
 * literales. En otras palabras, ayuda a validar estructuras sin perder la precisión de los tipos
 * literales.
 */

interface Admin {
  id: number;
  name: string;
}

const ADMINS = [
  { id: 1, name: "Santi" },
  { id: 2, name: "Javi" },
] as const satisfies Admin[];