# Other selectors

Hemos visto como podemos aplicar algunos estilos a varios selectores separandolos por comas:

Vamos a ver otras combinaciones:

Partimos del siguiente html:

```diff
<body>
+ <h1>Heading 1</h1>
+ <input type="text"/>
+ <div class="container">
+   <p>First element</p>
+   <p>Second element</p>
+ </div>
+ <div class="container2">
+   <p>Third element</p>
+   <p>Fourth element</p>
+ </div>
</body>
```

Borramos todos los estilos definidos. Queremos que todos los parrafos tenga la letra de color rojo.

```css
p {
  color: red;
}
```

Que pasaría si cambio el selector por esto?

```diff
- p {
+ div p {
color: red;
}
```

Todos los parrafos siguen en rojo porque estan dentro de un div.

pero que pasaria sin combinamos el div con la clase _container_?

```diff
- div p {
+ div.container p {
color: red;
}
```

Vamos a cambiar un poco el html:

```diff
<body>
<h1>Heading 1</h1>
<input type="text" />
<div class="container">
+ <section>
  <p>First element</p>
+ </section>
<p>Second element</p>
</div>
- <div class="container2">
+ <section class="container">
  <p>Third element</p>
  <p>Fourth element</p>
+ </section>
- </div>
</body>
```

Como??? Los parrafos bajo el div _container_ se muestran en rojo. Esto eso porque la regla se aplica en profundida, es decir hijos, nietos... etc. Pôdríamos aplicar la regla solo a los hijos directos?

Modificamos el css:

```diff
- div.container p {
+ div.container > p {
  color: red;
}
```

Vamos a ver otro ejemplo con los hermanos adyacentes. Actualizamos nuestro HTML:

```diff
  <body>
    <h1>Heading 1</h1>
    <input type="text" />
    <div class="container">
      <section>
        <p>First element</p>
      </section>
      <p>Second element</p>
    </div>
    <section class="container">
      <p>Third element</p>
      <p>Fourth element</p>
    </section>
+   <section class="container">
+     <p>Fifth element</p>
+     <p>Sixth element</p>
+   </section>
  </body>
```

Ahora vamos a selecionar el _div_ que tiene el _container_ como clase y seleccionamos todos las secciones adyacentes para aplicarle un color de fondo:

```diff
div.container > p {
color: red;
}
+ div.container + section {
+ background-color: darkorange;
+ }
```

Bien, pero que pasa si nosotros tenemso un hermano que lo colocamos justo delante del _div_, algo como:

```diff
  <body>
    <h1>Heading 1</h1>
    <input type="text" />
+   <section class="container">
+     <p>XXXX element</p>
+     <p>XXXX element</p>
+   </section>
    <div class="container">
      <section>
        <p>First element</p>
      </section>
      <p>Second element</p>
    </div>
    <section class="container">
      <p>Third element</p>
      <p>Fourth element</p>
    </section>
```

Bien...no pasa nada!! Pero es un hermano adyacente!!

> A los estudiantes... Alguna idea de por qué pasa esto?

**Solucion: La busqueda de hermanos adyacentes se hace de arriba a abajo, no podemos aplicar ese estilo a un elemento que esta arriba... esto se realiza por performance**

Si queremos aplicar el estulo a todos los hijos adyacentes que siguen al selector:

```diff
- div.container + section {
+ div.container ~ section {
background-color: darkorange;
}
```

Lo mismo pasa aquí, si el hermano ya se renderizó, no se le aplica el nuevo estilo.

