# 06 Formularios reactivos (model-driven)

## Resumen

Este ejemplo toma como punto de partida el ejemplo 06.

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

> NOTA: Podemos usar `npm ci` de esta forma instalaremos las dependencias existentes en `package-lock.json` en vez de regenerarlas.

- Arrancamos la aplicación:

```bash
ng serve
```

- Importamos el módulo `ReactiveFormsModule`

_src/app/user/user-list/user-list.ts_

```diff
# ....
-import { FormsModule } from '@angular/forms';
+import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AwesomePipe } from '../../pipes/awesome-pipe';
import { Members } from '../../services/members';

@Component({
- imports: [Highlight, FormsModule, AwesomePipe],
+ imports: [Highlight, FormsModule, AwesomePipe, ReactiveFormsModule],
# ....
```

- Inyectamos el servicio `FormBuilder` en el ts

_src/app/user/user-list/user-list.component.ts_

```diff
# ....
-import { FormsModule, ReactiveFormsModule } from '@angular/forms';
+import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AwesomePipe } from '../../pipes/awesome-pipe';
import { Members } from '../../services/members';

@Component({
  imports: [Highlight, FormsModule, AwesomePipe, ReactiveFormsModule],
  selector: 'app-user-list',
  styleUrl: './user-list.css',
  templateUrl: './user-list.html',
})
export class UserList implements OnInit {
  members = signal<MemberEntity[]>([]);
  newMember!: MemberEntity;

  private membersService = inject(Members);
+ private fb = inject(FormBuilder);
# ....
```

- Construimos un formulario en el ts

_src/app/user/user-list/user-list.ts_

```diff
# ....
import { Highlight } from '../../directives/highlight';
-import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
+ Validators,
+ FormGroup,
+ FormControl,
} from '@angular/forms';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AwesomePipe } from '../../pipes/awesome-pipe';
# ...
```


```ts
export class UserList implements OnInit {
  members = signal<MemberEntity[]>([]);
  newMember!: MemberEntity;
  /*diff*/
  editForm!: FormGroup;
  idControl!: FormControl;
  loginControl!: FormControl;
  avatarControl!: FormControl;
  /*diff*/

  private membersService = inject(Members);
  private fb = inject(FormBuilder);

  add(): void {
    this.members.update((members) => [...members, this.newMember]);
    this.newMember = {
      id: '',
      login: '',
      avatar_url: '',
    };
  }

  handleFileInput($event: Event) {
    const files = ($event.target as HTMLInputElement).files as FileList;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.newMember.avatar_url = reader.result as string;
    };
  }

  ngOnInit(): void {
    this.membersService.getAll().then((members) => this.members.set(members));

    this.newMember = {
      id: '',
      login: '',
      avatar_url: '',
    };
    /*diff*/
    this.createEditForm();
    /*diff*/
  }

  /* diff */
  createEditForm(): void {
    this.editForm = this.fb.group({
      id: ['', Validators.required],
      login: ['', [Validators.required, Validators.minLength(6)]],
      avatar_url: '',
    });

    this.idControl = this.editForm.get('id') as FormControl;
    this.loginControl = this.editForm.get("login") as FormControl;
    this.avatarControl = this.editForm.get("avatar_url") as FormControl;
  }
  /* diff */
}
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

- Rellenamos el formulario con los datos del `MemberEntity` en el que haga click el usuario

_src/app/user/user-list/user-list.html_

```diff
# ....
  <tbody>
    @for (member of members(); track member.id) {
-     <tr>
+     <tr (click)="select(member)">
        <td>
          <img [src]="member.avatar_url" />
        </td>
        <td>
          <span>{{ member.id }}</span>
        </td>
        <td>
          <span>{{ member.login | awesome:5 }}</span>
        </td>
      </tr>
    }
  </tbody>
# ....
```

y en el ts

```diff
# ....
export class UserList implements OnInit {
  members = signal<MemberEntity[]>([]);
  newMember!: MemberEntity;
+ memberSelected!: MemberEntity;
# ....
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
+
+ select(member: MemberEntity): void {
+   this.memberSelected = { ...member };
+   this.editForm.patchValue(this.memberSelected);
+ }
}
```

- Añadimos un formulario al final del html

_src/app/user/user-list/user-list.html_

```html
<div>
  <h2>Datos de XXXXXXX</h2>
  <form>
    <div>
      <label>Id </label>
    </div>
    <div>
      <label>Name </label>
      <input name="name" />
      <div>
        <div>El nombre es obligatorio</div>
        <div>
          El nombre debe tener X caracteres mínimo. Tiene sólamente X
          caracteres.
        </div>
      </div>
    </div>
    <div>
      <label>Avatar </label>
      <input name="avatar" type="file" accept="image/*" />
      <div><img [src]="" width="50" /></div>
    </div>
    <button>Actualizar</button>
  </form>
</div>
```

- Enlazamos el HTML con el formulario model-driven

_src/app/user/user-list/user-list.html_

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
+     @if (loginControl.invalid) {
+       <div>
+         @if (loginControl.errors?.['required']) {
+           <div>El nombre es obligatorio</div>
+         }
+         @if (loginControl.errors?.['minlength']) {
+           <div>
+             El nombre debe tener
+             {{ loginControl.errors?.['minlength'].requiredLength }} caracteres mínimo. Tiene
+             sólamente {{ loginControl.errors?.['minlength'].actualLength }}
+           </div>
+         }
+       </div>
+     }
    </div>
    <div>
        <label>Avatar </label>
        <input name="avatar" type="file" accept="image/*"/>
        <div><img [src]="" width="50" /></div>
    </div>
-    <button>Actualizar</button>
+    <button [disabled]="editForm.invalid">Actualizar</button>
  </form>
</div>
```

- Gestión del input file

_src/app/user/user-list/user-list.component.html_

```diff
# ....
    <div>
      <label>Avatar </label>
-     <input name="avatar" type="file" accept="image/*" />
-     <div><img [src]="" width="50" /></div>
+     <input name="avatar" type="file" (change)="handleEditFileInput($event)" accept="image/*" />
+     <div><img [src]="avatarControl.value" width="50" /></div>
    </div>
# ....
```

y en el ts

```ts
// ....
  handleEditFileInput($event: Event) {
    const files = ($event.target as HTMLInputElement).files as FileList;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.avatarControl.setValue(reader.result as string);
    };
  }
// ....
```

- Reemplazar el objeto original por el modificado

_src/app/user/user-list/user-list.html_

```diff
# ....
-   <button [disabled]="editForm.invalid">Actualizar</button>
+   <button [disabled]="editForm.invalid" (click)="save()">Actualizar</button>
  </form>
</div>
# ....
```

y en el ts

```ts
// ....
  save() {
    if (this.editForm.valid) {
      const updatedMember = this.editForm.value as MemberEntity;
      this.members.update((members) => {
        return members.map((m) => {
          if (m.id === updatedMember.id) {
            return updatedMember;
          }
          return m;
        });
      });
    }
  }
// ....
```

- La propiedad `valueChanges`

Tanto `FormControl` como `FormGroup` como `FormArray` tienen una propiedad **valueChanges** que es un _Observable_ del value del objeto en cuestión.

Esto permite suscribirnos a los cambios en un control o en un grupo de controles...
