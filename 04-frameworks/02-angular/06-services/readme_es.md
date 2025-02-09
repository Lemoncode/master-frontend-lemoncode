# 05 Servicios

## Resumen

Este ejemplo toma como punto de partida el ejemplo 04.

Vamos a crear un servicio que se encargue de conseguir la lista de miembros:

Qué vamos a aprender en este ejemplo:

- Creación de servicios
- Inyección de servicios

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

- Creamos un servicio con el CLI

```bash
ng generate service services/members
```

- Programamos el servicio

Creamos un método que nos devuelva una promesa de la lista de miembros.

_src/app/services/members.service.ts_

```diff
import { Injectable } from '@angular/core';
+import { MemberEntity } from '../model/MemberEntity';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  constructor() { }

+  getAll(): Promise<MemberEntity[]> {
+    return fetch(`https://api.github.com/orgs/lemoncode/members`)
+                .then((response) => response.json());
+  }
}
```

- Inyectamos el servicio en el componente

_src/app/user/user-list/user-list.component.ts_

```diff
import { Component, OnInit } from '@angular/core';
import { MemberEntity } from '../../model';
import { NgFor, NgIf } from '@angular/common';
import { HighlightDirective } from '../../directives/highlight.directive';
import { FormsModule } from '@angular/forms';
import { SearchByLoginPipe } from '../../pipes/search-by-login.pipe';
+import { MembersService } from '../../services/members.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [NgFor, HighlightDirective, FormsModule, NgIf, SearchByLoginPipe],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  members: MemberEntity[] = [];
  newMember!: MemberEntity;

+ constructor(private membersService: MembersService) {}

```

- Pedimos los usuarios al servicio en vez de cogerlos directamente en el componente:

_src/app/user/user-list/user-list.component.ts_

```diff
  ngOnInit(): void {
-   fetch('https://api.github.com/orgs/lemoncode/members')
-     .then((response) => response.json())
-     .then((result) => (this.members = result));
+   this.membersService.getAll().then((members) => (this.members = members));
+
    this.newMember = {
      id: '',
      login: '',
      avatar_url: '',
    };
  }
```
