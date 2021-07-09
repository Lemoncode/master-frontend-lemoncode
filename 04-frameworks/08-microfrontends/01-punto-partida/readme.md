# Microfrontends - Punto de partida

## Prerequisitos

- 🛑 **IMPORTANTE**: Antes de comenzar, debemos asegurarnos de utilizar versión de `node` moderna. Realizaremos el empaquetado mediante `webpack v5` que a su vez requiere `node` por encima de la versión 10.13.0, pero es recomendable, por rendimiento, usar v12 en adelante.

  O bien hacemos una instalación fresca, o bien, si estamos usando `nvm` como gestor de `node` en nuestra máquina, cambiamos con:

  ```text
  nvm use 12.x.x
  ```

  Si no actualizamos `node` es probable que veamos el siguiente error:

  > SyntaxError: Invalid regular expression: /(\p{Uppercase_Letter}+|\p{Lowercase_Letter}|\d)(\p{Uppercase_Letter}+)/: Invalid escape

- Debemos instalar las dependencias de los 3 subproyectos:

  `[app]`
  `[microapp-clock]`
  `[microapp-quote]`

  ```text
  npm i
  ```

## De un vistazo

Nuestro ejemplo de partida se divide en 3 subprojectos o módulos, cada uno de ellos siendo una aplicación en si misma, que serán integrados en _run-time_ utilizando _vanilla_ JS:

- `app`: Se trata de la aplicación _host_ o principal. Su implementación es muy sencilla: emula un simple _dashboard_ cuya misión será mostrar 2 _widgets_. Estos _widgets_ serán implementados usando microfrontends. La responsabilidad principal de esta aplicación contenedora será la de orquestar los microfrontends, es decir, descargarlos y renderizarlos.
- `microapp-clock`: Microfrontend/microapp o simplemente aplicación que muestra la fecha y hora actuales según el _locale_ del navegador.
- `microapp-quote`: Microfrontend/microapp o simplemente aplicación que muestra, mediante APIs REST gratuitas, una cita famosa, su autor y una imágen de fondo aleatoria.

## Microfrontends - Configuración dual de webpack

Para cada microfrontend, hemos establecido una doble configuración de webpack:

```text
[INSPECCIONAR] microapp-clock/config
```

Cada configuración se obtiene mediante la mezcla de varios ficheros que contienen todos los settings necesarios. Esta estrategia de separar en ficheros comunes permite eliminar la redunancia de código. Además, cada configuración tendrá su variante `dev` o `prod`, según si hacemos target para desarrollo o producción:

- Configuración **microfrontend**: `common.js` + `microfrontend.js` + `webpack.microfrontend.<dev|prod>.js`.
- Configuración **standalone**: `common.js` + `standalone.js` + `webpack.standalone.<dev|prod>.js`

La idea detrás de esta configuración dual es poder cubrir las dos fases principales en el ciclo de vida de un microfrontend:

1. Durante la **fase de desarrollo**, nos interesa poder levantar nuestro microfrontend como una aplicación _standalone_, totalmente independiente del resto, sin necesidad de acceder a el a través de la aplicación _host_ (es decir, sin necesidad de que esté integrado). Y eso es posible, ya que un microfrontend no deja de ser una aplicación web (de funcionalidad más reducida eso si).

2. En el momento de una **_release_** y/o **despliegue**, empaquetaremos toda la aplicación con sus assets y recursos necesarios en un único bundle\*\*, como si de una librería se tratara, con la diferencia de que será consumido en tiempo real por la aplicación _host_.

> \**Nota: Esta estrategia de generar un paquete único (1 microfrontend = 1 bundle), no es estrictamente necesaria, pero conceptualmente nos ayuda a mantener cierto orden entre todos los microfrontends, a su gestión (sobre todo cuando se tienen muchos) y a facilitar su descarga por la aplicación *host*. Si se quiere optimizar al máximo el consumo de los microfrontends, también pueden subdividirse e incluso compartir dependencias. Esto es algo que se está explorando en la actualidad con la feature de webpack 5 llamada *module federation\*.

Aunque esta separación dual no es estrictamente necesaria, a nosotros nos permite poder hacer ajustes finos a cada _setup_ y nos ayuda a separar responsabilidades. De hecho:

- El setup **_standalone_** se encargará de:

  - Configurar el servidor de desarrollo de webpack.
  - Añadir los source mapping para posibles depuraciones (en modo dev).
  - Y, muy importante, generar el `index.html` necesario para poder levantar nuestro microfrontend de forma autónoma.

  Este setup tendrá un punto de entrada específico en código que llamaremos `standalone.entrypoint.tsx`.

- El setup **microfrontend**, por su lado:

  - Se centra en generar un bundle único, empaquetado en modo librería.
  - Embebe recursos si es necesario.

  No hay necesidad de generar ningún `index.html` puesto que será la aplicación _host_ quien lo provea. El punto de entrada para esta configuración será `microfrontend.entrypoint.tsx`.

Dispondremos además de sus correspondientes _scripts_ en el `package.json` para lanzar una _build_ en modo microfrontend (con la intención de hacer un despliegue) o arrancar nuestro servidor de desarrollo (para el día a día del equipo que trabaje con el).

## Microfrontends - Puntos de entrada duales

Tal y como se puede intuir del apartado anterior, necesitamos tener un _entrypoint_ dual en nuestra aplicación acorde a las dos configuraciones anteriores de webpack.

### 1) `microfrontend.entrypoint.tsx`

```text
[INSPECCIONAR] microfrontend.entrypoint.tsx
```

Recordemos que la misión del setup microfrontend, no es arrancar el propio microfrontend sino empaquetarlo para ser consumido por una aplicación _host_. Por lo tanto, en este _entrypoint_ debemos plantearnos:

- ¿Qué queremos exportar hacia afuera en nuestro _bundle_?
- ¿Cómo queremos que la aplicación o aplicaciones _host_ consuman nuestros microfrontends?

En resumidas cuentas, tenemos que definir la 'carcasa' de nuestro microfrontend. Es decir, tenemos que ofrecer una interfaz genérica y sencilla que permita a las aplicacion(es) \_host renderizar los microfrontends.

Aqui hay diversas soluciones, una de ellas podría haber sido el empleo de _web components_ como envoltura de los microfrontends.

En nuestro caso, nos hemos inclinado por utilizar una simple API con 2 funciones, que serán llamadas por la aplicación _host_ cuando lo precise:

- `render`: para 'pintar' el microfrontend.
- `unmount`: para desmontarlo.

En ambos casos, sera la aplicación _host_ quien provea el container (nodo del DOM de su propiedad) donde debe renderizarse o desmontarse el microfrontend. Esta API estará escrita en _vanilla_ JS, y por tanto es una solución sencilla con importantes ventajas:

- Compatibilidad total.
- 100% flexible y customizable.

Eso si, es nuestra responsabilidad mantener esta interfaz, con lo que ello supone: garantizar que se cumple en todos los microfrontends, compatibilidad hacia atrás, evitar _breaking changes_, etc.

LLegó el momento de probar esta configuración. Lancemos una build:

`[microapp-clock]`
`[microapp-quote]`

```text
npm run build:microfrontend:dev
```

```text
[INSPECCIONAR] build/microapp/report/report.html
```

### 2) `standalone.entrypoint.tsx`

Durante el ciclo de desarrollo será conveniente poder levantar nuestro microfrontend de forma independiente, o sea, sin necesidad de integrarlo con la aplicación _host_ ¿Qué necesitamos? Pues lo más sencillo será consumir y llamar al interfaz que se expone en `microfrontend.entrypoint.tsx`.

Es decir, emularemos lo que haría la aplicación _host_ real mediante una aplicación _host_ de mentira (o _mock_) cuya misión es proporcionar un `index.html` básico en donde poder renderizar el microfrontend.

```text
[INSPECCIONAR] standalone.entrypoint.tsx
```

En resumen, nuestro _standalone.entrypoint_ será algo tan sencillo como importar y ejecutar el método `render` del interfaz de nuestro microfrontend, pasándole un nodo container improvisado (`id=root`) en un `index.html` hecho a tal fin.

Recordemos, será el _setup_ **standalone** de webpack quien ponga en marcha el servidor de desarrollo y lo alimentará con un `index.html` que generará usando como plantilla el `index.html` que encontramos en el código fuente.

Probemos a arrancar nuestros microfrontends:

`[microapp-clock]`
`[microapp-quote]`

```text
npm start
```

## Aplicación _host_

Nuestra aplicación _host_ de partida no es más que un sencillo componente a modo de _dashboard_ que utilizaremos para alojar los microfrontends anteriores.

`[app]`

```text
npm start
```

En el siguiente ejercicio implementaremos una solución para integrar en _runtime_ dichos microfrontends.
