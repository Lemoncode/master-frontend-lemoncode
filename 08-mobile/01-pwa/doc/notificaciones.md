# Notificaciones

Las notificaciones pueden proporcionar grandes beneficios a los usuarios si se utilizan de una manera relevante, precisa y justo en el momento adecuado.

## Notificaciones No Persistentes

- Se gestionan con la API de notificaciones.
- No están asociadas a un Service Worker.
- No se pueden definir acciones.

Los navegadores que soportan notificaciones disponen de una clase Notification. Basta con hacer “new Notification” parar crear y mostrar una notificación.

```javascript
var n = new Notification('Título de la notificación', {
… opciones ...
}
```

https://developer.mozilla.org/es/docs/Web/API/notification

## Notificaciones Persistentes

- Están asociadas a un Service Worker.
- Tienen las mismas propiedades que las no persistentes, más una adicional: “actions”.

Estas notificaciones se gestionan desde un Service Worker, por lo que el contexto será el del worker.

Para crear y mostrar una notificación hay que llamar al método .showNotification del .registration del worker.

```javascript
self.registration.showNotification('Título de la notificación’, {
 … opciones ...
})
```

## Opciones (propiedades) de las notificaciones

- body: el cuerpo de la notificación
- badge: URL de la imagen usada para representar la notificación cuando no hay espacio suficiente para mostrarla.
- icon: URL de la imagen usada como ícono de la notificación
- image: URL de una imagen para mostrar como parte de la notificación
- tag: ID de la notificación
- renotify: Boolean indicando si se debe notificar al usuario después de que una notificación nueva reemplace a una anterior.
- data: un objeto con datos
- requireInteraction: Boolean indicando en dispositivos pantallas lo suficientemente grandes, una notificación debería permanecer activa hasta que el usuario haga click o la descarte.
- silent: Boolean indicando si la notificación debería ser silenciada, por ejemplo sin generar sonidos o vibraciones, independientemente de la configuración del dispositivo.
- sticky: Boolean indicando si la notificación debe ser 'fija', es decir, no fácilmente eliminable por el usuario.
- noscreen: Boolean indicando si la notificación de encender la pantalla del dispositivo o no.
- sound: recurso de sonido para reproducir cuando se activa la notificación, en lugar del sonido de notificación del sistema predeterminado.
- vibrate: patrón de vibración para dispositivos que disponen de hardware para emitirlo. 
- dir: dirección del texto de la notificación
- lang: código del lenguaje de la notificación
- timestamp: timestamp de la notificación
- actions (sólamente las persistentes)

## Eventos

- onclick
- onerror
- onclose (obsoleto)
- onshow (obsoleto)

## Métodos

- requestPermission(): Para mostrar notificaciones, hay que pedir permiso previamente.
- close()

```javascript
setTimeout(notification.close.bind(notification), 4000);
```

## Permisos

Notification.permission devuelve una cadena que representa el permiso actual para mostrar notificaciones. 

Los valores posibles son: 

- denied: El usuario rechaza que las notificaciones sean mostradas
- granted: El usuario acepta que las notificaciones sean mostradas
- default: La elección del usuario es desconocida por lo tanto el navegador actuará como si el valor fuese denied

### Actions

```javascript
actions: [{
 action: 'view',
 title: 'Ver',
 icon: 'path/icono'
},{
 action: 'ignore',
 title: 'Ignorar',
 icon: 'path/icono'
}],
```








