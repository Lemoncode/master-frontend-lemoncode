///-- SET ****************************************************************************************

// ES6 introduce otros dos nuevos constructores: Set y WeakSet
// Ambos nos permiten crear colecciones de elementos, del mismo modo que hacemos con los Arrays:

// *** Similitudes

const list = [];
const set = new Set();

list.push("hello");
set.add("hello");

console.log(list); // ["hello"]
console.log(set); // Set(1) { "hello" }

// *** Diferencias

// Hay una diferencia importante entre Array y Set y es que los elementos de un Set son únicos, 
// es decir, por muchas veces que intentemos insertar el mismo elemento sólo será insertado una
// sola vez:
const set = new Set();
set.add("Android");
set.add("iOS");
const otherOS = { name: "Debian" };
set.add(otherOS);

console.log(set); // Set(3) { "Android", "iOS", {name: "Debian"} }

set.add("Android");
set.add("iOS");
set.add("Windows Phone");
set.add(otherOS);
console.log(set); // Set(4) { "Android", "iOS", {name: "Debian"} "Windows Phone" }

// Pero ojo, mismo elemento = misma ref. Si cambiamos su ref...voilá:
set.add({name: "ChromeOS"});
set.add({name: "ChromeOS"}); // Distinta referencia
console.log(set);
// Set(6) { "Android", "iOS", {name: "Debian"}, "Windows Phone", {name: "ChromeOS"}, {name: "ChromeOS"} }

// Otros métodos del set son:
console.log(set.has("Android")); // true
console.log(set.delete("Windows")); // false
console.log(set.delete("Windows Phone")); // true

// Al igual que los arrays los elementos Set son iterables
const set = new Set(["lorem", "ipsum", "dolor", "sit", "amet"]);

set.forEach((element) => {
  console.log(element); // "lorem"
});                     // "ipsum"
                        // "dolor"
                        // "sit"
                        // "amet"
for (let element of set) console.log(element);


///-- WEAKSET *************************************************************************************

/*
WeakSet es similar a Set pero tiene ciertas diferencias:
1. Sólo puede contener objetos. No están permitidos tipos primitivos.
2. Elimina automáticamente aquellos elementos que son candidatos a ser borrados por el recolector
   de basura.
3. No son iterables, por lo que tampoco tenemos acceso a "keys()" ni "size".
*/