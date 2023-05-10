///-- INTERFACES **********************************************************************************

// Una interfaz no es más que un contrato especificando las propiedades que un objeto debe tener.
// Uno de los objetivos más básicos que tienen las interfaces es que nos permiten dar nombres a
// las estructuras y por lo tanto podemos reusarlos.

interface Geoposition {
  latitude: number;
  longitude: number;
}

const pos: Geoposition = {
  latitude: 3.3112,
  longitude: 5.1123,
};

// En caso de no especificar todas las propiedades lanzará un error de compilación
const pos1: Geoposition = {
  //  ^^^^ [ts] Type '{ latitude: number; }' is not assignable to type 'Geoposition'.
  latitude: 3.3112,
};

// También si especificamos propiedades por exceso, lanzaría un error.
const pos2: Geoposition = {
  latitude: 3.3112,
  longitude: 5.1123,
  altitude: 325,
};

// Podemos ANIDAR, es decir, utilizar interfaces como tipos dentro de otras inferfaces:
interface Address {
  zipCode: number;
  city: string;
  street: string;
}

interface Citizen {
  name: string;
  address: Address;
}

const citizen: Citizen = {
  address: {
    city: "Málaga",
    street: "Héroes de Sostoa",
    zipCode: 29002,
  },
  name: "Javier",
};

// *** Propiedades Opcionales
// TypeScript soporta propiedades opcionales mediante el operador [?]. Una propiedad opcional no es
// más que aquella cuyo valor puede ser ser definido o no (en este segundo caso sería undefined).

// Podemos definir propiedades opcionales de una interfaz
interface Book {
  isbn: number;
  author?: string;
}
const book1: Book = { isbn: 764589621 };
console.log(book1.author); // undefined
const book2: Book = { isbn: 854632187, author: "Rolan" };
console.log(book2.author); // Rolan

// *** Propiedades Read-Only
// Podemos forzar a que ciertas propiedades sean de sólo lectura. Para ello usaremos el operador
// "readonly" delante de la propiedad. Con esto conseguimos establecer el valor de la propiedad a
// la hora de crear el objeto denegando la posibilidad (a nivel de compilación) de reasignar
// dicha propiedad:
interface Product {
  readonly id: number;
  stock: number;
}
const product: Product = { id: 998, stock: 0 };
product.stock = 20;
product.id = 339; // [ts] Cannot assign to 'id' because it is a constant or a 'read-only' property

// Extendiendo interfaces
interface MyEvent {
  type: string;
}

interface MyKeyboardEvent extends MyEvent {
  key: string;
}

const keyboardEvent: MyKeyboardEvent = {
  key: "shift",
  type: "keyboard event",
};

// Podemos extender de varias interfaces a la vez, esto es posible ya que las interfaces sólo
// especifican las propiedades que un objeto debe de tener (a pesar de usar extends no tiene
// por qué estar relacionado con la herencia prototípica)

interface Soldier {
  swordType: string;
}

interface Ranger {
  ammoType: string;
  totalAmmo: number;
}

interface Ninja extends Soldier, Ranger {
  smokeBombs: number;
}

const ninja: Ninja = {
  swordType: "katana",
  ammoType: "shuriken",
  totalAmmo: 10,
  smokeBombs: 3,
};

// *** Duck typing
// TypeScript no tan estricto a la hora de tipar y no tiene en cuenta semánticamente los tipos,
// sino que sigue una comparación estructural. Vemos el siguiente ejemplo:
interface User {
  id: number;
  name: string;
}

const julia: User = {
  id: 31,
  name: "Julia",
};

interface Dog {
  id: number;
  name: string;
}

const laika: Dog = {
  id: 119,
  name: "Laika",
};

// Si declaramos la siguiente función para mostrar el nombre de un usuario:
function printUserName(user: User): void {
  console.log(user.name);
}

// Vemos que no tenemos problemas a la hora de usarlo con un objeto de tipo User
printUserName(julia);

// Pero tampoco hay problemas a la hora de utilizarlo con un objeto de tipo Dog
printUserName(laika);

// Esto es, por lo que decimos, User y Dog comparten la misma estructura, si intentamos usarlo con
// otra interfaz que no comparta sus mismos atributos dará un error de tipos
interface Cat {
  name: string;
}

const garfield: Cat = { name: "Garfield" };
printUserName(garfield);
// Garfield no tiene "id: number" por lo que no compatible con el tipo que necesita

// Como vemos si la interfaz no tiene las propiedades requeridas no podrá ser usado por la función.
// Sin embargo esto no significa que la interfaz pueda tener más propiedades

interface Fish {
  id: number;
  name: string;
  colors: string[];
}

const bob: Fish = { id: 319, name: "Bob", colors: ["white", "yellow"] };
printUserName(bob);
// bob al tener "id: number" y "name: string" es compatible, pese a tener más propiedades de
// las requeridas

// Es decir, actualmente la función printUserName necesita un objeto que estructuralmente tenga
// como mínimo las dos propiedades de User,
