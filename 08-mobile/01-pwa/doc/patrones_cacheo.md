# Patrones de cacheo

## Network only

- No se cachea ningún recurso
- Siempre se buscan los recursos en la red
- Si la red falla, la petición falla

Resuestas a peticiones POST, PUT, DELETE...

```javascript
event.respondWith(
	fetch(event.request)
);
```

## Cache only

- Siempre se busca el recurso en la cache
- Si no está en la caché, no se sirve el recurso

Este patrón se puede utilizar, por ejemplo, en situaciones de nivel crítico de batería.

Battery Status API: https://w3c.github.io/battery/

```javascript
event.respondWith(
	caches.match(event.request)
);
```

## Cache First

- Se busca el recurso en la cache
- Si no está en la cache, entonces se busca en la red

Este patrón se puede utilizar en situaciones donde el contenido raramente cambie (archivos css, archivos javascript, datos estáticos...)

```javascript
event.respondWith( function(){
    caches.match(event.request)
    .then( cacheResponse => {
        if(cacheResponse) {
            return cacheResponse;
        } else {
            return fetch(event.request).then( fetchResponse => {
                        return caches.open('v1').then( cache => {
                                        caches.put(event.request, fetchResponse.clone()).then( () => {
                                                        return fetchResponse;
                                                      })
                                        })
                    })
        }
    });
});
```

## Network First

- Se busca el recurso en la red y se cachea.
- Solamente cuando la red falla, se busca el recurso en la cache

Este patrón se puede utilizar cuando queremos ofrecer al usuario siempre el contenido más actualizado posible, pero que en caso de que se quede sin cobertura, pueda seguir utilizando la aplicación.

```javascript
event.respondWith( function() {
    fetch(event.request)
    .then( fetchResponse => {
        return caches.open('v1').then( cache => {
            if(!fetchResponse.ok)
                    return cache.match(event.request)
                else {
                    cache.put(event.request, fetchResponse.clone())
                    return fetchResponse;
                }
            })
    })
});
```

## Fastest

- Se busca el recurso tanto en la cache como en la red.
- Se sirve el recurso que se encuentre primero.

Aunque la mayoría de las veces la cache contestará antes, se puede aprovechar la petición a la red para cachear la respuesta para la siguiente vez.

```javascript
event.respondWith( function() {
    var promises = [ caches.match(event.request), fetch(event.request) ];

    return new Promise( (resolve, reject) => {
        promises.map( p => Promise.resolve(promise));
        promises.forEach( p => p.then(resolve));
        promises.reduce( (a,b) => a.catch( () => b))
        .catch( () => reject(new Error('Ambas promesas han fallado')))

    })
});
```

- Workbox: https://developers.google.com/web/tools/workbox/
- Workbox: Estrategias preconfiguradas: https://developers.google.com/web/tools/workbox/guides/route-requests#handling_a_route_with_a_workbox_strategy
- Workbox: Ejemplos: https://developers.google.com/web/tools/workbox/guides/common-recipes