# Curry Setter

En un formulario tenemos un objeto con los campos `name`, `surname` y `age` que representan un usuario. Crea una función `set` que reciba un objeto con los campos de usuario, el nombre de una propiedad y su valor y actualice la propiedad del objeto con el valor pasado como argumento.

El ejercicio debe cumplir la siguiente norma: la función debe ser pura, es decir, debe crear un nuevo objeto sin modificar el existente.

```javascript
const julia = { name: "Julia", surname: "Álvarez", age: 19 };
const updatedJulia = set(julia, "age", 25);

console.log(updatedJulia); // { name: 'Julia', surname: 'Álvarez', age: 25 }
console.log(julia); // { name: 'Julia', surname: 'Álvarez', age: 19 }
console.log(julia === updatedJulia); // false
```

## Opcional

Currifica dicha función para que permita crear funciones donde el argumento del nombre de la propiedad esté configurado previamente.
Es decir, modifica la función `set` para poder crear `setName`, `setSurname` y `setAge` que reciban sólo el objeto y el valor y sepan qué propiedad actualizar.

**TypeScript**: Además, si quieres, puedes extraer la firma de la interfaz sin ponerla en línea con la implementación.

```javascript
const setName = set(/* ... */);
const setSurName = set(/* ... */);
const setAge = set(/* ... */);

const julia = { name: "Julia", surname: "Álvarez", age: 19 };

console.log(setName(julia, "Ana")); // { name: 'Ana', surname: 'Álvarez', age: 19 };
console.log(setSurname(julia, "González")); // { name: 'Julia', surname: 'González', age: 19 };
console.log(setAge(julia, 25)); // { name: 'Julia', surname: 'Álvarez', age: 25 }
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
