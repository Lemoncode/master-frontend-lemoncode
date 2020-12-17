Configuración cero.

¿Es posible usar webpack en modo de configuración cero? Bueno, en teoría sí, sólo siguiendo algunas convenciones.

Zero config bundlers webpack, nos brinda la posibilidad de usar este paquete con configuración cero, sólo si sigues algunas convenciones no necesitarás crear un archivo de configuración.

Aunque esto suena genial, no funcionará para casos muy simples (sólo demostraciones o pruebas rápidas), por ejemplo, no se puede transpilar usando babel con Zero config.

Veamos en esta demostración cómo podemos ejecutar una muestra simple.


./package.json
{
  ...
  "scripts": {
+   "build": "webpack --mode development",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  ...
}
