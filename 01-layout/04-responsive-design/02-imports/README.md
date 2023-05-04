# Imports

Cuando jugamos con diferentes CSS podríamos tener:

- Un archivo que incluya los estilos base.
- Un archivo que podría incluir las definiciones / valores de las variables..
- Uno o más archivos que incluyan los estilos específicos de las páginas web.

Veamos un ejemplo sencillo, vamos a crear un archivo base.css y vamos a incluir el estilo de restablecimiento _body_:

_./src/base.css_

```css
body {
  padding: 0;
  margin: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
```

Importémoslo y eliminemos el código que estaba previamente en el css principal principal:

```diff
+ @import url("./base.css");

- body {
- padding: 0;
- margin: 0;
- height: 100vh;
- display: flex;
- flex-direction: column;
- }
```

Tenga en cuenta que estas importaciones deben estar en la parte superior del archivo y puede cargar
condicionalmente en función de las media queries.

https://developer.mozilla.org/es/docs/Web/CSS/@import
https://www.w3schools.com/cssref/pr_import_rule.asp

Ahora pueden surgir algunas preguntas en su cabeza:

- Un CSS que importa otro CSS puede hacer mas lenta la carga
  (carga el CSS principal y luego solicita el dependiente, si hay varias importaciones en el mismo archivo, se descargarán en paralelo).

- Si repites importaciones entonces estás repitiendo código.

Sobre las importaciones que importan otro CSS puede ser un buen escenario si estás manejando mediaqueries, por ejemplo, por defecto no cargas estilos CSS a no ser que estés en un diseño de impresión..

Solución para esto:

- Devops / Bundling: se puede agrupar todo el CSS en un solo archivo si es necesario (webpack al rescate).
- Usa SASS, CSS in JS, CSS module..., por ejemplo SSAS ofrece
  @use en vez de @import

Import SASS (deprecated)

https://sass-lang.com/documentation/at-rules/import

Import Use (recommended)

https://sass-lang.com/documentation/at-rules/use
