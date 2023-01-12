# 04 Pipes

## Resumen

Este ejemplo toma como punto de partida el ejemplo 03.

Vamos a crear una pipe para realizar búsquedas sobre la lista de miembros

Qué vamos a aprender en este ejemplo:

- Creación de pipes personalizadas
- Utilización de pipes
- Utilización de variables de plantilla

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

- Creamos una caja para buscar por nombre

_src/app/user/user-list/user-list.component.html_

```diff
<h2>Listado</h2>
<div>
+  <label>Buscar por nombre: </label>
+  <input />
  <table>
    <thead>
      <tr>
        <th appHighlight>Avatar</th>
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
</div>
```

- Creamos una pipe utilizando el CLI

```bash
ng generate pipe pipes/searchByLogin
```

- Programamos la pipe

La función transform de la pipe recibirá la lista de miembros sobre la que realizar la búsqueda y el valor por el que buscar. Devolverá una lista con los miembros cuyo campo contenga el valor buscado.

_src/app/pipes/search-by-login.pipe.ts_

```diff
import { Pipe, PipeTransform } from '@angular/core';
+import { MemberEntity } from '../model/MemberEntity';

@Pipe({
  name: 'searchByLogin'
})
export class SearchByLoginPipe implements PipeTransform {

-  transform(value: unknown, ...args: unknown[]): unknown {
-    return null;
-  }
+  transform(members: MemberEntity[], value: string): MemberEntity[] {
+    return members.filter(
+      member => member.login.toLowerCase().includes(value.toLowerCase())
+    );
+  }

}
```

- Aplicamos la pipe sobre la lista de miembros.

El valor buscado lo obtenemos con una variable de plantilla declarada en el input de búsqueda.

_src/app/user/user-list/user-list.component.html_

```diff
<h2>Listado</h2>
<div>
  <label>Buscar por nombre: </label>
-  <input />
+  <input #search/>
  <table>
    <thead>
      <tr>
        <th appHighlight>Avatar</th>
        <th>Id</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
-        <tr *ngFor="let member of members">
+        <tr *ngFor="let member of members | searchByLogin:search.value ">
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
</div>
```

Pero no ocurre nada, no está filtrando. Angular no encuentra motivo para revisar el html (que es cuando ejecutaría la pipe). 

- Nos bindeamos al evento que nos interese de la caja de búsqueda, para que cuando ocurra el evento Angular revise el html y se ejecute la pipe.

_src/app/user/user-list/user-list.component.html_

```diff
<h2>Listado</h2>
<div>
  <label>Buscar por nombre: </label>
-  <input #search/>
+  <input #search (keyup)="0"/>
  <table>
    <thead>
      <tr>
        <th appHighlight>Avatar</th>
        <th>Id</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
        <tr *ngFor="let member of members | searchByLogin:search.value">
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
</div>
```

Y ahora sí, con cada pulsación de tecla, se realiza la búsqueda.
