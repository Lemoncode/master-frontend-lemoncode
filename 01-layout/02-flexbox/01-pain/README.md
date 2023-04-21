# Pain

En este ejemplo intentaremos crear un layout usando las tecnicas que teniamos anteiormente, vamos a ver como podemos conseguir implementar un caso simple.

Empezamos desde 0, usando una plantilla html5.

Vamos a contruir una simple layout con 2 columnas:

- La primera contendrá el menu.
- La segunda el contenido de la pagina.

```diff
<body>
+ <div class="menu">
+ <ul>
+ <li>
+ <a href="https://www.google.com">Google</a>
+ </li>
+ <li>
+ <a href="https://www.apple.es">Apple</a>
+ </li>
+ </ul>
+ </div>
+ <div class="content"></div>
</body>
```

Vamos a definir los estilos:

_./src/mystyles.css_

```css
body {
  margin: 0px;
  padding: 0px;
}

.menu {
  float: left;
  width: 150px;
  height: 100vh;
  background: cadetblue;
}

.content {
  float: left;
  height: 100vh;
  background-color: bisque;
  width: calc(100% - 150px);
}
```

Importamos los estilos desde nuestro html

```diff
<head>
<title>Parcel Sandbox</title>
<meta charset="UTF-8" />
+ <link rel="stylesheet" type="text/css" href="./src/mystyles.css" />
</head>
```

Genial, ya tenemos nuestro layour y parece que esta bien...

Ahora como requisito nos piden añadir un border entre nuestro menu y el contenido, en teoria debería ser tan sencillo como esto:

```diff
.menu {
float: left;
width: 150px;
height: 100vh;
+ border-right: 1px solid black;
}
```

Que ha pasado al area naranja? Si hacemos scroll la veremos, asi que al añadir un pixel de border se ha desmontado nuestro layout.

Una solucion podría ser añadir ese pixel a la funcion que calcular el ancho del content:

```diff
.content {
float: left;
height: 100vh;
background-color: bisque;
- width: calc(100% - 150px);
+ width: calc(100% - 151px)
}
```

Esto funciona pero es complicado, ir añadiendo pixel no parece que sea una solución muy mantenible.

Vamos a intenar otra solucion: podriamos jugar con el box-sizing, usando la opcion de border-box.

Bien, esto podría ser una buena solucion para el border... pero para el margin no funcionaría.

No se si recordais que habia sitios donde se vendian plantillas super chulas de HTML por solo 30€ pero no podias modificarlas.

Hoy en dia, por regla genaral debemos evitar usar float;
