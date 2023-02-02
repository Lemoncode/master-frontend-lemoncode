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

Abrimos el fichero app.component.html y ponemos el tag donde queramos que aparezca nuestro componente.

_src/app/app.component.html_

```diff
<h1>Hola Mundo</h1>

<app-menu></app-menu>

+ <app-search></app-search>
```

En la pantalla se verá el contenido por defecto del componente Search:

> app search works!

Colocamos el html del componente en el fichero _search.component.html_ y el css del componente en el fichero _search.component.scss_

¡Y listo!. El componente debería verse en la pantalla.

### Creación de atributos custom

- Usamos el decorador @Input para crear tantos atributos custom como queramos

```ts
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Input() ph = 'Buscar...';
  @Input() label = 'Buscar: ';
  // ...
```

Los bindeamos en el html del componente

```html
<p>{{ label }}</p>

<div class="container">
  <input type="text" [placeholder]="ph" [value]="name" class="field" />
  <div class="icons-container">
      <div class="icon-search"></div>
  </div>
</div>
```

Y listo, ya podemos utilizar los atributos

```html
<h1>Hola Mundo</h1>

<app-menu></app-menu>

<app-search ph="Search..." [label]="labelText"</app-search>
```

### Creación de eventos custom

- Usamos el decorador @Output para crear tantos eventos custom como queramos

```ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Input() ph = 'Buscar...';
  @Input() label = 'Buscar: ';
  name = 'Carlos';

  @Output() clickEnLupa: EventEmitter<string> = new EventEmitter();
  @Output() otroEvento = new EventEmitter();
```

El decorador @Output provoca que la etiqueta app-search disponga de un evento llamado clickEnLupa y otro evento llamado otroEvento a los que el padre podrá poner listeners.

```html
<h1>Hola Mundo</h1>

<app-menu></app-menu>

<app-search ph="Search..." [label]="labelText" (clickEnLupa)="escribeLog($event)"></app-search>   
```

Solamente queda que el componente Search dispare eventos clickEnLupa y otroEvento cuando crea oportuno, mandando en dicho evento información asociada a los mismos.

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

```ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  // ...
  @Output() clickEnLupa: EventEmitter<string> = new EventEmitter();

  // ...

  changeName() {
    this.name = 'Francisco';
    this.clickEnLupa.emit(this.name);
  }
}
```

### Encapsulación de los estilos

Angular encapsula por defecto los estilos, con lo que no tenemos que preocuparnos de ello. No obstante se pueden configurar 3 formas de encapsulación:

- Encapsulación por defecto (Emulated)
- Encapsulación nativa (ShadowDom)
- Sin encapsulación (None)

https://angular.io/guide/view-encapsulation