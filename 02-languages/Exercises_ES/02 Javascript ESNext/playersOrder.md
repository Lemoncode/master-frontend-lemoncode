# Players Order

En una gran cantidad de juegos el sistema de turnos es sencillo, una vez el jugador actual ha consumido su turno, pasa al final de la cola y le toca al siguiente. Dada una lista inicial de jugadores, implementa una función que devuelva la nueva lista de jugadores, en el orden correcto, después de X turnos.

**TIP**: Aunque se puede resolver con el operador `%`, intenta idear una solución usando spread/rest y destructuring.

```javascript
const getPlayersOrder = (players, turns) => {
  /* Implementation here */
};

// Un ejemplo:
const newOrderIn2Turns = getPlayersOrder(["Ana", "Juan", "Pablo", "Lucia"], 2);
console.log(newOrderIn2Turns); // ["Pablo", "Lucia", "Ana", "Juan"]
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
