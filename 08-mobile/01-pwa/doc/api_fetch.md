# API Fetch

- Living Standard
- Basada en Promesas
- Disponible en window y en worker

Página oficial: https://fetch.spec.whatwg.org/

Soporte en Navegadores: https://developer.mozilla.org/es/docs/Web/API/Fetch_API

## Conceptos

- Request
- Response
- Headers
- Body
- Método fecth()

### Request

- url
- method
- headers
- body
- destination
- referrer
- referrerPolicy
- mode
- credentials
- redirect
- integrity
- cache
- clone()

### Response

- url
- headers
- Body
- status
- statusText
- ok
- type
- redirected
- useFinalUrl
- clone()

### Headers

- append(name, value)
- set(name, value)
- delete(name)
- get(name)
- getAll()
- has(name)
- entries()
- keys()
- values()

### Body

- arrayBuffer()
- blob()
- formData()
- json()
- text()
- bodyUsed


## Ejemplos

Petición con cabeceras y request:

```javascript
var misCabeceras = new Headers();

var miRequest = { method: 'GET',
               headers: misCabeceras,
               mode: 'cors',
               cache: 'default' };

fetch('flores.jpg',miInit)
.then(function(response) {
  return response.blob();
})
.then(function(miBlob) {
  var objectURL = URL.createObjectURL(miBlob);
  miImagen.src = objectURL;
});
```

Comprobar que la respuesta es HTTP 200 OK:

```javascript
fetch('flores.jpg').then(function(response) {
  if(response.ok) {
    response.blob().then(function(miBlob) {
      var objectURL = URL.createObjectURL(miBlob);
      miImagen.src = objectURL;
    });
  } else {
    console.log('Respuesta de red: ' + response.status);
  }
})
.catch(function(error) {
  console.log('Hubo un problema con la petición Fetch:' + error.message);
});
```

Enviar datos JSON

```javascript
var url = 'https://example.com/profile';
var data = {username: 'example'};

fetch(url, {
  method: 'POST',
  body: JSON.stringify(data),
  headers:{
    'Content-Type': 'application/json'
  }
}).then(res => res.json())
.catch(error => console.error('Error:', error))
.then(response => console.log('Success:', response));
```

Enviar un archivo

```javascript
var formData = new FormData();
var fileField = document.querySelector("input[type='file']");

formData.append('username', 'abc123');
formData.append('avatar', fileField.files[0]);

fetch('https://example.com/profile/avatar', {
  method: 'PUT',
  body: formData
})
.then(response => response.json())
.catch(error => console.error('Error:', error))
.then(response => console.log('Success:', response));
```


## PRECAUCIÓN: El cuerpo de las solicitudes y respuestas es de un solo uso

