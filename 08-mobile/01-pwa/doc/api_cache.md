# API Cache

Esta API no forma parte de los Service Workers

- Es un “Living Standard”
- Tiene soporte parecido a los Service Workers
- Cachea respuestas de peticiones
- No respeta las fechas de expiración de los headers

https://developer.mozilla.org/en-US/docs/Web/API/Cache

## Elementos de la API Cache

### CacheStorage

Lo tenemos disponible en la variable global *caches*.

- **open('cacheName')**: Devuelve una Promise que se resuelve con el objeto Cache que coincida con el cacheName pasado. Si no existe, se crea un objeto Cache nuevo con dicho identificador.
- **has('cacheName')**: Devuelve una Promise que se resuelve con *true* si existe un objeto con dicho nombre.
- **delete('cacheName')**: Devuelve una Promise que se resuelve con *true* si existe el objeto Cache indicado. Dicho objeto se elimina. La promesa resuelve con *false* si no existe el objeto.
- **keys()**: Devuelve una Promise que se resuelve con un array de strings correspondientes a todos los objetos Cache.
- **match(request)**: Comprueba si la Request es una clave en alguno de los objetos Cache de este CacheStorage y devuelve una Promise que resuelve con la respuesta asociada al objeto encontrado en la cache.

### Cache

El método caches.open() nos da acceso a un objeto *cache*, con los sigientes métodos:

- **match(request, options)**: Devuelve una Promise que resuelve con la respuesta asociada al primer match que encuentre en la cache.
- **matchAll(request, options)**: Devuelve una Promise que resuelve con un array con todas las respuestas que hagan match.
- **keys(request, options)**: Devuelve una Promise que resuelve con un array de *Cache keys*.
- **add(request)**: Equivale a fecth() + put()
- **addAll(requests)**: fetch() + put() para todas las peticiones del array.
- **put(request, response)**: Añade una entrada en la cache.
- **delete(request, options)**: Devuelve una Promise que resuelve a *true* si se encuentra el elemento y se elimina. Si el elemento no se encuentra, la promesa resuelve a *false*.