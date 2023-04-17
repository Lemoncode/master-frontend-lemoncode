# Pseudo class selectors

Y ahora toca practicar con las pseudo clases.

Tomamos como partida el siguiente _html_:

```diff
<body>
+ <h1>Heading</h1>
+ <input type="text">
+ <div class="container">
+ <div>First element</div>
+ <div>Second element</div>
+ <div>Third element</div>
+ <div>Fourth element</div>
+ </div>
</body>
```

Editamos el CSS, borramos el conteido y le damos estilos al elemento input:

```css
input {
  padding: 15px;
}
```

Ahora el input es mas grande.

Y si... queremos que el color de fondo cambie a verde cuando el input tenga el foco? Podemos hacerlo gracias al selector pseudoclase... Vamos a ello:

```diff
input {
  padding: 15px;
}

+ input:focus {
+ background-color: darkolivegreen;
+ color: white;
+ }
```

Ahora si hacemos click en el input y empezamos a escribir podemos comprobar 
que el color de fondo cambia a verde (y el color de la letra), si hacemos clic afuera del input pierde el foco y por tanto se restablece el estilo inicial.

Vamos a ver otro escenario tipico, queremos que el input tenga un estilo diferente cuando el usuario coloca el cursor sobre el.

```diff
input {
padding: 15px;
}
input:focus {
background-color: darkolivegreen;
color: white;
}
+ input:hover {
+ background-color: darkred;
+ }
```

> Esto tiene un comportamiento extraño, si hacemos click en el input y mantenemos el cursor dentro, se muestra el estilo del hover. Pero si queremos que una vez que el control tenga el foco se quede en verde independientemente si esta o no el cursor sobre el? como podemos arreglarlo?

**Solucion movemos el hover justo antes del focus**

Ahora queremos hacer los siguiente pasos:

- Vamos a hacer target en el _div_ con la clase \_container.
- Y queremos dar estilos a todos los hijos pares.

```diff
input:hover {
background-color: darkred;
}

+ .container div:nth-child(2n) {
+ color: darkorange;
+ }
```

Y para los hijos impares:

```diff
- .container div:nth-child(2n) {
- color: darkorange;
- }
+ .container div:nth-child(2n + 1) {
+ color: darkgreen;
+ }
```

Hay muchas combinaciones puede ser aplicada a _nth-child_, tambien podemos indicar que queremos hacer target al ultimo elemento:

```diff
.container div:nth-child(2n + 1) {
color: darkgreen;
}

+ .container div:last-child {
+ color: red;
+ }
```

[You can find more info on pseudo-class selectors in the MDN Mozilla Developer Network
](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)
