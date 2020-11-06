# El archivo Manifest

Es la manera estándar de informar al navegador de nuestro dispositivo de que **nuestra aplicación web es instalable**.

Es un archivo con formato json.

```json
{
  "name": "Amazing App",
  "description": "Esta app hace cosas lemon-brosas",
  "icons": [{
    "src": "images/icon.png",
    "sizes": "192x192"
  }]
}
```

![Imagen Banner Instalación](./images/pwa-install-prompt.jpeg)

Definición del estándar: https://www.w3.org/TR/appmanifest (a partir del punto 7 vienen las propiedades).

Compatibilidad en navegadores: https://caniuse.com/web-app-manifest

Ejemplos de AWPs: https://github.com/hemanth/awesome-pwa#apps


## Cómo incluir un manifest en nuestra web

Para incluir un manifest en nuestra web basta con incluir en el head de nuestro html lo siguiente:

```html
<!doctype>
<html>
  <head>
    <title>Amazing app</title>

    <!-- link al archivo manifest -->
    <link rel="manifest" href="manifest.json">
```

## Propiedades del archivo manifest

Veamos un ejemplo más elaborado

```json
{
  "lang": "en",
  "dir": "ltr",
  "name": "Amazing App",
  "description": "Esta app hace cosas lemon-brosas",
  "short_name": "Amazing",
  "icons": [{
    "src": "icon/lowres.webp",
    "sizes": "64x64",
    "type": "image/webp"
  },{
    "src": "icon/lowres.png",
    "sizes": "64x64"
  }, {
    "src": "icon/hd_hi",
    "sizes": "128x128"
  }],
  "scope": "/amazing/",
  "start_url": "/amazing/start.html?launcher=homescreen",
  "display": "fullscreen",
  "orientation": "landscape",
  "theme_color": "aliceblue",
  "background_color": "red",
  "serviceworker": {
    "src": "sw.js",
    "scope": "/amazing/",
    "update_via_cache": "none"
  },
  "screenshots": [{
    "src": "screenshots/in-game-1x.jpg",
    "sizes": "640x480",
    "type": "image/jpeg"
  },{
    "src": "screenshots/in-game-2x.jpg",
    "sizes": "1280x920",
    "type": "image/jpeg"
  }],
  "related_applications": [{
    "platform": "play",
    "url": "url/a/la/app",
    "id": "net.lemoncode.pwa"
  }],
  "prefer_related_applications": true
}
```

### lang

El lang en el que están escritos los valores de las propiedades del manifest.

### name

Nombre de la aplicación.

### short_name

Nombre corto de la aplicación. Para mostrarlo donde no quepa el nombre.

### description

Descripción de la aplicación.

### start_url

Página que se cargará cuando el usuario lance la aplicación.

### scope

El scope de nuestra aplicación.

El scope por defecto se calcula a partir de la start_url quitando el archivo, la query y el fragment.

### icons

Lista de iconos de la aplicación. 

El dispositivo, eligirá la que mejor vaya en cada caso

```json
{
  "icons": [
    {
      "src": "icon/lowres.webp",
      "sizes": "48x48",
      "type": "image/webp"
    },{
      "src": "icon/lowres",
      "sizes": "48x48"
    },{
      "src": "icon/hd_hi.ico",
      "sizes": "72x72 96x96 128x128 256x256"
    },{
      "src": "icon/hd_hi.svg",
      "sizes": "257x257"
    }]
}
```

### display

The item represents the developer's preferred display mode for the web application.

Hay 4 valores posibles a día de hoy:

- fullscreen
- standalone (apariencia de app nativa)
- minimal-ui
- browser

https://www.w3.org/TR/appmanifest/#dfn-display-modes-values

### orientation

Los valores posibles son:

- any
- natural
- landscape
- portrait
- portrait-primary
- portrait-secondary
- landscape-primary
- landscape-secondary

https://www.w3.org/TR/screen-orientation/#screen-orientation-types-and-locks

### background_color

Color de fondo de la pantalla de carga. La pantalla de carga es la pantalla que aparece mientras se carga la web.

### theme_color

Indica el theme color de la App. Es el mismo concepto que el de HTML.

https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android

### screenshots

Lista de capturas de pantalla de la App.

### categories

```json
{
  "name": "Amazing App",
  "description": "Esta app hace cosas asombrosas",
  "short_name": "Amazing",
  "categories": "sports,kids",
  "icons": [{
    "src": "images/icon.png",
    "sizes": "192x192"
  }]
}
```

Lista de categorías estandarizadas: https://github.com/w3c/manifest/wiki/Categories

### related_applications

Lista de aplicaciones relacionadas. Puede servir para indicar al usuario la existencia de la app en las stores.

```json
{
  "name": "Amazing App",
  "description": "Esta app hace cosas asombrosas",
  "short_name": "Amazing",
  "icons": [{
    "src": "images/icon.png",
    "sizes": "192x192"
  }],
  "related_applications": [
    {
      "platform": "play",
      "url": "https://play.google.com/store/apps/details?id=com.example.app1",
      "id": "com.example.app1",
      "min_version": "2",
      "fingerprints": [
        {
          "type": "sha256_cert",
          "value": "92:5A:39:05:C5:B9:EA:BC:71:48:5F:F2"
        }
      ]
    },
    {
      "platform": "itunes",
      "url": "https://itunes.apple.com/app/example-app1/id123456789"
    }
  ]
}
```

### prefer_related_applications

Si la ponemos a **true** indicamos que preferimos que se instalen la app en vez de la web. Podría servir al navegador para sugerir al usuario que se instale la app.

```json
{
  "name": "Amazing App",
  "description": "Esta app hace cosas asombrosas",
  "short_name": "Amazing",
  "icons": [{
    "src": "images/icon.png",
    "sizes": "192x192"
  }],
  "related_applications": [{
    "platform": "play",
    "url": "url/a/la/app",
    "id": "es.carherco.pwa"
  }],
  "prefer_related_applications": true,
}
```

### iarc_rating_id

string que representa el código de certificación IARC International Age Rating Coalition) de la aplicación web.

```json
{
  "name": "Amazing App",
  "description": "Esta app hace cosas asombrosas",
  "short_name": "Amazing",
  "iarc_rating_id": "e24b092d-71b3-4d3e-86ce-31a8ce4a53b6",
  "icons": [{
    "src": "images/icon.png",
    "sizes": "192x192"
  }]
}
```

https://www.globalratings.com/for-developers.aspx


## Install Prompt (Baner de instalación)

No podemos elegir cuándo se mostrará al usuario el banner de instalación.

Necesitamos cumplir una serie de requisitos. CADA NAVEGADOR TIENE SUS PROPIAS NORMAS

https://web.dev/install-criteria/

Al instalar la app, es como un acceso directo.

## Eventos

Los eventos asociados a la API Web App Manifest son:

- onappinstalled
- onbeforeinstallprompt

Podemos, por lo tanto, programrar Listeners y hacer cosas en el momento de la instalación o en el momento justo antes de enseñar el baner de instalación.

```javascript
//Hace unos meses era "install". Ahora es "appinstalled".
window.addEventListener("appinstalled", event => {
  console.log("Aplicación instalada");
});

window.addEventListener("beforeinstallprompt", event => {
  event.userChoice.then( choice => {
    var message = choice.outcome === 'dismissed' ? 'User cancelled' : 'User installed';
    console.log(message);
  });
});
```

La variable event de **onbeforeinstallprompt** tiene también un método .prompt() que permite mostrar el banner.

Como es el browser el que decide cuándo mostará el banner, quizás no lo haga en un momento que a nosotros nos interese. Podemos guardar el evento y ejectuarlo en algún momento que nos interese más:

```javascript
// Podemos cancelar el evento y guardarlo en una variable global
let promptEvent; 

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  promptEvent = event;
  return false;
});

// En otro lugar de la aplicación
if(promptEvent !== undefined) {
  promptEvent.prompt();
  promptEvent.userChoice.then(choice => {
    console.log(choice.outcome);
    if (choice.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      promptEvent = undefined;
  });
}
```

- https://developers.google.com/web/fundamentals/app-install-banners/#mini-info-bar

## Testeo del archivo manifest

- Con un dispositivo real
- Con un emulador
- Con herramientas de desarrollo de los navegadores

## Safari en iOS

Safari en iOS no admite el manifiesto de aplicación web (todavía), por lo que deberás agregar etiquetas meta tradicionales al <head> de tu archivo index.html :

```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="PWA Clima">
<link rel="apple-touch-icon" href="/images/icons/icon-152x152.png">
```

## Cómo detectar si se ha accedido a la web desde la app instalada

Si nos interesa saber en css o en javascript si un usuario ha accedido a la web desde el navegador o haciendo click en el icono de la app instalada, tenemos las técnicas que se cuentan en este enlace:

https://web.dev/customize-install/#track-how-the-pwa-was-launched

## Desinstalación de la app

Los dispositivos deben proporcionar al usuario un método para desinstalar la app.

Enlaces de interés:
- https://www.w3.org/TR/appmanifest
- https://caniuse.com/#feat=web-app-manifest
- https://github.com/w3c/manifest/wiki/Categories