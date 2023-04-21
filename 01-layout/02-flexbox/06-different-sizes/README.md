# Different sizes

Bueno, hasta ahora hemos creado elementos con el mismo tamaño.

Podemos crear elementos con diferentes tamaños y flexbox lo manejará We can create items with different size and flexbox will
manage them sin problemas, vamos a comprobarlo con el siguiente ejemplo:

```diff
<body>
+ <div class="my-flex-container">
+ <div>Some text: 123</div>
+ <div>Some text: 123456</div>
+ <div>Some text: 1236546546</div>
+ <div>Some text: 12365465465465</div>
+ <div>Some text: 123</div>
+ <div>Some text: 1234645654</div>
+ <div>Some text: 12</div>
+ <div>Some text: 123</div>
+ <div>Some text: 123</div>
+ <div>Some text: 123645065406540650</div>
+ </div>
</body>
```

Limpiemos el css, y :

- Eliminamo margin y padding del body.
- E incluimos un contenedor y un border para comprobar el tamaño del contanier.
- Le damos a cada elemento colores y bordes.

```css
body {
  margin: 0px;
  padding: 0px;
}
.my-flex-container {
  border: 5px solid black;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 5px;
}
.my-flex-container div {
  box-sizing: border-box;
  border: 1px solid black;
  padding: 5px;
  color: white;
  background-color: darkmagenta;
}
```
