///-- TIPOS AVANZADOS **************************************************

// Hasta ahora hemos visto la base de Typescript sobre la que se sustenta
// todo el chequeo de tipos. Pero la verdadera potencia llega con los tipos
// avanzado.



// *** ALIAS ***************

// Un alias no es más que un nuevo nombre para un tipo, sea cual sea,
// tipos primitivos, interfaces, funciones, uniones, etc:
// Es muy util para REUSAR tipos cuya definición es más compleja o verbosa
// de forma fácil y eficiente, abstrayéndola a un nombre simple, sin tener
// que repetirla una y otra vez.

// -- Caso Base --
type Message = string | number;
type FunctionVoid = () => void;
type Whatever<T> = {
  value: T;
}

// Muy util para abstraernos de definiciones complejas. No crea nuevos
// tipos, solo nuevos nombres para referirse a ellos.
type ReducerFunction<S> = (previousState: S, update: Partial<S>) => S;




// *** INTERSECCIÓN ***************

// Con la intersección podemos combinar múltiples tipos en uno solo. Sería
// equivalente al operador AND lógico pero con tipos.
// Es muy util para hacer composiciones:

// -- Caso Base --
type Merged = { a: string } & { b: string };
const ab: Merged = { a: "A", b: "B" };

// Podría haber colisión, en tal caso, el tipado será never:
type MergedCollision = { a: string } & { a: number }; // a: never
const abc: MergedCollision = { a: 1 }; // Ni number ni string


// -- Caso Práctico --
const compose = <A, B>(a: A, b: B): A & B => ({ ...a, ...b });

const cat = compose({ type: "feline" }, { skill: "hunting" });
const pigeon = compose({ wings: true }, { type: "bird" });

console.log(cat.type);
console.log(pigeon.skill); // TS error: Property 'skill' is missing.




// *** UNIÓN ***************

// Siguiendo la analogía anterior, la unión de tipos sería entendida como
// el operador OR. La unión de tipos es muy util para indicar que una
// determinada entidad podrá ser de un tipo u otro, ámbos válidos.

// -- Caso Base --
type A = "a" | "A" | "á" | "à";
type B = "b" | "B";
type AB = A | B; // "a" | "A" | "á" | "à" | "b" | "B"

// -- Caso Práctico --

// Por ejemplo, sin unión, tendriamos que recurrir al any para admitir
// argumentos de tipo string o númerico:
const saySomething = (message: any) => console.log(message);

// Pero con la unión, restringimos el argumento a los tipos deseados:
const saySomethingTyped = (message: string | number) => console.log(message);

saySomethingTyped(true); // TS error: Argument of type 'true' is not assignable




// *** GUARDAS ***************

// La situación anterior, sin embargo, puede llevarnos a un escenario donde
// tengamos que comprobar de que tipo concreto es un determinado argumento
// recibido, de entre todos los posibles tipos de su unión.

// Por tanto, las guardas surgen ante la necesidad de tener que desambiguar
// uniones.

// Imaginemos la siguiente situacion, 2 interfaces y una función que
// devuelve uno u otro de forma aleatoria:

const randomBool = (): boolean => Boolean(Math.round(Math.random()));

interface Human {
  sleep: () => void;
}

interface Man extends Human {
  moustache: boolean;
}

interface Woman extends Human {
  longHair: boolean;
}

const randomMan = (): Man => ({
  moustache: randomBool(),
  sleep: () => console.log("Man is zzz"),
});

const randomWoman = (): Woman => ({
  longHair: randomBool(),
  sleep: () => console.log("Woman is zzz"),
});

const getRandomPerson = (): Man | Woman =>
  randomBool() ? randomMan() : randomWoman();


// ¿Cómo se que tengo un hombre o una mujer devueltos?
const person = getRandomPerson();
if (person.moustache) { } // TS error: Property 'moustache' does not exist on type 'Woman'
if (person.longHair) { } // TS error: Property 'longHair' does not exist on type 'Man'

// [!] El acceso a estas propiedades causa un error porque tenemos
// que DESAMBIGUAR el tipo. Para ello recurrimos a las GUARDAS.
// Podemos construirlas de distintas maneras:

// -- Guardas Definidas por el Usuario

// Estas guardas se usan cuando queremos desambiguar objetos.
// Una forma podría ser aplicando "duck typing" mediante el operador
// "in" para comprobar de forma segura que una propiedad existe
// en un objeto:
if ("moustache" in person) {
  console.log("Man with moustache:", person["moustache"]);
} else if ("longHair" in person) {
  console.log("Woman with long hair:", person["longHair"]);
}

// Otra forma más habitual para hacer el "duck typing" consiste en
// hacer uso de la aseveración de tipos para discriminar entre
// uno u otro:
if ((person as Man).moustache !== undefined) {
  console.log("Man with moustache:", (person as Man).moustache);
} else if ((<Woman>person).longHair !== undefined) {
  console.log("Woman with long hair:", (<Woman>person).longHair);
}

// Hasta aqui bien, pero hemos tenido que 'engañar' a intellisense
// para que funcione correctamente.
// Una forma más eficiente para este tipo de guardas sería haciendo
// uso de de una funcion especial de chequeo que devuelve un
// "type predicate":
const isMan = (whoever: any): whoever is Man =>
  (<Man>whoever).moustache !== undefined;

if (isMan(person)) {
  console.log("Man with moustache:", person.moustache);
} else {
  console.log("Woman with long hair:", person.longHair);
}

// -- Guardas con "typeof"

// Cuando queremos desambiguar tipos primitivos, podemos recurrir
// al operador "typeof":
const giveMeSomething = (): number | string =>
  randomBool() ? 13 : "trece";

const something = giveMeSomething();
if (typeof something === "number") { }


// -- Guardas con "instanceof"

// Cuando queremos desambiguar clases, es habitual recurrir
// al operador "instanceof":
class Bool { value: boolean };

const giveMeSomeClass = (): Bool | String =>
  randomBool() ? { value: true } : "trece";

const someClass = giveMeSomeClass();
if (someClass instanceof Bool) console.log("Is Bool");
else console.log("Is String");




// *** STRING & NUMERIC LITERALS ***************

// Muy útil para hacer que un tipo solo pueda tomar determinados
// valores literales, es decir, limitar el conjunto de posibles valores
// a un subconjunto finito. Se emplea habitualmente junto con la unión:

// -- Caso Práctico --
type LabourDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
const day: LabourDay = "sunday";  // TS error: '"sunday"' is not assignable to type 'LabourDay'

// También es aplicable a números literales:
const throwDice = (): 1 | 2 | 3 | 4 | 5 | 6 => {
  return 6; // Dado trucado MUAHAHAHAHA.
}




// *** KEYOF ***************

// Operador muy util para extraer las propiedades de un interfaz como
// posibles literales de un tipo concreto:

// -- Caso Base --
interface Week {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}
type Day = keyof Week;

// -- Caso Práctico --
const showProps = <T>(obj: T, ...keys: (keyof T)[]): void => {
  keys.forEach(key => console.log(obj[key]));
};

const dev = {
  type: "frontend",
  languages: ["js", "css", "html"],
  senior: true,
};
showProps(dev, "type", "languages"); // Check intellisense!;




// *** TIPOS MAPEADOS (MAPPED TYPES) ***************

// Nos permiten crear nuevos alias a partir de las propiedades de otro alias.

// -- Caso Práctico --
interface ProductItem {
  name: string;
  price: number;
}

// Index type => Acceder al tipo de una propiedad en un interface:
type ProductName = ProductItem["name"];

// El objeto resultante tendrá todas las propiedades de Obj
// y valores funciones transformadoras
type Evolver<Obj> = {
  [Key in keyof Obj]?: (arg: Obj[Key]) => Obj[Key];
}

// Función que devolverá una nueva copia del objeto aplicando
// las transformaciones en las propiedades
const evolve = <Obj extends object>(transformations: Evolver<Obj>, obj: Obj): Obj => {
  return Object.keys(obj).reduce<Obj>((result, key) => {
    result[key] = key in transformations
      ? transformations[key](obj[key])
      : obj[key];
    return result;
  }, {} as Obj);
}

const product: ProductItem = {
  name: "  macbook Pro 16\" ",
  price: 2638,
};

// Transformaciones:
const formatString = (str: string) => (
  str = str.trim(),
  str[0].toUpperCase() + str.substr(0)
)

const applyIVA = (price: number): number => price * 1.21;

// Aplicación
const updatedProduct = evolve({ name: formatString, price: applyIVA }, product);

console.log(updatedProduct);




// *** TIPOS CONDICIONALES ***************

// Permite mapear a diferentes tipos comprobando el valor de otro.
// En la practica es equivalente a poder usar ternarios para tipos.

// -- Caso Práctico --
type DarkColors = "black" | "grey";
type LightColors = "white" | "yellow" | "pink";

type Status = "sad" | "happy";

type Palette<P extends Status> = P extends "sad" ?
  DarkColors : LightColors;

const palette: Palette<"sad"> = "black";  // Only black or grey allowed.




// *** RECURSIVIDAD ***************

// -- Recursividad en Interfaces --

// Podemos plantearnos el tipado de una estructura en árbol del siguiente
// modo:
interface TreeNode<T> {
  value: T;
  children?: Array<TreeNode<T>>;  // Colección opcional de más nodos (hijos)
}

const myTree: TreeNode<number> = {
  value: 1,
  children: [{ value: 2 }, { value: 3, children: [{ value: 4 }] }],
};

// -- Recursividad en Alias con Interfaces --

// Aunque aplicando la recursividad en interfaces si que podíamos hacer
// cosas muy interesantes como esta:
type IterableList<T> = T & { next: IterableList<T> };

interface Student {
  name: string;
}

let classList: IterableList<Student>;
classList.name;
classList.next.name;
classList.next.next.name;

// -- Recursividad en Alias --

// * Antes de la versión 3.7 de TS no se podía hacer recursividad
// en la declaración de los Alias. Es decir, que la declaración del
// alias se refiera a sí misma. De lo contrario nos daría un error
// de referencia circular.

// Por ejemplo, si queremos tipar nuestro árbol como:
type TreeNodeError<T> = T | Array<TreeNodeError<T>>; // TS Error Circular Reference
// Obtenemos un error de referencia circular.

// Para burlar esta limitación podemos usar una técnica conocida como
// "middleman", con la que desdoblamos la parte recursiva y la extraemos:
interface TreeChildren<T> extends Array<TreeNodeMM<T>> { } // Middleman.
type TreeNodeMM<T> = T | TreeChildren<T>;

const myTreeMM: TreeNodeMM<string> = ["hello", [["world"], "!"]];


// * A partir de la version 3.7 de TS ya si está soportada totalmente
// la recursión con Alias. Esto abre un abanico de nuevas posibilidades.
type TreeNodeR<T> = T | Array<TreeNodeR<T>>;

const myTreeRecursive: TreeNodeR<boolean> = [true, [false, true, [false]]];
