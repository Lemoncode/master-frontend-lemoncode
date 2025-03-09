# Microfrontends - Punto de partida

## Prerequisitos

- 🛑 **IMPORTANTE**: Para los siguientes ejemplos, realizaremos el empaquetado mediante `vite` que requiere `node` en versiones `18+` o `20+`. Recuerda tener una versión actualizada de `Node.js`.

- Debemos instalar las dependencias de los 3 subproyectos:

  `[host]`
  `[keypad]`
  `[terminal]`

  ```text
  npm i
  ```

## De un vistazo

Nuestro ejemplo de partida consta de varios subprojectos, cada uno de ellos siendo una aplicación en si misma, que serán integrados en _runtime_ utilizando una aproximación "artesanal" como opción inicial. En total son 3 projectos, tal y como sigue:

- `host`: Se trata de la aplicación principal o _host_. Su implementación es muy sencilla: emula un simple _dashboard_ cuya misión será mostrar 2 _widgets_ interconectados. Estos _widgets_ serán implementados usando microfrontends y la aplicación _host_ compondrá su funcionalidad en base a ellos. Por tanto, la responsabilidad principal de esta aplicación contenedora será la de orquestar los microfrontends, es decir, descargarlos y renderizarlos.
- `keypad`: Aplicación que implementa un _widget_ en forma de teclado numérico por pantalla, similar al que podemos encontrar en cajeros automáticos.
- `terminal`: Aplicación que implementa un _widget_ cuya finalidad es mostrar un total de 6 carácteres consecutivos, tal y como encontramos en muchas aplicaciones que requieren un código numérico o PIN.

✅ **CHECKPOINT**

Hagamos una primera comprobación para ver que implementa cada uno de los proyectos mencionados:

`[host]`

- Probemos la aplicación _host_:

  ```text
  npm dev
  ```

`[keypad] [terminal]`

- Y también ambos widgets:

  ```text
  npm dev
  ```

> ⚡ Aunque por ahora se trata de 3 aplicaciones separadas (_standalone_), en el siguiente paso haremos algunos simples ajustes para poder integrar, en _runtime_, `keypad` y `terminal` como parte de la aplicación `host`. Será una aproximación bastante simple y artesanal, pero suficiente para ilustrar un sencillo ejemplo de arquitectura con microfrontends.
