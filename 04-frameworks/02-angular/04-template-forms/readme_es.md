# 03 Template Forms

## Resumen

Este ejemplo toma como punto de partida el ejemplo 02.

Vamos a crear un formulario para añadir miembros a la lista.

Qué vamos a aprender en este ejemplo:

- Formularios template-driven
- La directiva `ngModel`
- Directivas de atributo para validaciones
- Variables de plantilla
- Resaltar con CSS los campos no válidos
- Mostrar mensajes de error

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

- Añadimos html de formulario de alta

_src/app/user/user-list/user-list.component.html_

```diff
+<h2>Alta</h2>
+<div>
+  <form>
+    <div>
+        <label>Id </label>
+        <input name="id"/>
+    </div>
+    <div>
+        <label>Name </label>
+        <input name="name"/>
+    </div>
+    <div>
+        <label>Avatar </label>
+        <input name="avatar" type="file" accept="image/*"/>
+    </div>
+    <button>Añadir</button>
+  </form>
+</div>

+<h2>Listado</h2>
+<div>
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
+</div>
```

- Creamos una variable en el componente de tipo _MemberEntity_, cuyas propiedades bindearemos con los inputs del formulario, y la inicializamos para no tener errores por intentos de acceso a propiedades de objetos _null_.

_src/app/user/user-list/user-list.component.ts_

```diff
export class UserListComponent implements OnInit {
  members: MemberEntity[] = [];
+ newMember!: MemberEntity;

  ngOnInit(): void {
    fetch('https://api.github.com/orgs/lemoncode/members')
      .then((response) => response.json())
      .then((result) => (this.members = result));
+
+   this.newMember = {
+     id: '',
+     login: '',
+     avatar_url: '',
+   };
  }
}
```

- Usamos la directiva `ngModel` para hacer doble binding con los inputs de id y de nombre, para ello importamos el módulo `FormsModule`

_src/app/user/user-list/user-list.component.ts_

```diff
@Component({
  selector: 'app-user-list',
  standalone: true,
- imports: [NgFor, HighlightDirective],
+ imports: [NgFor, HighlightDirective, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
```

_src/app/user/user-list/user-list.component.html_

```diff
<h2>Alta</h2>
<div>
  <form>
    <div>
        <label>Id </label>
-        <input name="id"/>
+        <input name="id" [(ngModel)]="newMember.id"/>
    </div>
    <div>
        <label>Name </label>
-        <input name="name"/>
+        <input name="name" [(ngModel)]="newMember.login"/>
    </div>
    <div>
        <label>Avatar </label>
        <input name="avatar" type="file" accept="image/*"/>
    </div>
    <button>Añadir</button>
  </form>
</div>
```

- Hacemos binding del evento click del botón con un método en el componente que añada el nuevo miembro a la lista

_src/app/user/user-list/user-list.component.html_

```diff
<h2>Alta</h2>
<div>
  <form>
    <div>
        <label>Id </label>
        <input name="id" [(ngModel)]="newMember.id"/>
    </div>
    <div>
        <label>Name </label>
        <input name="name" [(ngModel)]="newMember.login"/>
    </div>
    <div>
        <label>Avatar </label>
        <input name="avatar" type="file" accept="image/*"/>
    </div>
-    <button>Añadir</button>
+    <button (click)="add()">Añadir</button>
  </form>
</div>
```

_src/app/user/user-list/user-list.component.ts_

```ts
export class UserListComponent implements OnInit {
  members: MemberEntity[] = [];
  newMember!: MemberEntity;
  /*diff*/
  add(): void {
    this.members.push(this.newMember);
    this.newMember = {
      id: '',
      login: '',
      avatar_url: '',
    };
  }
  /*diff*/
  ngOnInit(): void {
    fetch('https://api.github.com/orgs/lemoncode/members')
      .then((response) => response.json())
      .then((result) => (this.members = result));

    this.newMember = {
      id: '',
      login: '',
      avatar_url: '',
    };
  }
}
```

- Añadimos validaciones con directivas de atributo (`required`, `min`, `max`, `minlength`, `maxlength`, `email`, `pattern`...)

_src/app/user/user-list/user-list.component.html_

```diff
<h2>Alta</h2>
<div>
  <form>
    <div>
        <label>Id </label>
-        <input name="id" [(ngModel)]="newMember.id"/>
+        <input name="id" [(ngModel)]="newMember.id" required/>
    </div>
    <div>
        <label>Name </label>
-        <input name="name" [(ngModel)]="newMember.login"/>
+        <input name="name" [(ngModel)]="newMember.login" required minlength="6"/>
    </div>
    <div>
        <label>Avatar </label>
        <input name="avatar" type="file" accept="image/*"/>
    </div>
    <button (click)="add()">Añadir</button>
  </form>
</div>
```

- Aprovechamos las clases `ng-xxxxx` que pone `ngModel` a los input para dar estilos CSS según el estado de validez de los campos

_src/app/user/user-list/user-list.component.css_

```css
.ng-valid[required], .ng-valid.required  {
  border-left: 5px solid #42A948;
}

.ng-invalid:not(form)  {
  border-left: 5px solid #a94442;
}
```

- Utilizamos template reference variables (extendidas de la clase `ngModel`) para incluir mensajes de error

_src/app/user/user-list/user-list.component.ts_

```diff
import { Component, OnInit } from '@angular/core';
import { MemberEntity } from '../../model';
-import { NgFor } from '@angular/common';
+import { NgFor, NgIf } from '@angular/common';
import { HighlightDirective } from '../../directives/highlight.directive';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
- imports: [NgFor, HighlightDirective, FormsModule],
+ imports: [NgFor, HighlightDirective, FormsModule, NgIf],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
```


_src/app/user/user-list/user-list.component.html_

```diff
<h2>Alta</h2>
<div>
  <form>
    <div>
        <label>Id </label>
-        <input name="id" [(ngModel)]="newMember.id" required/>
+        <input name="id" [(ngModel)]="newMember.id" required #id="ngModel"/>
+        <div *ngIf="id.invalid && id.touched">El id es obligatorio</div>
    </div>
    <div>
        <label>Name </label>
-        <input name="name" [(ngModel)]="newMember.login" required minLength="6"/>
+        <input name="name" [(ngModel)]="newMember.login" required minlength="6" #name="ngModel"/>
+        <div *ngIf="name.invalid && name.touched">
+          <div *ngIf="name.errors!['required']">El nombre es obligatorio</div>
+          <div *ngIf="name.errors!['minlength']">El nombre debe tener {{ name.errors!['minlength'].requiredLength }} caracteres mínimo. Tiene sólamente {{ name.errors!['minlength'].actualLength }}</div>
+        </div>
    </div>
    <div>
        <label>Avatar </label>
        <input name="avatar" type="file" accept="image/*"/>
    </div>
    <button (click)="add()">Añadir</button>
  </form>
</div>
```

- Utilizamos otra variable de plantilla (esta vez extendida de la directiva `ngForm`) para deshabilitar el botón si algún campo no es válido:

_src/app/user/user-list/user-list.component.html_

```diff
<h2>Alta</h2>
<div>
-  <form>
+  <form #addForm="ngForm">
    <div>
        <label>Id </label>
        <input name="id" [(ngModel)]="newMember.id" required #id="ngModel"/>
        <div *ngIf="id.invalid && id.touched">El id es obligatorio</div>
    </div>
    <div>
        <label>Name </label>
        <input name="name" [(ngModel)]="newMember.login" required minlength="6" #name="ngModel"/>
        <div *ngIf="name.invalid && name.touched">
          <div *ngIf="name.errors.required">El nombre es obligatorio</div>
          <div *ngIf="name.errors.minlength">El nombre debe tener {{ name.errors.minlength.requiredLength }} caracteres mínimo. Tiene sólamente {{ name.errors.minlength.actualLength }}</div>
        </div>
    </div>
    <div>
        <label>Avatar </label>
        <input name="avatar" type="file" accept="image/*"/>
    </div>
-    <button (click)="add()">Añadir</button>
+    <button [disabled]="addForm.invalid" (click)="add()">Añadir</button>
  </form>
</div>
```

- El contenido de la propiedad value de un input de tipo file no se puede bindear con la propiedad `avatar_url` porque en nuestro caso no contienen el mismo tipo de información. Gestionamos el input file "manualmente" con el evento _change_ y un poco de javascript en el componente.

_src/app/user/user-list/user-list.component.html_

```diff
<h2>Alta</h2>
<div>
  <form #addForm="ngForm">
    <div>
        <label>Id </label>
        <input name="id" [(ngModel)]="newMember.id" required #id="ngModel"/>
        <div *ngIf="id.invalid && id.touched">El id es obligatorio</div>
    </div>
    <div>
        <label>Name </label>
        <input name="name" [(ngModel)]="newMember.login" required minlength="6" #name="ngModel"/>
        <div *ngIf="name.invalid && name.touched">
          <div *ngIf="name.errors.required">El nombre es obligatorio</div>
          <div *ngIf="name.errors.minlength">El nombre debe tener {{ name.errors.minlength.requiredLength }} caracteres mínimo. Tiene sólamente {{ name.errors.minlength.actualLength }}</div>
        </div>
    </div>
    <div>
        <label>Avatar </label>
-        <input name="avatar" type="file" accept="image/*"/>
+        <input name="avatar" (change)="handleFileInput($event)" type="file" accept="image/*"/>
+        <div><img [src]="newMember.avatar_url" width="50" /></div>
    </div>
    <button [disabled]="addForm.invalid" (click)="add()">Añadir</button>
  </form>
</div>
```


_src/app/user/user-list/user-list.component.ts_

```diff
export class UserListComponent implements OnInit {
  members: MemberEntity[] = [];
  newMember!: MemberEntity;

  add(): void {
    this.members.push(this.newMember);
    this.newMember = {
      id: '',
      login: '',
      avatar_url: '',
    };
  }
+
+ handleFileInput($event: any) {
+   const files = $event.target.files as FileList;
+   const reader = new FileReader();
+   reader.readAsDataURL(files[0]);
+   reader.onload = () => {
+     this.newMember.avatar_url = reader.result as string;
+   };
+ }
+
  ngOnInit(): void {
    fetch('https://api.github.com/orgs/lemoncode/members')
      .then((response) => response.json())
      .then((result) => (this.members = result));

    this.newMember = {
      id: '',
      login: '',
      avatar_url: '',
    };
  }
}
```
