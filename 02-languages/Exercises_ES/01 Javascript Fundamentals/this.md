# This

¿Cual es la salida de los logs en el siguiente código? Intenta razonar, no te limites a ejecutar la solución.

```javascript
var surname = "Pérez";
var person = {
  name: "Juan",
  surname: "González",
  wife: {
    name: "Ana",
    surname: "Jiménez",
    getSurname: function() {
      return this.surname;
    },
  },
};

console.log(person.wife.getSurname());
var surnameFunction = person.wife.getSurname;
console.log(surnameFunction());
console.log(surnameFunction.call(person));
```
