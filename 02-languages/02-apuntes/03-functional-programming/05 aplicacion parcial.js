// APLICACIÓN PARCIAL **********************************************************

// La aplicación parcial consiste en crear funciones basadas en otras donde asignamos valores a algunos de sus argumentos
// Para ello nos basamos en el método "bind" de las funciones

const createMessage = (sender, adjective, noun) =>
  `Hey!, ${sender} just want to tell you that you're a ${adjective} ${noun}!!`;

const messageFromJoaquin = createMessage.bind(null, "Joaquin");
console.log(messageFromJoaquin("cool", "mate"));

const braveMessageFromAna = createMessage.bind(null, "Ana", "brave");
console.log(braveMessageFromAna("knight"));

// Hay diferencias entre la aplicación parcial y el currying:
// 1. La aplicación parcial no necesita cambiar estructuralmente la función original a secuencia de funciones
// con un sólo argumento. Ejemplo:
const createMessageCurried = sender => adjective => noun =>
  `Hey!, ${sender} just want to tell you that you're a ${adjective} ${noun}!!`;

console.log(createMessageCurried("Ana")("brave")("knight"));

// 2. La función resultante de la aplicación parcial puede recibir más de un argumento o incluso ninguno dependiendo del
// número de argumentos con la que la configuremos. Las funciones currificadas son funciones cuyas funciones en secuencia
// reciben un sólo argumento, que es la salida de la función anterior (a excepción de la primera función, que puede
// recibir varias de entrada y producir una única salida). Ejemplo:
const createMessageBinary = (sender, adjective) => noun =>
  `Hey!, ${sender} just want to tell you that you're a ${adjective} ${noun}!!`;

console.log(createMessageBinary("Ana", "brave")("knight"));

// Conceptualmente las funciones devueltas de curry reciben un argumento. Aunque en JavaScript podemos tomarnos la
// libertad de rebatir ese argumento. Ejemplo:
const anotherCreateMessageBinary = (sender) => (adjective, noun) =>
  `Hey!, ${sender} just want to tell you that you're a ${adjective} ${noun}!!`;

console.log(anotherCreateMessageBinary("Ana")("brave", "knight"));

// El siguiente ejemplo muestra una función totalmente aplicada:
const getBraveKnightMessageFromAna = createMessage.bind(null, "Ana", "brave", "knight");
console.log(getBraveKnightMessageFromAna());

