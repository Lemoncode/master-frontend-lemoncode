# 01 Listado de usuarios

## Resumen

Este ejemplo toma como punto de partida una aplicación recién creada.

Vamos a pedirle a la API de Github la lista de miembros que pertenece a una
organización y vamos a mostrarla por pantalla.

Que vamos a aprender en este ejemplo:

- Cómo crear un componente de visualización
- Cómo hacer una llámada asícnrona para pedir datos a una api remota.
- Cómo iterar y mostrar una lista de resultados con la directiva estructural `*ngFor`

También aprenderemos posteriormente la librería de Angular para realizar peticiones a APIs remotas.

Pasos:

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

> NOTA: Podemos usar `npm ci` de esta forma instalaremos las dependencias existentes en `package-lock.json` en vez de regenerarlas.

- Arrancamos la aplicación:

```bash
ng serve
```

- Si queremos ver que tipo de datos vamos a manejar, podemos abrir el navegador web y ver que devuelve la API Rest de Github

```bash
https://api.github.com/orgs/lemoncode/members
```

- Creamos nuestro modelo

Creamos un directorio _model_ dentro de _src/app_ y en dicho directorio creamos un fichero _model.ts_ con el interfaz de nuestro modelo:

_./src/app/model/index.ts_

```typescript
export interface MemberEntity {
  avatar_url: string;
  id: string;
  login: string;
}
```

- Utilizamos el CLI de Angular para crear el componente

```bash
ng g c user/user-list
```

- Incluimos el componente en la página de nuestra aplicación

Abrimos el fichero .ts del componente recién creado (_src/app/user/user-list/user-list.component.ts_) y nos fijamos en cuál es su selector. (_app-user-list_).

Abrimos el fichero app.component.html y ponemos el tag donde queramos que aparezca nuestro componente.

_src/app/app.component.ts_

```diff
@Component({
  selector: 'app-root',
  standalone: true,
- imports: [CommonModule, RouterOutlet, MenuComponent, SearchComponent],
  imports: [
    CommonModule,
    RouterOutlet,
    MenuComponent,
    SearchComponent,
+   UserListComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
```

_src/app/app.component.html_

```diff
<h1>Hola Mundo</h1>

<app-menu></app-menu>

-<app-search ph="Search..." [label]="title" (clickEnLupa)="escribeLog($event)"></app-search> 

+ <app-user-list></app-user-list>
```

Y comprobamos en el navegador que el componente aparece en la pantalla.

- HTML de partida

Creamos el HTML necesario para mostrar una lista de usuarios. El siguiente código podría valer como ejemplo:

_src/app/user/user-list/user-list.component.html_

```html
<table>
  <thead>
    <tr>
      <th>Avatar</th>
      <th>Id</th>
      <th>Name</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>
          <!-- <img [src]="xxxxxxxx" /> -->
        </td>
        <td>
          <span>xxxxxxxx</span>
        </td>
        <td>
          <span>xxxxxxxx</span>
        </td>
      </tr>
  </tbody>
</table>
```

- Obtener la lista de miembros

El HTML necesita los datos de los miembros.

Recordemos que en Angular la plantilla (html) de un componente tiene acceso a las propiedades públicas y métodos públicos de SU clase componente (ts).

Por lo tanto la misión del ts será conseguir la lista de miembros y guardarla en una propiedad pública de su clase.

_src/app/user/user-list/user-list.component.ts_

```ts
import { Component, OnInit } from '@angular/core';
import { MemberEntity } from '../../model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  members: MemberEntity[] = [];

  ngOnInit(): void {
    fetch('https://api.github.com/orgs/lemoncode/members')
      .then((response) => response.json())
      .then((result) => (this.members = result));
  }
}

```

- Iterar la lista en el html para mostrar los datos.

Para ello debemos importar primero la directiva en nuestro componente

_src/app/user/user-list/user-list.component.ts_

```diff
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
+   NgFor
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
```

Con la directiva estructural *ngFor recorremos el listado de miembros

_src/app/user/user-list/user-list.component.html_

```diff
<table className="table">
  <thead>
    <tr>
      <th>Avatar</th>
      <th>Id</th>
      <th>Name</th>
    </tr>
  </thead>
  <tbody>
-      <tr>
-        <td>
-          <img [src]="xxxxxxxx" />
-        </td>
-        <td>
-          <span>xxxxxxxx</span>
-        </td>
-        <td>
-          <span>xxxxxxxx</span>
-        </td>
-      </tr>
+      <tr *ngFor="let member of members">
+        <td>
+          <img [src]="member.avatar_url" />
+        </td>
+        <td>
+          <span>{{member.id}}</span>
+        </td>
+        <td>
+          <span>{{member.login}}</span>
+        </td>
+      </tr>
  </tbody>
</table>
```

Añadimos estilos para visualizar mejor los elementos de la tabl:

_src/app/user/user-list/user-list.component.css_

```css
/* Estilos generales para la tabla */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px; /* Ajusta el margen según sea necesario */
}

/* Estilos para las celdas del encabezado */
th {
  background-color: #f2f2f2; /* Color de fondo del encabezado */
  padding: 10px;
  text-align: left;
}

/* Estilos para las celdas del cuerpo de la tabla */
td {
  padding: 10px;
  border-bottom: 1px solid #ddd; /* Línea divisoria entre filas */
}

/* Estilos para las imágenes dentro de las celdas */
img {
  max-width: 50px; /* Ajusta el tamaño máximo de las imágenes */
  border-radius: 50%; /* Borde redondeado para las imágenes */
}

/* Estilos para las filas impares, para mejorar la legibilidad */
tbody tr:nth-child(odd) {
  background-color: #f9f9f9; /* Fondo alternativo para filas impares */
}

```

Y ya está: _members_ empieza siendo una lista vacía [] y en el html se reflejará por lo tanto una tabla sin filas, pero en cuanto la petición a la API devuelva datos y los guardemos en la propiedad members del ts, Angular actualizará el HTML y veremos los datos en la pantalla.
