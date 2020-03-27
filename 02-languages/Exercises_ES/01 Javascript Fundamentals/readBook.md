# Read Book

Crea una función `isBookRead` que reciba una lista de libros y un título y devuelva si se ha leído o no el libro.
Un libro es un objeto con `title` como string y `isRead` como booleano. En caso de no existir el libro devolver false

**TIP**: Existe un método de los Arrays que te ayudará a buscar según un patrón:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype

```javascript
function isBookRead(books, titleToSearch) {
  // Implementation here
}

// Ejemplo:
var books = [
  { title: "Harry Potter y la piedra filosofal", isRead: true },
  { title: "Canción de hielo y fuego", isRead: false },
  { title: "Devastación", isRead: true },
];

console.log(isBookRead(books, "Devastación")); // true
console.log(isBookRead(books, "Canción de hielo y fuego")); // false
console.log(isBookRead(books, "Los Pilares de la Tierra")); // false
```
