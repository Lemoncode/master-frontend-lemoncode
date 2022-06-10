# Componente Común

En este ejemplo aprenderemos a crear un componente común.

# Ejercicio opcional

Esta vez hemos identificado un tablero de opciones, donde el usuario ve
una lista de iconos y puede elegir una de las opciones.

Esto necesita estar basado en flexbox y puede ser algo genérico

Podemos querer implementar algo como esto:

https://codesandbox.io/s/tender-forest-hbovz?file=/src/styles.css

o:

https://codesandbox.io/s/interesting-shadow-yivek?file=/src/mystyle.css:0-776

En nuestro caso utilizaremos como iconos los siguientes:

- Github
- Linked in
- Twitter

Y crearemos una nueva página donde podamos consumir los componentes comunes y dejar que
que el usuario navegue a la página de miembros de github si hace clic en el enlace de github.

# Tips / Pasos:

- Primero crea una nueva escena, podemos llamarla _dashboard_.
- A continuación, crea un pod _dashboard_ que incluya un contenedor / componente.
- Conecta el contenedor con la escena.
- Añádelo a las rutas del router, y en el contenedor de inicio de sesión debe redirigir al tablero de instrumentos
  cuando el inicio de sesión tiene éxito.
- Ahora descarga el jpg de los logos y colócalo bajo el _pod_ del _dashboard_ (podrían ser
  colocados en una carpeta pública de activos, pero esto necesitaría algunas _pipes_ adicionales de _webpack_).
- Prueba primero construir un diseño estático sin componentizar y vincula la fecha... ¿se muestra todo?
  genial...
- El siguiente paso es pasar una lista y añadir un _map_, te darás cuenta de que tienes un candidato a la componentización,
  una cosa es el contenedor de la lista y otra es el componente en sí.
- Ahora te das cuenta... hey esto huele a que podría ser promocionado a un componente común
  (puede ser reutilizado por otra aplicación incluso, no depende del dominio, esto se basa en una _real history_).
- Creamos la carpeta _src/common/components/dashboard_.
- Movemos la implementación del contenedor del _dashboard_ a _common_ (aceptando como _props_ una lista de
  _item Info_, _link_ a la imagen y nombre a mostrar).
- Movemos la implementación del _ítem_ del _dashboard_ a _common_.
- Expongamos el contenedor en el _barrel_ del _index_.
- Es hora de usarlo en nuestro _pod_ de _dashboard_.

Parece mucho trabajo, pero la próxima vez que necesites un _dashobard_ como éste sólo tienes que
escribir el código en el _pod_ del _dashboard_ para obtener los mismos resultados.

Algunos retos adicionales no cubiertos:

- Podríamos promover esto a una _library_, algunos consejos: https://webpack.js.org/guides/author-libraries/
- Permitir la personalización de la apariencia, aquí tienes algunas opciones adicionales:
  - Podrías intentar añadir algunas propiedades para eso, esto no es una buena idea, porque _CSS_ es bastante abierto
    y estamos limitando su poder
  - Puedes intentar añadir una _api CSS_ para el componente, esto puede ser bueno, pero es mucho trabajo, y para
    evitar problemas de especificidad es una buena idea usar librerías como _css in js_.
  - Puedes pedir que se sobreescriban algunas clases (se necesita un sistema de _pipes_ extra), este es el enfoque que material ui está
    siguiendo ahora.

