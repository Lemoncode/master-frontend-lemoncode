# 08 Comunicación entre componentes padre-hijo

## Resumen

Este ejemplo toma como punto de partida el ejemplo 07.

Vamos a llevarnos el formulario de edición a otro componente distinto. Esto nos obligará a que el componente del listado y el del formulario de edición tengan que comunicarse entre ellos.

Qué vamos a aprender en este ejemplo:

- Parametrización de componentes con el decorador `@Input`
- Emisión de eventos con el decorador `@Output`

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

- Creamos un componente user-edit

```bash
ng g c user/user-edit
```

- Quitamos de user-list el html relativo a la edición de los usuarios:

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
        <input name="avatar" (change)="handleFileInput($event.target.files)" type="file" accept="image/*"/>
        <div><img [src]="newMember.avatar_url" width="50" /></div>
    </div>
    <button [disabled]="addForm.invalid" (click)="add()">Añadir</button>
  </form>
</div>

<h2>Listado</h2>
<div>
  <label>Buscar por nombre: </label>
  <input #search (keyup)="0"/>
  <table>
    <thead>
      <tr>
        <th appHighlight>Avatar</th>
        <th>Id</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
        <tr *ngFor="let member of members | searchByLogin:search.value" (click)="select(member)">
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

-<div>
-  <h2>Datos de {{ memberSelected?.login }}</h2>
-  <form [formGroup]="editForm">
-    <div>
-        <label>Id</label>
-    </div>
-    <div>
-        <label>Name </label>
-        <input name="name" [formControl]="loginControl"/>
-        <div *ngIf="loginControl.invalid">
-          <div *ngIf="loginControl.errors.required">El nombre es obligatorio</div>
-          <div *ngIf="loginControl.errors.minlength">
-            El nombre debe tener {{ loginControl.errors.minlength.requiredLength }} caracteres mínimo.
-            Tiene sólamente {{ loginControl.errors.minlength.actualLength }}
-          </div>
-        </div>
-    </div>
-    <div>
-        <label>Avatar </label>
-        <input name="avatar" type="file" (change)="handleEditFileInput($event.target.files)" accept="image/*"/>
-        <div><img [src]="avatarControl.value" width="50" /></div>
-    </div>
-    <button [disabled]="editForm.invalid" (click)="save()">Guardar</button>
-  </form>
-</div>
```

Y lo ponemos en el user-edit

_src/app/user/user-edit/user-edit.component.html_

```diff
-<p>user-edit works!</p>
+<div>
+  <h2>Datos de {{ memberSelected?.login }}</h2>
+  <br/>{{ editForm.value | json }}
+  <br/>{{ editForm.valid }}
+  <form [formGroup]="editForm">
+    <div>
+        <label>Id</label>
+    </div>
+    <div>
+        <label>Name </label>
+        <input name="name" [formControl]="loginControl"/>
+        <div *ngIf="loginControl.invalid">
+          <div *ngIf="loginControl.errors.required">El nombre es obligatorio</div>
+          <div *ngIf="loginControl.errors.minlength">
+            El nombre debe tener {{ loginControl.errors.minlength.requiredLength }} caracteres mínimo.
+            Tiene sólamente {{ loginControl.errors.minlength.actualLength }}
+          </div>
+        </div>
+    </div>
+    <div>
+        <label>Avatar </label>
+        <input name="avatar" type="file" (change)="handleEditFileInput($event.target.files)" accept="image/*"/>
+        <div><img [src]="avatarControl.value" width="50" /></div>
+    </div>
+    <button [disabled]="editForm.invalid" (click)="save()">Guardar</button>
+  </form>
+</div>
```


- Quitamos del user-list todo el ts relativo a la edición

_src/app/user/user-list/user-list.component.ts_

```diff
import { Component, OnInit } from '@angular/core';
import { MemberEntity } from '../../model';
import { NgFor, NgIf } from '@angular/common';
import { HighlightDirective } from '../../directives/highlight.directive';
import {
- FormBuilder,
- FormControl,
- FormGroup,
  FormsModule,
- ReactiveFormsModule,
- Validators,
} from '@angular/forms';
import { SearchByLoginPipe } from '../../pipes/search-by-login.pipe';
import { MembersService } from '../../services/members.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    NgFor,
    HighlightDirective,
    FormsModule,
    NgIf,
    SearchByLoginPipe,
-   ReactiveFormsModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  members: MemberEntity[] = [];
  newMember!: MemberEntity;
  memberSelected!: MemberEntity;
- editForm!: FormGroup;
- idControl!: FormControl;
- loginControl!: FormControl;
- avatarControl!: FormControl;

  constructor(
    private membersService: MembersService,
-   private fb: FormBuilder
  ) {}

  add(): void {
    this.members.push(this.newMember);
    this.newMember = {
      id: '',
      login: '',
      avatar_url: '',
    };
  }

  handleFileInput($event: any) {
    const files = $event.target.files as FileList;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.newMember.avatar_url = reader.result as string;
    };
  }

  ngOnInit(): void {
-   this.membersService.getAll().then((members) => (this.members = members));
    this.membersService
      .getAll()
      .subscribe((members) => (this.members = members));

    this.newMember = {
      id: '',
      login: '',
      avatar_url: '',
    };

-   this.createEditForm();
  }
-
- createEditForm(): void {
-   this.editForm = this.fb.group({
-     id: ['', Validators.required],
-     login: ['', [Validators.required, Validators.minLength(6)]],
-     avatar_url: '',
-   });
-
-   this.idControl = this.editForm.get('id') as FormControl;
-   this.loginControl = this.editForm.get('login') as FormControl;
-   this.avatarControl = this.editForm.get('avatar_url') as FormControl;
- }
-
  select(member: MemberEntity): void {
    this.memberSelected = { ...member };
-   this.editForm.patchValue(this.memberSelected);
  }
-
- handleEditFileInput($event: any) {
-   const files = $event.target.files as FileList;
-   const reader = new FileReader();
-   reader.readAsDataURL(files[0]);
-   reader.onload = (event) => {
-     this.avatarControl.setValue(reader.result);
-   };
- }
-
- save(): void {
-   if (this.editForm.valid) {
-     this.members = [...this.members];
-     const member = this.editForm.value;
-     const index = this.members.findIndex((i) => i.id === member.id);
-     this.members.splice(index, 1, member);
-   }
- }
}
```

Para ponerlo en el ts del user-edit

_src/app/user/user-edit/user-edit.component.ts_

```ts
import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
})
export class UserEditComponent implements OnInit {
  editForm!: FormGroup;
  idControl!: FormControl;
  loginControl!: FormControl;
  avatarControl!: FormControl;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createEditForm();
  }

  createEditForm(): void {
    this.editForm = this.fb.group({
      id: ['', Validators.required],
      login: ['', [Validators.required, Validators.minLength(6)]],
      avatar_url: '',
    });

    this.idControl = this.editForm.get('id') as FormControl;
    this.loginControl = this.editForm.get('login') as FormControl;
    this.avatarControl = this.editForm.get('avatar_url') as FormControl;
  }

  handleEditFileInput($event: any) {
    const files = $event.target.files as FileList;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.avatarControl.setValue(reader.result);
    };
  }

  save(): void {
    if (this.editForm.valid) {
      // ????????
    }
  }
}

```

Por motivos puramente didácticos, cambiaremos además el nombre de la variable memberSelected por selected en user-edit.

_src/app/user/user-edit/user-edit.component.html_

```diff
-<h2>Datos de {{ memberSelected?.login }}</h2>
+<h2>Datos de {{ member?.login }}</h2>
```

_src/app/user/user-edit/user-edit.component.ts_

```diff
+import { MemberEntity } from '../../model';

// ....

export class UserEditComponent implements OnInit {
+ member!: MemberEntity;
  editForm!: FormGroup;
  idControl!: FormControl;
  loginControl!: FormControl;
  avatarControl!: FormControl;
```

- Incluir el selector de user-edit en el html de user-list

_src/app/user/user-list/user-list.component.ts_

```diff
import { MembersService } from '../../services/members.service';
+import { UserEditComponent } from '../user-edit/user-edit.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    NgFor,
    HighlightDirective,
    FormsModule,
    NgIf,
    SearchByLoginPipe,
+   UserEditComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
// ....
```

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
        <input name="avatar" (change)="handleFileInput($event.target.files)" type="file" accept="image/*"/>
        <div><img [src]="newMember.avatar_url" width="50" /></div>
    </div>
    <button [disabled]="addForm.invalid" (click)="add()">Añadir</button>
  </form>
</div>

<h2>Listado</h2>
<div>
  <label>Buscar por nombre: </label>
  <input #search (keyup)="0"/>
  <table>
    <thead>
      <tr>
        <th appHighlight>Avatar</th>
        <th>Id</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
        <tr *ngFor="let member of members | searchByLogin:search.value" (click)="select(member)">
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

+<app-user-edit></app-user-edit>
```

- Usamos el decorador `@Input` para pasar del padre (user-list) al hijo (user-edit) el MemberEntity seleccionado

En el hijo se declara una propiedad de la clase y se decora con @Input indicando que el valor de esta propiedad llegará desde fuera

_src/app/user/user-edit/user-edit.component.ts_

```diff
-import { Component, OnInit } from '@angular/core';
+import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MemberEntity } from 'src/app/model/MemberEntity';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
})
export class UserEditComponent implements OnInit {

+  @Input()
  member!: MemberEntity;

  editForm: FormGroup;
  idControl: FormControl;
  loginControl: FormControl;
  avatarControl: FormControl;

  constructor(private fb: FormBuilder) {
    this.createEditForm();
  }
```

El decorador `@Input` provoca que la etiqueta app-user-edit disponga de un atributo llamado member al que le podemos dar un valor como a cualquier otro atributo HTML.

En el HTML de user-list:

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
        <input name="avatar" (change)="handleFileInput($event.target.files)" type="file" accept="image/*"/>
        <div><img [src]="newMember.avatar_url" width="50" /></div>
    </div>
    <button [disabled]="addForm.invalid" (click)="add()">Añadir</button>
  </form>
</div>

<h2>Listado</h2>
<div>
  <label>Buscar por nombre: </label>
  <input #search (keyup)="0"/>
  <table>
    <thead>
      <tr>
        <th appHighlight>Avatar</th>
        <th>Id</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
        <tr *ngFor="let member of members | searchByLogin:search.value" (click)="select(member)">
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

-<app-user-edit></app-user-edit>
+<app-user-edit [member]="memberSelected"></app-user-edit>
```

- En el ts de user-edit, usamos el método ngOnChanges() para setear el valor del formulario cada vez que la propiedad member cambie de valor

_src/app/user/user-edit/user-edit.component.ts_

```diff
import {
  Component,
  OnInit,
  Input,
+ OnChanges,
+ SimpleChanges,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MemberEntity } from '../../model';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
})
-export class UserEditComponent implements OnInit {
+export class UserEditComponent implements OnInit, OnChanges {
  @Input()
  member!: MemberEntity;

  editForm!: FormGroup;
  idControl!: FormControl;
  loginControl!: FormControl;
  avatarControl!: FormControl;

  constructor(private fb: FormBuilder) {}

+  ngOnChanges(changes: SimpleChanges): void {
+   console.log();
+   if (changes['member'].currentValue) {
+     this.editForm.patchValue(this.member);
+   } 
+ }
// .....
```

La selección de usuario ya funciona, y el formulario se puede utilizar, pero queda guardar los cambios al pulsar el botón guardar.

El botón de guardar lo tiene user-edit, pero la lista de miembros está en el padre, en user-list. Habrá que mandar el memberEntity editado del hijo al padre.

- Utilizar el decorador `@Output` en el hijo para disparar un evento al que el padre pueda poner un listener.

_src/app/user/user-edit/user-edit.component.ts_

```diff
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
+ Output,
+ EventEmitter,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MemberEntity } from '../../model';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
})
export class UserEditComponent implements OnInit, OnChanges {
  @Input()
  member!: MemberEntity;
+
+ @Output()
+ saveEvent: EventEmitter<MemberEntity> = new EventEmitter();
```

- Disparamos el evento cuando se pulse el botón de guardar

El componente user-edit disparará un evento llamado saveEvent cada vez que el usuario pulse el botón de guardar. El contexto del evento ($event) será el nuevo objeto MemberEntity.

El evento se dispara al llamar al método emit() -o su alias next()-. Como argumento de entrada a la función emit() pasamos la información que queremos que se convierta en el contexto del evento.

_src/app/user/user-edit/user-edit.component.ts_

```ts
  save(): void {
    if (this.editForm.valid) {
      /*diff*/
      const member = this.editForm.value;
      this.saveEvent.emit(member);
      /*diff*/
    }
  }
```

El decorador @Output provoca que la etiqueta app-user-edit disponga de un evento llamado saveEvent al que el padre se podrá bindear en el HTML.

En el HTML de user-list:

_src/app/user/user-list/user-list.component.html_

```diff
-<app-user-edit [member]="memberSelected"></app-user-edit>
+<app-user-edit [member]="memberSelected" (saveEvent)="save($event)"></app-user-edit>
```

Y ahora el ts de user-list ya puede modificar el elemento en el listado

_src/app/user/user-list/user-list.component.ts_

```diff
  select(member: MemberEntity) {
    this.memberSelected = {...member};
  }

-  save() {
-    if (this.editForm.valid) {
-      this.members = [...this.members];
-      const member = this.editForm.value;
-      const index = this.members.findIndex(item => item.id === member.id);
-      this.members.splice(index, 1, member);
-    }
-  }
+  save(member: MemberEntity) {
+    this.members = [...this.members];
+    const index = this.members.findIndex(item => item.id === member.id);
+    this.members.splice(index, 1, member);
+  }
}
```
