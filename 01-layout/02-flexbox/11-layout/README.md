# Layout

Vamos a aplicar todo lo que hemos aprendido contruyendo el siguiente layout:

- Necesitamos espacio para la cabecera.
- Queremos tener una area principal.
- Y un footer.

Vamos a eliminar el html y css.

Añadimos el siguiente _html_:

```diff
<body>
+ <header>Mi cabecera</header>
+ <main>Mi contenido principal</main>
+ <footer>Footer</footer>
</body>
```

Vamos a prerparar el body:

- Ocupara el 100% del viewport height.
- El propio body actuará como un The body itself will act as a flex container.
- Lo mostraremos todo en una columna.

```css
body {
  margin: 0px;
  padding: 0px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
```

Vamos a definir el estilo de la cabecera, en este caso sabemos el alto y añadimos el color de fondo:

```css
header {
  height: 75px;
  background-color: cadetblue;
}
```

Es turno de la seccion principal, queremos que este elemento ocupe todo el espacio disponible:

```css
main {
  background-color: chocolate;
  flex: 1;
}
```

Finalmente reservamos un espacio para el footer:

```css
footer {
  height: 150px;
  background-color: crimson;
}
```
