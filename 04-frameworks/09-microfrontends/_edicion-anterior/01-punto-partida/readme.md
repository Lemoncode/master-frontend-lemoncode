# Microfrontends - Punto de partida

## Prerequisitos

- 🛑 **IMPORTANTE**: Para los siguientes ejemplos, realizaremos el empaquetado mediante `webpack v5` que requiere `node` por encima de la versión 10.13.0, pero es recomendable, por rendimiento, usar v12 en adelante.

  Si no actualizamos `node` es probable que veamos el siguiente error:

  > SyntaxError: Invalid regular expression: /(\p{Uppercase_Letter}+|\p{Lowercase_Letter}|\d)(\p{Uppercase_Letter}+)/: Invalid escape

- Debemos instalar las dependencias de los 3 subproyectos:

  `[host]`
  `[microapp-clock]`
  `[microapp-quote]`

  ```text
  npm i
  ```

## De un vistazo

Nuestro ejemplo de partida se divide en 3 subprojectos o módulos, cada uno de ellos siendo una aplicación en si misma, que serán integrados en _runtime_ utilizando _vanilla_ JS:

- `host`: Se trata de la aplicación principal o _host_. Su implementación es muy sencilla: emula un simple _dashboard_ cuya misión será mostrar 2 _widgets_. Estos _widgets_ serán implementados usando microfrontends. La responsabilidad principal de esta aplicación contenedora será la de orquestar los microfrontends, es decir, descargarlos y renderizarlos.
- `microapp-clock`: Microfrontend/microapp o simplemente aplicación que muestra la fecha y hora actuales según el _locale_ del navegador.
- `microapp-quote`: Microfrontend/microapp o simplemente aplicación que muestra, mediante APIs REST gratuitas, una cita famosa, su autor y una imágen de fondo aleatoria.

  > ⚡ Aunque ya hemos nombrado a los widgets como `microapp-clock` y `microapp-quote` técnicamente no son _microapps_, al menos todavía. Los convertiremos en el siguiente paso.

✅ **CHECKPOINT**

`[host]`

- Probemos la aplicación _host_:

  ```text
  npm start
  ```

`[microapp-clock] [microapp-quote]`

- Y también ambos widgets:

  ```text
  npm start
  ```
