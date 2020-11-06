## Notificaciones Push - API Push

- Las notificaciones push interesantes son las que llegan a la aplicación desde un elemento externo
- El Service Worker de la aplicación es el encargado de recibirlas y de mostrarlas

Para que una aplicación recibá mensajes push, esta debe tener un service worker. Cuando el service worker esta activo, se puede suscribir usando PushManager.subscribe().

https://developer.mozilla.org/es/docs/Web/API/Push_API

Para poder recibir notificaciones push tenemos que implementar 3 fases
- Configurar Push
- Enviar el mensaje
- Recibir el mensaje y mostrar una notificación




Configurar Push - Paso 1

Nuestro servidor tiene que servir una página con un VAPID key con parte pública y privada
https://datatracker.ietf.org/doc/rfc8292/

https://web-push-codelab.glitch.me/

```js
const applicationServerPublicKey = '<Your Public Key>';
if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
}
``` 

Configurar Push - Paso 2

Ver si ya estamos suscritos

```js
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    if (isSubscribed) {
      console.log('User IS subscribed.');
      updateSubscriptionOnServer(subscription);
    } else {
      console.log('User is NOT subscribed.');
    }
  });
```

El objeto subscription tiene las propiedades siguientes:

```js
{
 “endpoint”: “https://fcm.googleapis.com/fcm/send”,
 “keys”: {
 “p256dh”: “.......”,
 “auth”: “.........”
 }
}
```

Configurar Push - Paso 3

Suscribir (solicitando permiso al usuario) para recibir notificaciones:

```js
const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
swRegistration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: applicationServerKey
})
.then(function(subscription) {
  console.log('User is subscribed:', subscription);
  updateSubscriptionOnServer(subscription);
  isSubscribed = true;
})
.catch(function(err) {
  console.log('Failed to subscribe the user: ', err);
  updateBtn();
});
```

Llamar a subscribe() devuelve una promesa que se resolverá después de los siguientes pasos:

 - El usuario ha otorgado servicio para mostrar notificaciones.
 - El navegador ha enviado una solicitud de red a un servicio push para obtener los detalles para generar una PushSubscription.

La promesa subscribe() se resolverá con una **PushSubscription** si estos pasos terminaron con éxito. Si el usuario no otorga permiso o si hay algún problema en la suscripción del usuario, la promesa se rechazará con un error.

Configurar Push - Paso 4

Mandar el objeto subscription al servidor para que lo persista en la base de datos: 

```js
fetch('api/subscribir', {
 headers: { 'Content-Type': 'application/json' },
 method: 'POST',
 credentials: 'same-origin',
 body: JSON.stringify(subscription)
}
```


Envío de mensajes - Paso 1

Generar y encriptar un mensaje en el Web Server.
Es un proceso bastante tedioso que conlleva muchas operaciones de seguridad y de encriptación.

En este proyecto de github podemos encontrar ejemplos de servidores ya hechos en distintos lenguajes.

https://github.com/web-push-libs

Envío de mensajes - Paso 2

Enviar el mensaje desde el Web Server al Servidor de mensajes.

El envío de mensajes debe seguir el siguiente protocolo: https://tools.ietf.org/html/rfc8030

Envío de mensajes - Paso 3

Recepción del mensaje:
- Llega el mensaje al navegador
- El navegador “despierta” al service worker de
nuestra aplicación
- El service worker procesa el mensaje en el push
event
- Mostar la notificación
- Gestionar el evento click

```js
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push recibido.');
  console.log(`[Service Worker] Contenido del push: "${event.data.text()}"`);

  const title = 'Push Codelab';
  const options = {
    body: '¡Funciona!',
    icon: 'images/icon.png',
    badge: 'images/badge.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
```


## Enlaces de interés

https://developers.google.com/web/fundamentals/push-notifications/how-push-works