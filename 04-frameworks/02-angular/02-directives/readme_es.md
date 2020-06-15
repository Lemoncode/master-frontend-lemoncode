# 02 Directiva de atributo

## Resumen

Este ejemplo toma como punto de partida el ejemplo 01.

Vamos a crear una directiva que **resalte elementos HTML** al pasar el ratón por encima del elemento. La directiva nos permitirá elegir el color de resaltado.

Qué vamos a aprender en este ejemplo:

- Cómo crear una directiva personalizada
- Cómo parametrizar una directiva

Pasos:

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Encendemos la aplicación:

```bash
ng serve
```

- Utilizamos el CLI de Angular para crear la directiva

```bash
ng g d directives/highlight
```

Este es el archivo geneado por el CLI

_src/app/directives/highlight.ts_

```ts
import { Directive } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  constructor() { }

}
```

Como se puede apreciar, una directiva es una clase decorada con la función decoradora @Directive.

El objeto de metadatos de este decorador es simple, un objeto con una propiedad _selector_ en el que, con sintaxis de selectores css, configuramos qué elementos van a verse afectados por esta directiva.

Con el decorador del ejemplo anterior le decimos a Angular que debe aplicar esta directiva a todos los  elementos del DOM que tengan el ATRIBUTO _appHighlight_.

- Ponemos la directiva en los elementos html en los que queramos que se aplique. Voy a poner la directiva en un elemento del listado de usuarios y en otro elemento del menú.

_src/app/user/user-list/user-list.component.html_

```diff
<table>
  <thead>
    <tr>
-      <th>Avatar</th>
+      <th appHighlight>Avatar</th>
      <th>Id</th>
      <th>Name</th>
    </tr>
  </thead>
  <tbody>
      <tr *ngFor="let member of members">
        <td>
          <img [src]="member.avatar_url" width="30" />
        </td>
        <td>
          <span>{{ member.id }}</span>
        </td>
        <td>
          <span>{{ member.login }}</span>
        </td>
      </tr>
  </tbody>
</table>
```

_src/app/layout/menu/menu.component.html_

```diff
- <p>menu works!</p>
+ <p appHighlight>menu works!</p>
```

Angular aplicará la directiva tanto al th del listado de usuarios como al p del menú.

- Programamos la directiva

La potencia que tienen las directivas de atributo es que Angular les puede pasar como argumento del constructor una _referencia_ al elemento sobre el que se está aplicando.

_src/app/directives/highlight.ts_

```diff
- import { Directive } from '@angular/core';
+ import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

-  constructor() { }
+  constructor(el: ElementRef) { }

}
```

De esta forma, tendremos en la variable _el_ una referencia al elemento th en el caso del listado de usuarios y una referencia al elemento p en el caso del menú.

ElementRef tiene una única propiedad, _nativeElement_, que nos da acceso al elemento en sí. A través de nativeElement podemos acceder y modificar cualquier atributo de elemento en cuestión.

Vamos a modificar el valor de style.backgroundColor:

_src/app/directives/highlight.ts_

```diff
import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

-  constructor(el: ElementRef) { }
+  constructor(el: ElementRef) {
+    el.nativeElement.style.backgroundColor = 'lightblue';
+  }

}
```

Si miramos el navegador veremos que Angular a cambiado el valor de style.backgroundColor a todos los elementos que tengan el atributo _appHighlight_.

- Modificar la directiva para que solamente se resalte cuando pongamos el ratón encima del elemento

Vamos a reescribir la directiva para que los elementos no estén resaltados de inicio, sino que se resalten cuando el ratón se ponga encima de ellos. 

Para ello, desde la directiva vamos a escuchar el evento _mouseenter_ de los elementos afectados por la directiva. 

Esto lo hacemos con el decorador **@HostListener**. Este decorador configura un método para ser el _listener_ de un evento ocurrido en el elemento del DOM que haga de anfitrión (_host_) de la directiva.

```diff
- import { Directive, ElementRef } from '@angular/core';
+ import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  constructor(el: ElementRef) {
-
  }

+  @HostListener('mouseenter')
+  onMouseEnterEvent() {
+    el.nativeElement.style.backgroundColor = 'lightblue';
+  }

}
```

Y para que desde onMouseEnterEvent() podamos acceder a la referencia (_el_) que llega a través del constructor, almacenamos la variable _el_ en una propiedad de la clase.

```diff
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

+  private el: ElementRef;
  constructor(el: ElementRef) {
+    this.el = el;
  }

  @HostListener('mouseenter')
  onMouseEnterEvent() {
-    el.nativeElement.style.backgroundColor = 'lightblue';
+    this.el.nativeElement.style.backgroundColor = 'lightblue';
  }

}
```

Aprovechándonos de los **constructores breves** que nos aporta el lenguaje  typescript, podemos ahorrarnos un par de líneas en el código si indicamos la visibilidad (public/private) en el propio argumento del constructor

```diff
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

-  private el: ElementRef;
-  constructor(el: ElementRef) {
-    this.el = el;
-  }

+  constructor(private el: ElementRef) { }

  @HostListener('mouseenter')
  onMouseEnterEvent() {
    this.el.nativeElement.style.backgroundColor = 'lightblue';
  }

}
```

Podemos comprobar que los elementos se resaltan cuando el ratón se ponga encima del elemento.

- Modificar la directiva para que solamente se resalte cuando pongamos el ratón encima del elemento

De forma análoga podemos programar que el elemento deje de estar resaltado cuando el ratón salga del área ocupada por el elemento.

```diff
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter')
  onMouseEnterEvent() {
    this.el.nativeElement.style.backgroundColor = 'lightblue';
  }

  @HostListener('mouseleave')
  onMouseLeaveEvent() {
    this.el.nativeElement.style.backgroundColor = '';
  }

}
```

- Refactorización

Quitamos algo de código repetido y nos llevamos ese _magic value_ que es 'lightblue' a un lugar que sea más accesible y rápido de identificar.


```diff
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

+  color = 'lightblue';
  constructor(private el: ElementRef) { }

+  private highlight(color: string) {
+    this.el.nativeElement.style.backgroundColor = color;
+  }

  @HostListener('mouseenter')
  onMouseEnterEvent() {
-    this.el.nativeElement.style.backgroundColor = 'lightblue';
+    this.highlight(this.color);
  }

  @HostListener('mouseleave')
  onMouseLeaveEvent() {
-    this.el.nativeElement.style.backgroundColor = '';
+    this.highlight('');
  }

}
```

- Aplicamos el decorador @Input para parametrizar el color de resaltado

Con otro decorador llamado @Input podemos configurar una propiedad de nuestra clase HighlightDirective para que su valor pueda ser establecido desde fuera.

```diff
- import { Directive, ElementRef, HostListener } from '@angular/core';
+ import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

-  color = 'lightblue';
+  @Input()
+  private color;
  
  constructor(private el: ElementRef) { }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }

  @HostListener('mouseenter')
  onMouseEnterEvent() {
    this.highlight(this.color);
  }

  @HostListener('mouseleave')
  onMouseLeaveEvent() {
    this.highlight('');
  }

}
```

Este decorador @Input hace que los elementos afectados por appHighlight dispongan de un nuevo atributo, llamado _color_ (mismo nombre que la propiedad decorada con @Input). El valor del atributo color en el html se establecerá como valor de la propiedad en la directiva.

_src/app/user/user-list/user-list.component.html_

```diff
<table>
  <thead>
    <tr>
-      <th>Avatar</th>
+      <th appHighlight color="red">Avatar</th>
      <th>Id</th>
      <th>Name</th>
    </tr>
  </thead>
  <tbody>
      <tr *ngFor="let member of members">
        <td>
          <img [src]="member.avatar_url" width="30" />
        </td>
        <td>
          <span>{{ member.id }}</span>
        </td>
        <td>
          <span>{{ member.login }}</span>
        </td>
      </tr>
  </tbody>
</table>
```

_src/app/layout/menu/menu.component.html_

```diff
- <p>menu works!</p>
+ <p appHighlight color="green">menu works!</p>
```

Turno de probarlo.

- Ponemos un color por defecto

Con un poco de javascript podemos elegir un color por defecto en caso de que no se haya usado el atributo color.

```diff
- import { Directive, ElementRef, HostListener } from '@angular/core';
+ import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  @Input()
  private color;
  
+  private defaultColor = 'lightblue';

  constructor(private el: ElementRef) { }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }

  @HostListener('mouseenter')
  onMouseEnterEvent() {
-    this.highlight(this.color);
+    this.highlight(this.color || this.defaultColor);
  }

  @HostListener('mouseleave')
  onMouseLeaveEvent() {
    this.highlight('');
  }

}
```

Podemos tener tantas propiedades decoradas con @Input() como queramos.

Cabe recordar que podemos utilizar binding en el html para asociar propiedades/atributos con propiedades del typescript del componente:

_src/app/layout/menu/menu.component.html_

```html
- <p appHighlight color="green">menu works!</p>
+ <p appHighlight [color]="variableColorEnElTS">menu works!</p>
```

Así hacemos que sea el typescript del componente el que decida cuál es el color con el que la directiva debe resaltar el elemento.

- Aprovechar el propio atributo de la directiva como @Input para el color.

El decorador @Input permite realizar la asociación aunque los nombres del atributo html y de la propiedad de la directiva no coincidan. Por ejemplo:

_src/app/layout/menu/menu.component.html_

```html
 <p appHighlight colorResaltado="green">menu works!</p>
```

```ts
export class HighlightDirective {

+  @Input('colorResaltado')
  private color;
```

Esto se suele utilizar para aprovechar el propio atributo appHighlight para pasar uno de los parámetros que tengamos con @Input.

_src/app/layout/menu/menu.component.html_

```diff
- <p appHighlight color="green">menu works!</p>
+ <p appHighlight="green">menu works!</p>
```

```diff
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

-  @Input()
+  @Input('appHighlight')
  private color;

  private defaultColor = 'lightblue';

  constructor(private el: ElementRef) { }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }

  @HostListener('mouseenter')
  onMouseEnterEvent() {
    this.highlight(this.color || this.defaultColor);
  }

  @HostListener('mouseleave')
  onMouseLeaveEvent() {
    this.highlight('');
  }

}
```

