# 01 Creación de componentes

Todo framework de front debe permitir la creación de componentes personalizados y reutilizables.

En esta sección vamos a ver cómo implementa angular los componentes web con el mismo ejemplo que vimos en la session de WebComponents siguiendo la misma ruta de crear el componente, crear atributos custom, crear eventos custom y encapsular los estilos.

## Resumen

Este ejemplo toma como punto de partida el código base y crearemos el mismo componente creado en la sesión de WebComponents.

Qué vamos a aprender en este ejemplo:

- Crear un componente
- Crear atributos custom al componente con el decorador @Input
- Crear eventos custom con el decorador @Output
- Encapsulación de estilos

Pasos:

## Paso a Paso

- Primero copiamos el código base, y hacemos un _npm install_

```bash
npm install
```

- Encendemos la aplicación:

```bash
ng serve
```

- Creamos un componente _search_ dentro de un directorio todavía inexistente llamado _utils_

```bash
ng g c utils/search
```

- Incluimos el componente en la página de nuestra aplicación

Abrimos el fichero .ts del componente recién creado (_src/app/utils/search.component.ts_) y nos fijamos en cuál es su selector. (_app-search_).

Actualizamos el import en `app.component.ts`

_src/app/app.component.ts_

```diff
@Component({
  selector: 'app-root',
  standalone: true,
- imports: [CommonModule, RouterOutlet, MenuComponent],
+ imports: [CommonModule, RouterOutlet, MenuComponent, SearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
```

Abrimos el fichero `app.component.html` y ponemos el tag donde queramos que aparezca nuestro componente.

_src/app/app.component.html_

```diff
<h1>Hola Mundo</h1>

<app-menu></app-menu>

+ <app-search></app-search>
```

En la pantalla se verá el contenido por defecto del componente Search:

>  search works!

Colocamos el html del componente en el fichero _search.component.html_ y el css del componente en el fichero _search.component.scss_

¡Y listo!. El componente debería verse en la pantalla.

### Creación de atributos custom

Actualizamos `src/app/utils/search/search.component.ts`

- Usamos el decorador `@Input` para crear tantos atributos custom como queramos

```ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  @Input() ph = 'Buscar...';
  @Input() label = 'Buscar: ';

  name = 'Paco'
  // ...
```

Enlazamos las propiedades de clase en el template, actualizando `src/app/utils/search/search.component.ts`:

```html
<p>{{ label }}</p>

<div class="container">
  <input type="text" [placeholder]="ph" [value]="name" class="field" />
  <div class="icons-container">
      <div class="icon-search"></div>
  </div>
</div>
```

Y listo, ya podemos utilizar los atributos en `src/app/app.component.html`

```html
<h1>Hola Mundo</h1>

<app-menu></app-menu>

<app-search ph="Search..." [label]="title"</app-search>
```

### Creación de eventos custom

Actualizamos `src/app/utils/search/search.component.ts`

- Usamos el decorador `@Output` para crear tantos eventos custom como queramos:

```ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  @Input() ph = 'Buscar...';
  @Input() label = 'Buscar: ';

  name = 'Paco';

  @Output() clickEnLupa: EventEmitter<string> = new EventEmitter();
  @Output() otroEvento = new EventEmitter();
}

```

El decorador `@Output` provoca que la etiqueta `app-search` disponga de un evento llamado _clickEnLupa_ y otro evento llamado _otroEvento_ a los que el padre podrá poner listeners.

Actualizamos `src/app/app.component.html`

```html
<h1>Hola Mundo</h1>

<app-menu></app-menu>

<app-search ph="Search..." [label]="title" (clickEnLupa)="escribeLog($event)"></app-search>   
```

Actualizamos `src/app/app.component.ts`

```ts
export class AppComponent {
  title = 'app';

  escribeLog($event: string) {
    console.log($event);
  }
}

```

Solamente queda que el componente Search dispare eventos _clickEnLupa_ y _otroEvento_ cuando crea oportuno, mandando en dicho evento información asociada a los mismos.

Actualizamos `src/app/utils/search/search.component.html`

Por ejemplo, al hacer click en la lupa del componente Search podemos poner un listener en dicho componente:

```html
<p>{{ label }}</p>

<div class="container">
  <input type="text" [placeholder]="ph" [value]="name" class="field" />
  <div class="icons-container">
      <div class="icon-search" (click)="changeName()"></div>
  </div>
</div>
```

Y que el listener del componente dispare el evento _clickEnLupa_ mandando como información asociada el value del input.

Actualizamos `src/app/utils/search/search.component.ts`

```ts
export class SearchComponent {
  @Input() ph = 'Buscar...';
  @Input() label = 'Buscar: ';

  name = 'Paco';

  @Output() clickEnLupa: EventEmitter<string> = new EventEmitter();
  @Output() otroEvento = new EventEmitter();
  /*diff*/
  changeName() {
    this.name = 'Francisco';
    this.clickEnLupa.emit(this.name);
  }
  /*diff*/
}

```

### Encapsulación de los estilos

Angular encapsula por defecto los estilos, con lo que no tenemos que preocuparnos de ello. No obstante se pueden configurar 3 formas de encapsulación:

- Encapsulación por defecto (Emulated)
- Encapsulación nativa (ShadowDom)
- Sin encapsulación (None)

https://angular.io/guide/view-encapsulation

Por último vamos aplicar estilos, actualizamos `src/app/utils/search/search.component.css`

```css

p {
  color: blue;
}

.container {
  position: relative;
  padding: 0;
  margin: 0;
  border: 0;
  width: 150px;
  height: 30px;
}

.field {
  width: 100%;
  height: 100%;
  border-radius: 3px;
}

.icons-container {
  position: absolute;
  top: 5px;
  right: -10px;
  width: 30px;
  height: 30px;
}

.icon-search {
  position: relative;
  width: 50%;
  height: 50%;
  opacity: 1;
  border-radius: 50%;
  border: 3px solid #c7d0f8;
}

.icon-search:after {
  content: "";
  position: absolute;
  bottom: -9px;
  right: -2px;
  width: 4px;
  border-radius: 3px;
  transform: rotate(-45deg);
  height: 10px;
  background-color: #c7d0f8;
}

```