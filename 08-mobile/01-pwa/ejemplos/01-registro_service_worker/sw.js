var version = 'v3';

this.addEventListener('fetch', function (event) {
  if (!navigator.onLine) {
    event.respondWith(new Response('<h1>Estás sin conexión</h1>', { headers: { 'Content-Type': 'text/html' } }));
  } else {
    event.respondWith(fetch(event.request));
  }
});