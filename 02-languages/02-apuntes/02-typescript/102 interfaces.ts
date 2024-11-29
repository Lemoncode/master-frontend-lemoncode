///-- INTERFACES **********************************************************************************

// Una interfaz no es más que un contrato especificando las propiedades de un objeto: cómo deben
// llamarse dichas propiedades y de que tipo deben ser. El objetivo de los interfaces, además de 
// tipar objetos, es darle nombre a las estructuras y poder reutilizarlos.

interface Coord {
  lat: number;
  lon: number;
}

const pos: Coord = {
  lat: 3.3112,
  lon: 5.1123,
};

// En caso de no especificar todas las propiedades lanzará un error de compilación
const pos: Coord = {
  //  ^^^^ [ts] Property 'lon' is missing in type '{ lat: number; }'.
  lat: 3.3112,
};

// También si especificamos propiedades por exceso, lanzaría un error.
const pos: Coord = {
  lat: 3.3112,
  lon: 5.1123,
  alt: 325, // [ts] Object literal may only specify known properties, and 'alt' does not exist in
            // type 'Coord'
};

// *** Modificadores: optional & readonly *********************************************************

// TypeScript soporta propiedades opcionales mediante el operador [?]. Una propiedad opcional es 
// aquella que puede ser declarada (y por tanto tendrá un valor asignado) o no. Si no la declaramos,
// su valor sería undefined.

// Además, podemos forzar a que ciertas propiedades sean de sólo lectura. Para ello usaremos el 
// operador "readonly" delante de la propiedad. Con esto conseguimos establecer el valor de la 
// propiedad a la hora de crear el objeto denegando la posibilidad (a nivel de compilación) de 
// reasignar dicha propiedad.

interface Coord {
  readonly lat: number;
  readonly lon: number;
  alt?: number;
}

const pos: Coord = {
  lat: 3.3112,
  lon: 5.1123,
  // alt: 350, // Optional
};

pos.lat = 3.4567; // [ts] Cannot assign to 'lat' because it is a read-only property


// *** Anidamiento y extensión de interfaces ******************************************************

// Podemos anidar interfaces dentro de otros. Esta es una forma jerárquica de componer interfaces,
// por ejemplo:

interface Address {
  street: string;
  zip: number;
  city: string;
}

interface Coord {
  lat: number;
  lon: number;
  address: Address;
}

const place: Coord = {
  lat: 3.3112,
  lon: 5.1123,
  address: {
    street: "Héroes de Sostoa",
    zip: 29002,
    city: "Málaga",
  },
};

// También es frecuente utilizar la extensión de interfaces como método de composición. Es decir, 
// una interfaz puede extender de otra para combinar propiedades:

interface Address {
  street: string;
  zip: number;
  city: string;
}

interface Coord {
  lat: number;
  lon: number;
}

interface Place extends Coord {
  address: Address;
}

const place: Place = {
  lat: 3.3112,
  lon: 5.1123,
  address: {
    street: "Héroes de Sostoa",
    zip: 29002,
    city: "Málaga",
  },
};

// Incluso sería posible la extensión múltiple:
interface Place extends Coord, Address {}

const place: Place = {
  lat: 3.3112,
  lon: 5.1123,
  street: "Héroes de Sostoa",
  zip: 29002,
  city: "Málaga",
};

// *** Duck typing ********************************************************************************

// TypeScript no tan estricto a la hora de tipar como pudiera parecer a priori y no ejecuta un 
// chequeo semántico de los tipos sino que hace una comparación estructural. 

// Es decir, al trabajar con interfaces, TypeScript NO comprueba que un objeto o instancia es de 
// tipo "X" (comprobación semántica) sino que comprueba que su estructura es compatible con el 
// contrato que indica el tipo "X" (comprobación estructural). 

// Como curiosidad, el nombre de duck typing viene de un antiguo dicho: "Si camina como un pato, 
// nada como un pato y hace cuack, entonces es que probablemente sea un pato".

// Vemos el siguiente ejemplo:

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

// ¿Cómo es posible que pueda pasar como argumento 'user' un objeto de tipo Dog? Porque, aun siendo 
// objetos de tipos diferentes, los interfaces User y Dog comparten la misma estructura. 
// Y TypeScript no hace un chequeo semántico, es decir, no comprueba que el argumento user tenga que 
// estar forzosamente tipado con el interface User sino que comprueba que su estructura encaja con 
// lo especificado en dicho interface.

// Si intentamos usarlo con otra interfaz que no comparta sus mismos atributos dará un error 
// de tipos:

interface Cat {
  name: string;
}

const garfield: Cat = { name: "Garfield" };

// Garfield no tiene "id: number" por lo que no es compatible con el tipo esperado para
// el argumento user
printUserName(garfield);

// Como vemos, si la interfaz no tiene, como mínimo, las propiedades requeridas no podrá ser usada 
// como argumento de la función.
// Sin embargo, si dispone de las propiedades necesarias cómo mínimo, aunque tenga más propiedades, 
// si que podría validarse debido al duck typing:

interface Cat {
  id: number;
  name: string;
  color: string;
}

const garfield: Cat = { id: 43, name: "Garfield", color: "orange" };

printUserName(garfield); // OK!