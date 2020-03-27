# Califications

> **NOTA IMPORTANTE**: Realiza primero el ejercicio "Values".

Dada la calificación de alumnos de una clase en forma de objeto como el siguiente:

```javascript
const eso2o = {
  David: 8.25,
  Maria: 9.5,
  Jose: 6.75,
  Juan: 5.5,
  Blanca: 7.75,
  Carmen: 8,
};
```

Implementa una función que muestre la media de la clase de forma textual, es decir, siguiendo el sistema de calificación español:

- Matrícula de Honor = 10
- Sobresaliente = entre 9 y 10
- Notable = entre 7 y 9
- Bien = entre 6 y 7
- Suficiente = entre 5 y 6
- Insuficiente = entre 4 y 5
- Muy deficiente = por debajo de 4

```javascript
function printAverage(classResults) {
  // Implementation here.
}
```

**TIP**: Rompe en tantas funciones auxiliares como necesites.

**TIP**: Utiliza el ejercicio "values" para extraer los valores de un objeto. En `Array.prototype` también cuentas con otro método que podría resultarte útil para transformar un array a un único valor.
