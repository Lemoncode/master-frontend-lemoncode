# 03 Depurando nuestras pruebas

La mayoría del tiempo que pasamos los programadores delante de nuestro código es arreglando errors, y
para ello solemos ponernos a depurar (a hacer `debugging`) del código, si lo que estamos programando
en Front End normalmente usamos las herramientas de `debugging` que trae nuestro navegador favorito,
pero esto no nos vale con `Jest` ya que no se ejecuta en el navegador.

¿Qué podemos hacer? Hacer uso de Visual Studio Code, esté editor nos da varias opciones para que podamos
depurar y poner breakpoints.

Tomaremos como punto de partida `02-calculator`.

Resumen de los pasos que vamos a realizar:

- Opción A: utilizar el `JavaScript Debug Terminal`.
  -Opción B: crear una configuración de depuración.

# Manos a la obra

- Ya hemos copiado el ejemplo anterior, vamos a ejecutar desde la línea de
  comandos `npm install` para instalar los paquetes de npm que ya teníamos
  en nuestro _package.json_ en el proyecto anterior:

```bash
npm install
```

## Depurando Jest

`Jest` corre sobre nodejs, así que podemos utilizar `VS Code` para depurar los specs:

### Using JavaScript Debug Terminal

Ya que `jest` es un proceso de `nodejs` podemos usar el `JavaScript Debug Terminal` que viene integrado
en VS Code para depurar.

> [Más info acerca de esto en este enlace](https://www.lemoncode.tv/curso/vs-code-js-debugging/leccion/javascript-debug-terminal)

Y podemos añadir breakpoints en el código (tanto en los `specs` como en el código de aplicación), y desde ese terminal de depuración,
nos vale tanto ejecutar una sólo ejecución:

```bash
npm test

```

O dejarlo en modo `watch` y que vaya parando en los breakpoints en cada ejecución (esto es muy útil cuando estamos desarrollando, si
vemos que algo falla, directamente ponemos un breakpoint y no tenemos que esperar a que se haga el setup se ejecución única)

```bash
npm run test:watch

```

También si queremos podemos decirle ejecute las specs de un fichero en concreto o varios:

Vamos a crear un fichero de prueba que llamaremos _second.spec.ts_ y veremos que sólo indicándole el nombre del fichero se ejecutarán esas pruebas
sólo.

#### ./src/second.spec.ts

```typescript
describe('second specs', () => {
  it('should return true', () => {
    expect(true).toBeTruthy();
  });
});
```

```bash
npm run test:watch second
npm run test:watch second.spec
npm run test:watch spec

```

> También podemos usar la opción `p` en el menú de jest para indicarle un patrón.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apúntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
