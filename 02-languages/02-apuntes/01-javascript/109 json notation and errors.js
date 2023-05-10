///-- NOTACIÓN JSON ******************************************************************************

// La notación JSON consiste en un objeto formado por pares de clave : valor.
// - Las claves obligatoriamente deben ser strings con comillas dobles.
// - Los valores deben ser strings, números, booleanos, null, objetos y arrays.
// - No puede tener comentarios.
// - No puede tener "trailing commas" a menos que sea para dar lugar a un siguiente elemento.

/*
{
  "product": {
    "id": 13,
    "name": "Note 9",
    "type": "phone"
  }
};
*/

// Podemos serializar un objeto en formato JSON utilizando JSON.stringify

const product = {
  id: 13,
  name: "Note 9",
  type: "phone",
};

const jsonProduct = JSON.stringify(product);

console.log(jsonProduct); // {"id":13,"name":"Note 9","type":"phone"}
console.log(JSON.stringify(product, null, 4)); // Stringify con parámetros para formatear.
/*
{
    "product": {
        "id": 13,
        "name": "Note 9",
        "type": "phone"
    }
}
*/

// Podemos convertir de vuelta un string en formato JSON a objeto utilizando JSON.parse
const parsedProduct = JSON.parse(jsonProduct);
console.log(parsedProduct); // {id: 13, name: "Note 9", type:"phone"}

// Si el objeto está malformado lanzará un error:
JSON.parse('{"id":13,"name":"Note 9",`type`:"phone"}'); // Uncaught SyntaxError: Unexpected token ` 
//               backticks ~~~~~~~~~~^~~~~^                                      in JSON at position 25


///-- ERRORES ************************************************************************************

// Para controlar los errores lanzados utilizamos el bloque try-catch-finally
const config = '{"port": 3002}';
let port;
try {
  // Bloque que puede lanzar errores
  let parsedConfig = JSON.parse(config);
  port = parsedConfig.port;
} catch (err) {
  // Bloque donde actuamos si hay errores
  console.log("Catched error!!!", err);
  port = 3000;
} finally {
  // Bloque que queremos ejecutar tanto si hay errores como si no
  console.log('Port set up to', port);
}

// Podemos diferenciar entre tipos de errores basándonos en el tipo de instancia del error:

const doOperation = () => {
  123.hello; // SyntaxError
  return window(); // TypeError
  return a * 5; // ReferenceError
  return Array(-5); // RangeError
}

try {
  doOperation();
} catch (err) {
  if (err instanceof ReferenceError) console.log("referenceerror catched");
  else if (err instanceof TypeError) console.log("typeerror catched");
  else if (err instanceof RangeError) console.log("rangeerror catched");
  else console.log("another error");
}


// Podemos crear objetos de tipo error:
const myErr = new Error('Not found');

// Dichos errores podemos lanzarlos utilizando el operador "throw"
throw myErr;

// ⚠ No es buena práctica el trabajo con errores ya que una mala gestión de los mismos puede
// provocar una salida abrupta del programa. Sólo deberían de ser usados en secciones que manejen
// control de errores, por ejemplo Promises.
