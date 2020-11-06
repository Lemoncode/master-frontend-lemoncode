var version = 2;

// Instalación
self.addEventListener('install', function (event) {
  console.log('SW ' + version + ' instalado a las ', new Date().toLocaleTimeString());
});

// Activación
self.addEventListener('activate', function (event) {
  console.log('SW ' + version + ' activado a las ', new Date().toLocaleTimeString());
});

// Activación
self.addEventListener('fetch', function (event) {
  if (!navigator.onLine) {
    event.respondWith(new Response('<h1>Estás sin conexión</h1>', { headers: { 'Content-Type': 'text/html' } }));
  } else {
    console.log(event.request.url);
    event.respondWith(fetch(event.request));
  }

});

self.addEventListener('push', function (event) {
  var payload = event.data.json();
  //...
  var options = {};
  event.waitUntil(
    self.registration.showNotification('Título', options)
  );

});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var data = event.notification.data;
  //...
  event.waitUntil(
    clients.openWindow('.....')
  );

});

