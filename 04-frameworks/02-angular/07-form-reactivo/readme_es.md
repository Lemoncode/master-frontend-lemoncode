# 06 Formularios reactivos (model-driven)

## Resumen

Este ejemplo toma como punto de partida el ejemplo 05.

Vamos a crear un formulario model-driven para la edición de miembros:

Qué vamos a aprender en este ejemplo:

- Creación de formularios model-driven
- Validadores model-driven
- Directivas para formularios model-driven
- La propiedad valueChanges

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

- Importamos el módulo ReactiveFormsModule

_src/app/app.module.ts_

```diff
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
-import { FormsModule } from '@angular/forms';
+import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './layout/menu/menu.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { HighlightDirective } from './directives/highlight.directive';
import { SearchByLoginPipe } from './pipes/search-by-login.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    UserListComponent,
    HighlightDirective,
    SearchByLoginPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
-    FormsModule
+    FormsModule,
+    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

- Inyectamos el servicio FormBuilder en el ts

_src/app/user/user-list/user-list.component.ts_

```diff
import { Component, OnInit } from '@angular/core';
import { MemberEntity } from 'src/app/model/MemberEntity';
import { MembersService } from 'src/app/services/members.service';
+import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  members: MemberEntity[] = [];
  newMember: MemberEntity;

-  constructor(private membersService: MembersService) {
+  constructor(private membersService: MembersService, private fb: FormBuilder) {
    this.membersService.getAll()
        .then((json) => this.members = json);

    this.newMember = {
      id: '',
      login: '',
      avatar_url: ''
    };
  }
```

- Construimos un formulario en el ts

_src/app/user/user-list/user-list.component.ts_

```diff
import { Component, OnInit } from '@angular/core';
import { MemberEntity } from 'src/app/model/MemberEntity';
import { MembersService } from 'src/app/services/members.service';
-import { FormBuilder } from '@angular/forms';
+import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  members: MemberEntity[] = [];
  newMember: MemberEntity;
+  editForm: FormGroup;
+  idControl: FormControl;
+  loginControl: FormControl;
+  avatarControl: FormControl;

  constructor(private membersService: MembersService, private fb: FormBuilder) {
    this.membersService.getAll()
        .then((json) => this.members = json);

    this.newMember = {
      id: '',
      login: '',
      avatar_url: ''
    };

+    this.createEditForm();
  }

+  createEditForm() {
+    this.editForm = this.fb.group({
+      id: ['', Validators.required],
+      login: ['', [Validators.required, Validators.minLength(6)]],
+      avatar_url: ''
+    });
+    this.idControl = this.editForm.get('id') as FormControl;
+    this.loginControl = this.editForm.get('login') as FormControl;
+    this.avatarControl = this.editForm.get('avatar_url') as FormControl;
+  }
```

Los formularios model-driven son muy flexibles en su forma de construirlos.

Otra forma de hacerlo podría ser la siguiente:

```ts
createEditForm() {
  this.idControl = new FormControl('', Validators.required);
  this.loginControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  this.avatarControl = new FormControl();

  this.editForm = this.fb.group({
    id: this.idControl,
    login: this.loginControl,
    avatar_url: this.avatarControl
  });
}
```

Y aquí otra alternativa más

```ts
createEditForm() {
  this.editForm = new FormGroup({});
  this.idControl = new FormControl('', Validators.required);
  this.loginControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  this.avatarControl = new FormControl();

  this.editForm.addControl('id', this.idControl);
  this.editForm.addControl('login', this.loginControl);
  this.editForm.addControl('avatar_url', this.avatarControl);
}
```

Todas son equivalentes.

- Rellenamos el formulario con los datos del MemberEntity en el que haga click el usuario

_src/app/user/user-list/user-list.component.html_

```diff
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
-        <tr *ngFor="let member of members | searchByLogin:search.value">
+        <tr *ngFor="let member of members | searchByLogin:search.value" (click)="select(member)">
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

y en el ts

```diff
import { Component, OnInit } from '@angular/core';
import { MemberEntity } from 'src/app/model/MemberEntity';
import { MembersService } from 'src/app/services/members.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  members: MemberEntity[] = [];
  newMember: MemberEntity;
+  memberSelected: MemberEntity;

  editForm: FormGroup;
  idControl: FormControl;
  loginControl: FormControl;
  avatarControl: FormControl;

  constructor(private membersService: MembersService, private fb: FormBuilder) {
    this.membersService.getAll().then(
      members => this.members = members
    );

    this.newMember = {
      id: '',
      login: '',
      avatar_url: ''
    };

    this.createEditForm();

    this.loginControl.valueChanges.subscribe(
      value => console.log({value})
    );

    this.editForm.valueChanges.subscribe(
      value => console.log({value})
    );
  }

  ngOnInit(): void {
  }

  createEditForm() {
    this.editForm = this.fb.group({
      id: ['', Validators.required],
      login: ['', [Validators.required, Validators.minLength(6)]],
      avatar_url: ''
    });

    this.idControl = this.editForm.get('id') as FormControl;
    this.loginControl = this.editForm.get('login') as FormControl;
    this.avatarControl = this.editForm.get('avatar_url') as FormControl;
  }

  add() {
    this.members.push(this.newMember);
    this.newMember = {
      id: '',
      login: '',
      avatar_url: ''
    };
  }

  handleFileInput(files: FileList) {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.newMember.avatar_url = reader.result as string;
    };
  }

+  select(member: MemberEntity) {
+    this.memberSelected = {...member};
+
+    // this.editForm.setValue(this.memberSelected);
+    this.editForm.patchValue(this.memberSelected);
+  }
}
```

- Añadimos un formulario al final del html

_src/app/user/user-list/user-list.component.html_

```html
<div>
  <h2>Datos de XXXXXXX</h2>
  <form>
    <div>
        <label>Id </label>
    </div>
    <div>
        <label>Name </label>
        <input name="name"/>
        <div>
          <div>El nombre es obligatorio</div>
          <div>El nombre debe tener X caracteres mínimo. Tiene sólamente X caracteres.</div>
        </div>
    </div>
    <div>
        <label>Avatar </label>
        <input name="avatar" type="file" accept="image/*"/>
        <div><img [src]="" width="50" /></div>
    </div>
    <button>Añadir</button>
  </form>
</div>
```

- Enlazamos el HTML con el formulario model-driven

_src/app/user/user-list/user-list.component.html_

```diff
<div>
  <h2>Datos de XXXXXXX</h2>
-  <form>
+  <form [formGroup]="editForm">
    <div>
        <label>Id </label>
    </div>
    <div>
        <label>Name </label>
-        <input name="name"/>
+        <input name="name" formControlName="login"/>
        <div>
          <div>El nombre es obligatorio</div>
          <div>El nombre debe tener X caracteres mínimo. Tiene sólamente X caracteres.</div>
        </div>
    </div>
    <div>
        <label>Avatar </label>
        <input name="avatar" type="file" accept="image/*"/>
        <div><img [src]="" width="50" /></div>
    </div>
    <button>Añadir</button>
  </form>
</div>
```

- Ponemos mensajes de validación y control del botón de submit

_src/app/user/user-list/user-list.component.html_

```diff
<div>
  <h2>Datos de XXXXXXX</h2>
  <form [formGroup]="editForm">
    <div>
        <label>Id </label>
    </div>
    <div>
        <label>Name </label>
        <input name="name" formControlName="login"/>
-        <div>
-          <div>El nombre es obligatorio</div>
-          <div>El nombre debe tener X caracteres mínimo. Tiene sólamente X caracteres.</div>
-        </div>
+        <div *ngIf="loginControl.invalid">
+          <div *ngIf="loginControl.errors.required">El nombre es obligatorio</div>
+          <div *ngIf="loginControl.errors.minlength">
+            El nombre debe tener {{ loginControl.errors.minlength.requiredLength }} caracteres mínimo.
+            Tiene sólamente {{ loginControl.errors.minlength.actualLength }}
+          </div>
+        </div>
    </div>
    <div>
        <label>Avatar </label>
        <input name="avatar" type="file" accept="image/*"/>
        <div><img [src]="" width="50" /></div>
    </div>
-    <button>Añadir</button>
+    <button [disabled]="editForm.invalid">Guardar</button>
  </form>
</div>
```

- Gestión del input file

_src/app/user/user-list/user-list.component.html_

```diff
<div>
  <h2>Datos de XXXXXXX</h2>
  <form [formGroup]="editForm">
    <div>
        <label>Id </label>
    </div>
    <div>
        <label>Name </label>
        <input name="name" formControlName="login"/>
        <div *ngIf="loginControl.invalid">
          <div *ngIf="loginControl.errors.required">El nombre es obligatorio</div>
          <div *ngIf="loginControl.errors.minlength">
            El nombre debe tener {{ loginControl.errors.minlength.requiredLength }} caracteres mínimo.
            Tiene sólamente {{ loginControl.errors.minlength.actualLength }}
          </div>
        </div>
    </div>
    <div>
        <label>Avatar </label>
-        <input name="avatar" type="file" accept="image/*"/>
-        <div><img [src]="" width="50" /></div>
+        <input name="avatar" type="file" (change)="handleEditFileInput($event.target.files)" accept="image/*"/>
+        <div><img [src]="avatarControl.value" width="50" /></div>
    </div>
    <button [disabled]="editForm.invalid">Guardar</button>
  </form>
</div>
```

y en el ts

```ts
handleEditFileInput(files: FileList) {
  const reader = new FileReader();
  reader.readAsDataURL(files[0]);
  reader.onload = (event) => {
    this.avatarControl.setValue(reader.result);
  };
}
```

- Reemplazar el objeto original por el modificado

_src/app/user/user-list/user-list.component.html_

```diff
<div>
  <h2>Datos de XXXXXXX</h2>
  <form [formGroup]="editForm">
    <div>
        <label>Id </label>
    </div>
    <div>
        <label>Name </label>
        <input name="name" formControlName="login"/>
        <div *ngIf="loginControl.invalid">
          <div *ngIf="loginControl.errors.required">El nombre es obligatorio</div>
          <div *ngIf="loginControl.errors.minlength">
            El nombre debe tener {{ loginControl.errors.minlength.requiredLength }} caracteres mínimo.
            Tiene sólamente {{ loginControl.errors.minlength.actualLength }}
          </div>
        </div>
    </div>
    <div>
        <label>Avatar </label>
        <input name="avatar" type="file" (change)="handleEditFileInput($event.target.files)" accept="image/*"/>
        <div><img [src]="avatarControl.value" width="50" /></div>
    </div>
-    <button [disabled]="editForm.invalid">Guardar</button>
+    <button [disabled]="editForm.invalid" (click)="save()">Guardar</button>
  </form>
</div>
```

y en el ts

```ts
save() {
  if (this.editForm.valid) {
    this.members = [...this.members];
    const member = this.editForm.value;
    const index = this.members.findIndex(item => item.id === member.id);
    this.members.splice(index, 1, member);
  }
}
```

- La propiedad valueChanges

Tanto FormControl como FormGroup como FormArray tienen una propiedad **valueChanges** que es un _Observable_ del value del objeto en cuestión. 

Esto permite suscribirnos a los cambios en un control o en un grupo de controles...
