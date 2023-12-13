///-- TIPOS GENÉRICOS DE UTILIDADES ***************************************************************

// Tipos que operan principalmente sobre interfaces y permiten realizar cómodamente
// transformaciones de los mismos.

// Esquema copy/paste para presentar:

// *** X ***************

// -- Caso Base --

// -- Caso Práctico --

// -- Definición --

// *** READONLY ***************

// Convierte todas las propiedades de un interfaz en solo lectura:

// -- Caso Base --
interface State {
  username: string;
  password: string;
}

type ROState = Readonly<State>;

// También aplicable a arrays:

type ROArray<T> = Readonly<Array<T>>;
// De hecho existe el tipo ReadonlyArray

// -- Caso Práctico --
// Un caso muy útil de Readonly se aplica para garantizar que una implementación no va a mutar un
// objeto determinado. Así, el consumidor de dicha implementación (una función por ejemplo) tiene
// garantías de que los parámetros de entrada no serán mutados. Pongamos un ejemplo con arrays,
// donde se ve más claro, aunque lo mismo serviría para objetos:

const sampleArray = [1, 2, 3];

const tailMutable = <T>(array: T[]): T[] => (array.shift(), array);

const tailImmutable = <T>(array: Readonly<T[]>): T[] => {
  const [, ...tail] = array ?? [];
  return tail;
};

console.log(sampleArray, tailMutable(sampleArray));
console.log(sampleArray, tailImmutable(sampleArray));

// -- Definición --
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

// *** PARTIAL ***************

// Convierte en opcionales las propiedades de una interfaz, en la práctica esto permite usar
// implementaciones parciales de un tipo o interfaz:

// -- Caso Base --
interface Person {
  name: string;
  age: number;
}

type PartialPerson = Partial<Person>;

// -- Caso Práctico --
const createState = <T extends object>(initialState: T) => {
  let state: T = initialState;

  return {
    setState: (partialState: Partial<T>): T => (state = { ...state, ...partialState }),
  };
};

const { setState } = createState({
  username: "b4dc4t",
  avatar: "cat.png",
  posts: 18,
  premium: false,
});

console.log(setState({ posts: 19, premium: true }));

// -- Definición --
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

// *** REQUIRED ***************

// La contraparte de Partial, convierte en requeridas las propiedades de una interfaz:

// -- Caso Base --
interface Coord {
  x: number;
  y: number;
  z?: number;
}

type Coord3D = Required<Coord>;

// -- Caso Práctico 1  --
const c3d: Coord3D = {
  // TS: Property 'z' is missing
  x: 3,
  y: 0,
  // z: 5,
};

// -- Caso Práctico 2  --
class Point3D {
  private coord: Required<Coord>;
  constructor(coord: Coord) {
    this.coord = {
      ...coord,
      z: coord.z || 0,
    };
  }
  getZ() {
    return this.coord.z;
  }
}

const p3d = new Point3D({ x: 1, y: 1 });
console.log(p3d.getZ());

// -- Definición --
type MyRequired<T> = {
  [P in keyof T]-?: T[P];
};

// *** EXCLUDE & EXTRACT ***************

// Utilidades para excluir/extraer elementos comunes en dos uniones.
// EXCLUDE: excluye de la primera unión los tipos que tiene en común con la segunda.
// Por tanto calcula la diferencia matemática.
// EXTRACT: extrae de la primera unión los tipos que tiene en común con lasegunda.
// Por tanto calcula la intersección matemática.

// -- Caso Base --
type WeekDay = "lun" | "mar" | "mie" | "jue" | "vie" | "sab" | "dom";
type WorkDay = Exclude<WeekDay, "sab" | "dom">;
type Weekend = Extract<WeekDay, "sab" | "dom" | "x">;

// -- Caso Práctico --
// Podriamos definir:
type Diff<A extends object = {}, B extends object = {}> = {
  [P in Exclude<keyof A, keyof B>]: A[P];
};
type Common<A extends object = {}, B extends object = {}> = {
  [P in Extract<keyof A, keyof B>]: A[P] | B[P];
};

// Y ponerlo a prueba con:
interface UserDetails {
  name: string;
  id: string;
  age: number;
  phone: number;
  married: boolean;
}

interface UserID {
  name: string;
  id: number;
}
type UserDiff = Diff<UserDetails, UserID>; // Check intellisense!
type UserCommon = Common<UserDetails, UserID>; // Check intellisense!

// Ejemplo de implementación en JS:

// Implementación más compatible
const calculateCommon = <A extends object, B extends object>(a: A, b: B): Common<A, B> => {
  const result = { ...a };
  for (const key in a) {
    if (a.hasOwnProperty(key) && !b.hasOwnProperty(key)) delete result[key];
  }
  return result;
};

// Implementación más elegante
/*
const calculateCommon2 = <A extends object, B extends object>(a: A, b: B): Common<A, B> =>
  Object.fromEntries(
    Object.entries(a).filter(([prop]) => b.hasOwnProperty(prop))
  ) as Common<A, B>;
*/

const userId: UserID = {
  name: "Javier",
  id: 324374,
};
const userDetails: UserDetails = {
  name: "Javier",
  id: "324374",
  age: 36,
  phone: 900900900,
  married: true,
};

const userCommon = calculateCommon(userId, userDetails);
console.log(userCommon);
// userCommon. // Check intellisense!

// -- Definición --
type MyExclude<T, U> = T extends U ? never : T;
type MyExtract<T, U> = T extends U ? T : never;

// -- Propuesta --
// ¿Podríais hacer un DiffSymetrical? Es decir, que tome las propiedades de A que no tiene B pero
// también las propiedades de B que no tiene A.

/*
type DiffSym<A extends object = {}, B extends object = {}> = {
  [P in Exclude<keyof A, keyof B> | Exclude<keyof B, keyof A>]: P extends keyof A ? A[P]
  : P extends keyof B ? B[P] : never;
};
*/

// *** PICK & OMIT ***************

// PICK nos permite generar un sub-interfaz, a partir de un interfaz ya existente, escogiendo las
// propiedades que queremos del original y tipándolas de igual forma. En definitiva, extrae un
// subconjunto de propiedades (y sus tipos) de una interfaz para generar otra distinta.

// OMIT es el opuesto de PICK, nos permite generar un interfaz a partir de otro pero en este caso
// eliminando las propiedades que no deseamos. Es decir, genera una nueva interfaz excluyendo
// propiedades de la original.

// -- Caso Base --
interface EmployeeSummary {
  name: string;
  id: string;
  age: number;
  phone: number;
  married?: boolean; // Now we can safely use optionals.
}
type EmployeeID = Pick<EmployeeSummary, "id" | "name">; // Check intellisense!
type EmployeeDetails = Omit<EmployeeSummary, keyof EmployeeID>; // Check intellisense!

// También podríamos haber redefinido los Diff y Common anteriores como:
type ObjectDiff<A extends object, B extends object> = Omit<A, Extract<keyof A, keyof B>>;
type ObjectCommon<A extends object, B extends object> = Pick<A, Extract<keyof A, keyof B>>;

type EmployeeCredentials = ObjectCommon<EmployeeSummary, EmployeeID>;
type EmployeeInfo = ObjectDiff<EmployeeSummary, EmployeeID>;

// -- Caso Práctico --

// Versión más espartana.
const omit = <T extends object, K extends keyof T>(o: T, ...keys: K[]): Omit<T, K> => {
  const result = { ...o };
  keys.forEach((key) => delete result[key]);
  return result;
};

// Versión más funcional.
const omit2 = <T extends object, K extends keyof T>(o: T, ...keys: K[]): Omit<T, K> =>
  Object.fromEntries(Object.entries(o).filter(([key]) => !keys.includes(key as K))) as Omit<T, K>;

const sampleObj = { a: "A", b: "B", c: "C" };
const onlyC = omit(sampleObj, "a", "b");
console.log(onlyC);
// onlyC. // Check intellisense!

// -- Definición --
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

// *** RECORD ***************

// Es un tipo bastante útil para armar objetos desde cero a partir de un conjunto de claves
// definidas a las que asignamos un tipado concreto.

// -- Caso Base --
type Sizes = "small" | "medium" | "large";
type EurSizes = Record<Sizes, string>;
type UkSizes = Record<Sizes, number>;

const eurSizes: EurSizes = { small: "s", medium: "m", large: "l" };
const ukSizes: UkSizes = { small: 8, medium: 10, large: 12 };

// -- Caso Práctico --
// Ejemplo más elaborado donde vamos a usar Record para transformar una misma interfaz de
// distintas formas.
interface Inventoriable {
  id: number;
  name: string;
}
type InventoryByName<T extends Inventoriable> = Record<T["name"], Omit<T, "name">>;
type InventoryById<T extends Inventoriable> = Record<T["id"], Omit<T, "id">>;

const pivotInventory = <T extends Inventoriable>(list: InventoryByName<T>): InventoryById<T> => {
  return Object.entries<Omit<Inventoriable, "name">>(list).reduce((result, [name, product]) => {
    result[product.id] = { name, ...omit(product, "id") };
    return result;
  }, {} as InventoryById<T>);
};

interface Product extends Inventoriable {
  stock?: boolean;
}

const productsByName = {
  arroz: { id: 7, stock: false },
  papas: { id: 6, stock: true },
  jamon: { id: 3, stock: true },
};

const productsById = pivotInventory<Product>(productsByName);

console.log(productsById);
// productsById[7]. //Check intellisense!

// -- Definición --
type MyRecord<K extends keyof any, T> = {
  [P in K]: T;
};

// *** NON NULLABLE ***************

// NonNullable genera un tipo nuevo a partir de otro, previniendo que su valor pueda ser
// null o undefined.

// -- Caso Base --
type Choice = "left" | "right" | "center" | undefined | null;
type ValidChoice = NonNullable<Choice>;

// -- Caso Práctico --
// Tiene sentido en un entorno estricto (strictNullChecks) de lo contrario el compilador siempre
// permitirá valores a null/undefined para cualquier tipo.

// Un 'draft' puede ser usado tanto en un formulario de edición como en uno de inserción
interface BookingDraft {
  id: number | null; // 'number' para edición, 'null' para inserción
  price: number;
  room: "standard" | "superior";
  prepaid: boolean;
}

// Declaramos un helper que nos permita seleccionar qué propiedades no pueden ser 'null'
type NonNullableKeys<O, K extends keyof O> = {
  [P in keyof O]: P extends K ? NonNullable<O[P]> : O[P];
};

// Definimos la interfaz que la API REST nos devuelve. Este sí debe tener obligatoriamente
// 'id' no nulo
type Booking = NonNullableKeys<BookingDraft, "id">;

// Ejemplo de API,
const bookings: Booking[] = [
  { id: 31, prepaid: false, price: 80, room: "standard" },
  { id: 16, prepaid: true, price: 115, room: "standard" },
  { id: 25, prepaid: true, price: 250, room: "superior" },
];
const bookingAPI = {
  async getBooking(id: number): Promise<Booking | null> {
    return bookings.find((b) => b.id === id) || null;
  },
};

// Ejemplo intellisense
const foo: Booking = {
  id: null, // Error: Type 'null' is not assignable to type 'number'
  prepaid: false,
  price: 31,
  room: "superior",
};

// -- Definición --
type MyNonNullable<T> = T extends null | undefined ? never : T;

// *** FUNCTION HELPERS ***************

// RETURN TYPE: Permite inferir el tipo de dato que devuelve una función.
// PARAMETERS: Permite inferir el tipado de los argumentos de entrada de una función en
// formato tupla.

// -- Caso Base --
const addTimestamp = (user: UserID, useLocale: boolean = false) => ({
  ...user,
  timestamp: useLocale ? Date().toLocaleString() : Date.now(),
});

type UserWithTimestamp = ReturnType<typeof addTimestamp>; // Check intellisense!
type Params = Parameters<typeof addTimestamp>; // Check intellisense!

// -- Caso Práctico --
type GenericFunction = (...args: any[]) => any;
const delay =
  <F extends GenericFunction>(f: F, t: number) =>
  (...args: Parameters<F>): Promise<ReturnType<F>> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(f(...args)), t);
    });
  };

const shout = (text: string) => `${text.toUpperCase()}!!!`;
console.log(shout("pim pam"));

const delayedShout = delay(shout, 1000); // Check intellisense over delayedShout
delayedShout("toma lacasitos").then((message) => console.log(message));
