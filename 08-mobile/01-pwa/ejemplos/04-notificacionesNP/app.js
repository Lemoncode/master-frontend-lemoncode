// Solicitar permiso al cargar la página
document.addEventListener('DOMContentLoaded', function () {
  if (!Notification) {
    alert('Tu navegador no soporta notificaciones'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

//Función asociada al botón del html
function mostrarNotificacion() {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('Título de la notificación', {
      icon: 'logo.svg',
      body: "Este es el cuerpo de la notificación",
      data: {}
    });

    notification.onclick = function (event) {
      window.open("https://lemoncode.net/");      
    };

  }
}