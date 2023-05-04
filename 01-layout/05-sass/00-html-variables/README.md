# HTML Variables

Vamos aprobar a usar las variables.

Vamos a añadir algun contenido a nuestro HTML:

```diff
<body>
+ <header>HTML Training</header>
+ <main>Hello Lemoncoders!</main>
</body>
```

Hora de definir una variable CSS:

```diff
body {
  font-family: sans-serif;
}

+ html {
+  --primary-color: darkorange;
+ }
```

> Para simplificar, vamos a utilizar un único archivo CSS,
> en un proyecto real estas variables podrían colocarse en un archivo CSS
> archivo separado.

Cuando ponemos la variable dentro del html estamos definiendo un ámbito en este caso le estamos diciendo que todos los elementos hijos del html podrán ver esta variable, si ,por ejemplo, la declaramos dentro del
el elemento principal no tendrá acceso a la variable --primary-color.

Y lo vamos a utilizar en el estilo que vamos a definir, tanto en la cabecera como en el principal:

```diff
html {
  --primary-color: darkorange;
}
+ header {
+   background-color: var(--primary-color);
+   padding: 25px;
+ }
+
+ main {
+   color: var(--primary-color);
+   font-size: 125%;
+   margin: 25px;
+ }
```

Ahora, si echamos un vistazo a la página del navegador que se está renderizando, podemos comprobar
que el valor de la variable se ha aplicado tanto en el fondo de la cabecera como en el
el color de la fuente de la sección.

Ahora vamos a definir una tarjeta, en los estilos vamos a indicar que el color a utilizar para el borde es el definido en la variable HTML de la variable.

```diff
main {
  color: var(--primary-color);
  font-size: 125%;
  margin: 25px;
}

+ .card {
+   border: 2px solid var(--primary-color);
+   padding: 15px;
+   border-radius: 8px;
+ }
```

Y vamos a mostrar una tarjeta en nuestro HTML

```diff
<main>
Hello Lemoncoders!
++ <div class="card">Hi I'm the card</div>
</main>
```

Hasta aquí todo bien, ahora vamos a definir dentro del ámbito de la tarjeta
una variable llamada --primary-color (oops el mismo nombre) y vamos a
asignarle el color verde, ¿Qué valor debería tener el
naranja inicial o el verde para el borde y el texto dentro de la tarjeta...?

> Preguntar a los estudiantes... adivinar

```diff
.card {
+ --primary-color: green;
  border: 2px solid var(--primary-color)
  padding: 15px;
  border-radius: 8px;
}
```

Bien.... el color del borde es verde pero el color del texto es naranja
:-@, ¡¡¡WTF!!! La cosa es que el color de la fuente se hereda si queremos establecerlo para el color del texto tenemos que anularlo explícitamente:

```diff
.card {
  --primary-color: green;
  border: 2px solid var(--primary-color)
  padding: 15px;
  border-radius: 8px;
+ color: var(--primary-color)
}
```

Otra forma de obtener el mismo resultado podría ser mover la asignación
a la sección _main_, en este caso el valor bajaría a la tarjeta
y se aplicaría al borde y al color de la fuente.

```diff
main {
+ --primary-color: green;
  color: var(--primary-color);
  font-size: 125%;
  margin: 25px;
}
.card {
- --primary-color: green;
  border: 2px solid var(--primary-color);
  padding: 15px;
```

¿Y qué pasaría si coloco la tarjeta fuera de la sección principal?

```diff
<body>
  <header>Master Front End Lemoncode</header>
<main>
  Hello Lemoncoders!
  <div class="card">Hi I'm the card</div>
</main>
+ <div class="card">Hi I'm the card</div>
</body>
```

Yeah !!

Como puedes ver todas estas variables + el alcance puede ser un poco
desordenado. Puede ocurrir que utilicemos una variable y ésta no esté
definida en el ámbito, ... para mitigar esto cuando usamos
una variable podemos indicar un valor por defecto a utilizar por si acaso
la variable no esté definida.

Evaluemos el siguiente escenario CSS:

```diff
body {
  font-family: sans-serif;
}
html {
- --primary-color: darkorange;
}
header {
+ --primary-color: darkorange;
  background-color: var(--primary-color);
  padding: 25px;
}
main {
  --primary-color: green;
  color: var(--primary-color);
  font-size: 125%;
  margin: 25px;
}
.card {
  border: 2px solid var(--primary-color);
  padding: 15px;
  border-radius: 8px;
}
```

En este caso si usamos _card_ fuera de la sección _main_
--primary-color podría ser indefinido, en este caso configuramos
un valor de reserva.

```diff
.card {
- border: 2px solid var(--primary-color);
+ border: 2px solid var(--primary-color, red);
  padding: 15px;
  border-radius: 8px;
}
```

Las variables CSS eran algo poco utilizado en los proyectos reales, los desarrolladores
desarrolladores tendían a utilizar preprocesadores como SASS, que también proporcionan
características, pero en los últimos tiempos estas variables CSS están de nuevo en el punto de mira, y
algunos nuevos frameworks están empezando a utilizarlas.
