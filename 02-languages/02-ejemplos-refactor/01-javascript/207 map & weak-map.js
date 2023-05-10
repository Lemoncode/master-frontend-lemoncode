///-- MAP ****************************************************************************************

// ES6 introdujo dos nuevos constructores: Map y WeakMap
// Ambos nos permiten crear un diccionario de clave-valor, como un objeto literal:

// *** Similitudes

const obj = {};
const map = new Map();

obj.val = 31;
map.set("val", 31);

console.log(obj.val); // 31;
console.log(map.get("val")); // 31;

// *** Diferencias

// Hay una diferencia importante entre Map y un objeto literal y es que una instancia de Map puede
// utilizar no sólo strings como claves:
const map = new Map();
map.set(3.1415, "número π");

console.log(map.get(3.1415)); // "número π"
console.log(map.get("3.1415")); // undefined

const id = x => x;
const user = { name: "Aaron" };
map.set(id, "función identidad");
map.set(user, { settings: { theme: "dark" } });

console.log(map.get(id)); // "función identidad"
console.log(map.get(user)); // { settings: { theme: "dark" } }

// PREGUNTA, ¿que nos daría la siguiente línea?
console.log(map.get({name: "Aaron"})); // undefined
console.log(map.size); // 3;
console.log(map.has(user)); // true

// Otra maravillosa características de las instancias Map es que son iterables ("array like"):
map.forEach((value, key) => {
  console.log("clave", key, "asociada con", value);
});

for(let [key, value] of map) {

}
// "clave" 3.1415 "asociada con" "número π"
// "clave" (x) => x "asociada con" "función identidad"
// "clave" { name: "Aaron" } "asociada con" { settings: { … } }

map.delete(id);
map.get(id); // undefined


///-- WEAKMAP ************************************************************************************

/*
WeakMap es una variante de Map consistente en un diccionario que me permite asociar objetos 
(instancias en memoria) a lo que sea, de modo que si dichos objetos son eliminados de la memoria,
la entrada del diccionario se limpia automáticamente.

Por tanto, tienen las siguientes diferencias con respecto a un Map:
1. Sólo puede utilizar objetos como keys.
2. Elimina automáticamente las keys (objetos) junto a los values que ya no se necesiten tener en
   memoria tras ejecutarse el recolector de basura.
3. Debido al punto 2, no podemos tener acceso ni a "size", "keys()" o "values()" por lo que no son
   iterables y sólo podemos utilizarlos métodos "get()", "set()", "has()" y "delete()".
*/

const weak = new WeakMap();

weak.set();
