# NavigatorOnLine interface

Esta interfaz está implementada por el objeto global **navigator**.

## Interfaz

**NavigatorOnLine.onLine** Read only: Devuelve un Boolean indicando si el navegador está trabajando online.

## Ejemplo

```javascript
this.addEventListener('fetch', function(event) {
  if(!navigator.onLine) {
    event.respondWith(new Response('<h1>Estás sin conexión</h1>', {headers: { 'Content-Type': 'text/html'}}));
  } else {
    event.respondWith(fetch(event.request));
  }
});
```

El listener de *fetch* SIEMPRE debe llamar a event.respondWith().

event.respondWith necesita un objeto Response o un objeto Promise que se resuelva con un objeto Response.

## Cacheo inicial

```javascript
this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/sw-test/index.html',
        '/sw-test/style.css',
        '/sw-test/app.js',
        '/sw-test/image-list.js',
        '/sw-test/star-wars-logo.jpg',
        '/sw-test/gallery/',
        '/sw-test/gallery/bountyHunters.jpg',
        '/sw-test/gallery/myLittleVader.jpg',
        '/sw-test/gallery/snowTroopers.jpg'
      ]);
    })
  );
});
```

El listener de *install* SIEMPRE debe llamar a event.waitUntil().

waitUntil necesita una promesa. Cuando se resuelva la promesa el service worker terminará su proceso de instalación.

## Responder con un recurso cacheado

```javascript
this.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
  );
});
```

## Si no está en la cache, hacer la petición a la red

```javascript
this.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
```

## Si no está en la caché, cacheamos la respuesta de la red

```javascript
this.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
        return caches.open('v1').then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });  
      });
    })
  );
});
```

## Si no está en la caché, y no tenemos red, devolvemos algo

```javascript
this.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
        caches.open('v1').then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }).catch(function() {
      return new Response('<html><body>Sorry for de inconvenience</body></html>');
    })
  );
});
```

## Actualizar nuestro service worker

Si hacemos algún cambio en nuestra web y el service worker había cacheado las peticiones, los usuarios nunca verán la nueva versión de la web.

Solución: cada vez que haya una versión nueva de la web, debe haber una versión nueva del service worker que al instalarse, re-creará la caché.

```javascript
this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v2').then(function(cache) {
      return cache.addAll([
        '/sw-test/',
        '/sw-test/index.html',
        '/sw-test/style.css',
        '/sw-test/app.js',
        '/sw-test/image-list.js',
        //...
      ]);
    })
  );
});
```

El nuevo Service Worker crea una nueva cache. De esta forma, no interfiere en el trabajo que esté todavía realizando el service worker anterior.

## Eliminar la cache del service worker anterior

Cuando el nuevo service worker por fin puede activarse, se dispara el evento **activate** que podemos aprovechar para que elimine la cache del service worker anterior.

```javascript
this.addEventListener('activate', function(event) {
  var cacheWhitelist = ['v2'];

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
```

## Enlaces de interés

https://developer.mozilla.org/es/docs/Web/API/Navigator

https://developer.mozilla.org/es/docs/Web/API/NavigatorOnLine

https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

https://developer.mozilla.org/en-US/docs/Web/API/Cache