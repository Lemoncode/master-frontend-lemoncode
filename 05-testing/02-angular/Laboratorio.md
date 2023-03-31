# Laboratorio

Solamente el primer ejercicio es obligatorio.

El resto de ejercicios son opcionales.

Los puntos etiquetados como "reto" también son opcionales.

## OBLIGATORIO - Layout completo de mini-aplicación

En este ejercicio se practica:

- CLI para crear componentes y servicios.
- Añadir Angular Material al proyecto.
- Diseño del layout completo de una aplicación.
- Programación de un servicio para gestionar el estado de la aplicación.
- Inyección de servicios.
- Routing.
- Formulario.

Ejemplo modelo: <https://carherco.es/curso-angular-ejercicio-final>

(Este ejemplo modelo es similar pero no es exacto. Es para tener una idea. Lo que se pide realmente es lo que está escrito en el enunciado de este documento).

1; Crea un nuevo proyecto de Angular con routing y con estilos scss.

2; Añade Angular Material: <https://material.angular.io/guide/getting-started>. (Este punto es mejor hacerlo nada más empezar que una vez terminada la mini-aplicación).

3; Crea los componentes necesarios para crear el layout que se describe a continuación. Tendrás componentes de layout (cabecera pública, cabecera privada, pie, menú público, menú privado…) y componentes enrutados (la página home, la página login, la página acerca de, la página galería…)

Esta aplicación tendrá 2 menús. Un menú público que se mostrará cuando el usuario todavía no haya hecho login y un menú privado que se mostrará cuando el usuario haya hecho login.

Enlaces del menú público:

- Home => Te lleva a la página de bienvenida de la aplicación
- Login => Te lleva a un formulario de login
- Acerca de => Te lleva a la página “Acerca de”

Enlaces del menú privado:

- Dashboard
- Galería
- CRUD
- Profile

Deberá aparecer un logo y el nombre de la web en la cabecera y algún contenido estático en el pie.

4; Configura el routing para asignar una url a cada una de las 7 páginas de los menús. Puedes enseñar (de momentos) los dos menús simultáneamente en la pantalla para comprobar que funcionan.

Los componentes todavía no tienen ningún contenido. No hay que programarlos. En este punto basta con que existan y se muestra su contenido por defecto: ‘xxxxxx works’

5; Crea un formulario de login con 2 campos: username y password. Pon validaciones y mensajes de error. Al hacer submit del formulario, el componente invocará al método login() del servicio descrito en el siguiente punto.

6; Crea un servicio Auth que gestione el estado relacionado con la autenticación del usuario. Este servicio debe ofrecer cuatro métodos:

- login({username: string, password: string}): boolean
- logout(): void
- isLogged(): boolean
- getUsername(): string

El método de login devolverá true para la combinación válida username = ‘master@lemoncode.net’ y password: ‘12345678’. Para el resto de combinaciones devolverá false. (Un simple if es suficiente para esta simulación de login). Si la combinación válida que os sugiero no cumpliera las validaciones de vuestro formulario de login, podéis utilizar cualquier otra combinación válida que se adapte a vuestro caso.

7; Modifica el componente de login para que si al invocar al servicio de login, éste último devuelve true, el componente redirija al usuario al dashboard.

NOTA: Para esto necesitáis consultar los apuntes del tema de routing ya que no dio tiempo a verlo durante la sesión.

<https://github.com/Lemoncode/master-frontend-lemoncode/blob/master/04-frameworks/02-angular/09-routing/readme_es.md> (apartado “El servicio Router”).

8; Haz que solamente se muestre el menú público si el usuario no está logueado y el menú privado si el usuario sí está logueado.

9; Añade un botón de salir en la cabecera de la web que solamente se muestre si el usuario está logueado

10; También en la cabecera, y solamente cuando el usuario esté logueado, muestra el username del usuario.

11; RETO. Añade persistencia al estado de autenticación guardando el estado en el localstorage.

## OPCIONAL: Galería de fotos

En este ejercicio se practica:

- Binding
- Directivas estructurales
- Utilización del directorio assets

Se trata de programar una galería de fotos en el componente galería del ejercicio anterior.

Ejemplo modelo: <https://carherco.es/curso-angular/#/galeria>

(Este ejemplo modelo es similar pero no es exacto. Es para tener una idea. Lo que se pide realmente es lo que está escrito en el enunciado de este documento).

NOTA: Este ejercicio se puede programar en un componente del proyecto anterior o también se puede programar en un proyecto nuevo.

1; Descarga al menos 8 fotos y ponlas en el directorio src/assets del proyecto. Dentro de src/assets puedes crear subdirectorios si así lo deseas

Desde el html puedes enlazar las imágenes de la siguiente forma:

```html
<img src=”assets/….” />
```

2; Crea una lista (array) con objetos del tipo:

{
  id: number => id de la foto
  src: string => nombre o path de la imagen
  title => title de la imagen
}

Puedes crear la lista en un archivo, en un servicio, en el propio componente…, pero sea como sea al final del todo esa lista tiene que llegar a una propiedad pública del componente Galería.

3; La galería de fotos constará de 3 partes:

- Imagen seleccionada: Una parte con la lista de todas las imágenes (en pequeño) de la galería.
- Listado de imágenes: Una parte en la que se muestre en grande una de las fotos
- Botonera: Una parte con una botonera con 6 botones: anterior, siguiente, aumentar, disminuir, play, stop.

Crea la estructura HTML para mostrar esas 3 partes/bloques en la pantalla

4; Programa la galería, las funcionalidades son las siguientes:

- Al empezar, se mostrará una de las imágenes en la parte de Imagen seleccionada.
- Al hacer click en una imagen de la lista, la imagen correspondiente se mostrará en la parte de imagen seleccionada.
- Al hacer click en el botón siguiente, se cambiará la imagen seleccionada por la siguiente de la lista.
- Se pondrá “disabled” el botón siguiente cuando la imagen seleccionada sea la última de la lista.
- Al hacer click en el botón anterior, se cambiará la imagen seleccionada por la anterior de la lista.
- Se pondrá “disabled” el botón anterior cuando la imagen seleccionada sea la primera de la lista.
- Al hacer click en el botón Aumentar, se agrandará el tamaño de la imagen seleccionada.
- Al hacer click en el botón Disminuir, se reducirá el tamaño de la imagen seleccionada.
- Al hacer click en el botón Play, se “pondrá en marcha el reproductor”, es decir, la imagen seleccionada empezará a cambiar cada 2 segundos. Cuando el reproductor llegue a la última imagen volverá a empezar por la primera.
- Al hacer click en el botón Stop, se detendrá el reproductor, es decir, la imagen seleccionada dejará de cambiar cada 2 segundos.
- El botón de Stop solamente se mostrará cuando esté en marcha el reproductor.
- El botón de Play solamente se mostrará cuando el reproductor esté detenido.

RETOS

- Remarcar con estilos css la imagen de la lista que corresponda con la imagen actualmente seleccionada

- Paginar el listado de imágenes. En vez de mostrar todas las imágenes de golpe, mostrarlas de 3 en 3. Añadir un botón Anterior y otro siguiente para avanzar o retroceder de “página” en el listado.

Ayuda: La pipe slice trocea un array
Ejemplo: En 

```html
<img *ngFor="let image of images | slice:3:6" />
```

la pipe slice haría return de los elementos 3, 4 y 5 del array images.

- slice:0:3 => Empezaría en el 0 y terminaría en el 3 pero sin incluir el 3.
- slice:3:6 => Empezaría en el 3 y terminaría en el 6 pero sin incluir el 6.
- slice:6:9 => Empezaría en el 6 y terminaría en el 9 pero sin incluir el 9.

Directiva: Rotate

Crear una directiva para rotar imágenes.

En este ejercicio se practica:

- Creación de una directiva personalizada
- Parametrización de directivas con @Input
- Binding de eventos con @HostListener
- Ciclo de vida: ngOnInit()

Ejemplo modelo: <https://carherco.es/curso-angular/#/rotate>

(Este ejemplo modelo es similar pero no es exacto. Es para tener una idea. Lo que se pide realmente es lo que está escrito en el enunciado de este documento).

El interfaz de uso de la directiva sería el siguiente:

```html
<img rotate src="..."/>
<img rotate="45" src="..."/>
<img rotate="45" step="15" src="..."/>
```

- Al hacer click en una imagen que tenga el atributo rotate, la imagen deberá rotar los grados indicados en el atributo step.
- Por defecto rotará en pasos de 10 grados
- Se le podrá indicar una rotación inicial en el propio atributo rotate
- Si se hace click en la imagen con la tecla mayúsculas pulsada, la imagen rotará hacia el lado contrario.

AYUDA: La propiedad transform de css permite establecer una rotación para un elemento del DOM.
Ejemplo: Esta declaración css

```css
img {
  transform: rotate(20deg);
}
```

mostraría los elementos img girados 20 grados.

RETO:
Prueba esta directiva en elementos que no sean imágenes (un h1, un div un p…), verás que también pueden ser rotados con esta directiva.

- Modifica el selector de la directiva para que solamente afecte a elementos img.

## OPCIONAL: Uso de RxJs

1; Modifica el método login() del servicio del primer ejercicio para que devuelva la respuesta de forma asíncrona en un observable.

El servicio quedaría así:

- login({username: string, password: string}): Observable\<boolean>
- logout(): void
- isLogged(): boolean
- getUsername(): string

AYUDA: Cambia el return true o return false por return of(true) o return of(false).
(import {of} from ‘rxjs’)

2; Adapta el componente de login.

- La respuesta de login() ya no llega directamente como boolean, sino como observable. El componente tendrá que suscribirse al observable para conocer si el login ha ido bien o no.

3; Simula un delay en la respesta del login

AYUDA: Cambia el return of(true) y return of(false) por:

```ts
import {delay} from ‘rxjs’;
return of(true).pipe( delay(2000) );
return of(false).pipe( delay(2000) );
```

4; Pon un indicador (un gif de loading) en el formulario de login que se muestre al darle al botón de submit y desaparezca cuando el método de login haya emitido su respuesta.

AYUDA: Como el observable emite un dato y acto seguido directamente la señal de completado/fin, puedes utilizar tanto la primera función del subscribe (la del next) como la tercera función del subscribe (la del completed) para esconder el gif.
