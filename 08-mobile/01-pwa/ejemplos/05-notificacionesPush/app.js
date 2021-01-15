// Solicitar permiso al cargar la página
document.addEventListener('DOMContentLoaded', function () {
  if (!Notification) {
    alert('Tu navegador no soporta notificaciones');
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
});


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js?v=3')
    .then(function (reg) {
      // registration worked
      console.log('Registration succeeded. Scope is ' + reg.scope);
    }).catch(function (error) {
      // registration failed
      console.log('Registration failed with ' + error);
    });
}