self.addEventListener('push', function (event) {
  console.log('push!!!');
  var payload = event.data.text();
  //...
  var options = {
    data: {},
    actions: [{
      action: 'view',
      title: 'Ver',
      icon: 'path/icono'
    }, {
      action: 'ignore',
      title: 'Ignorar',
      icon: 'path/icono'
    }],
  };
  event.waitUntil(
    self.registration.showNotification('Título: ' + payload, options)
      .then(
        () => console.log('Notificación mostrada')
      )
  );
});

self.addEventListener('notificationclick', function (event) {
  console.log(event.action);
});