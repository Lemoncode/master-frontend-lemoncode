# 08 Comunicación entre componentes padre-hijo

## Resumen

Este ejemplo toma como punto de partida el ejemplo 07.

Vamos a llevarnos el formulario de edición a otro componente distinto. Esto nos obligará a que el componente del listado y el del formulario de edición tengan que comunicarse entre ellos.

Qué vamos a aprender en este ejemplo:

- Parametrización de componentes con `input`
- Emisión de eventos con `output`

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

- Creamos un componente user-edit

```bash
ng g c user/user-edit --skip-tests
```

- Quitamos de user-list el html relativo a la edición de los usuarios:

_src/app/user/user-list/user-list.html_

```diff
-<div>
- <h2>Datos de XXXXXXX</h2>
- <form [formGroup]="editForm">
-   <div>
-     <label>Id </label>
-   </div>
-   <div>
-     <label>Name </label>
-     <input name="name" formControlName="login" />
-     @if (loginControl.invalid) {
-       <div>
-         @if (loginControl.errors?.['required']) {
-           <div>El nombre es obligatorio</div>
-         }
-         @if (loginControl.errors?.['minlength']) {
-           <div>
-             El nombre debe tener
-             {{ loginControl.errors?.['minlength'].requiredLength }} caracteres mínimo. Tiene
-             sólamente {{ loginControl.errors?.['minlength'].actualLength }}
-           </div>
-         }
-       </div>
-     }
-   </div>
-   <div>
-     <label>Avatar </label>
-     <input name="avatar" type="file" (change)="handleEditFileInput($event)" accept="image/*" />
-     <div><img [src]="avatarControl.value" width="50" /></div>
-   </div>
-   <button [disabled]="editForm.invalid" (click)="save()">Actualizar</button>
- </form>
-</div>
# ....
```

Y lo ponemos en el user-edit

_src/app/user/user-edit/user-edit.html_

```diff
-<p>user-edit works!</p>
+<div>
+ <h2>Datos de {{ memberSelected?.login }}</h2>
+ <form [formGroup]="editForm">
+   <div>
+     <label>Id </label>
+   </div>
+   <div>
+     <label>Name </label>
+     <input name="name" formControlName="login" />
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
+   </div>
+   <div>
+     <label>Avatar </label>
+     <input name="avatar" type="file" (change)="handleEditFileInput($event)" accept="image/*" />
+     <div><img [src]="avatarControl.value" width="50" /></div>
+    </div>
+    <button [disabled]="editForm.invalid" (click)="save()">Actualizar</button>
+  </form>
+</div>
```


- Quitamos del user-list todo el ts relativo a la edición

_src/app/user/user-list/user-list.ts_

```diff
# ....
import {
  FormsModule,
- ReactiveFormsModule,
- FormBuilder,
- Validators,
- FormGroup,
- FormControl,
} from '@angular/forms';
import { AwesomePipe } from '../../pipes/awesome-pipe';
import { Members } from '../../services/members';

@Component({
- imports: [Highlight, FormsModule, AwesomePipe, ReactiveFormsModule],
+ imports: [Highlight, FormsModule, AwesomePipe],
# ....
```

```diff
export class UserList implements OnInit {
  members = signal<MemberEntity[]>([]);
  newMember!: MemberEntity;
  memberSelected!: MemberEntity;
- editForm!: FormGroup;
- idControl!: FormControl;
- loginControl!: FormControl;
- avatarControl!: FormControl;
  
  private membersService = inject(Members);
- private fb = inject(FormBuilder);
# ....
- save() {
-   if (this.editForm.valid) {
-     const updatedMember = this.editForm.value as MemberEntity;
-     this.members.update((members) => {
-       return members.map((m) => {
-         if (m.id === updatedMember.id) {
-           return updatedMember;
-         }
-         return m;
-       });
-     });
-   }
- }
# ....
- handleEditFileInput($event: Event) {
-   const files = ($event.target as HTMLInputElement).files as FileList;
-   const reader = new FileReader();
-   reader.readAsDataURL(files[0]);
-   reader.onload = () => {
-     this.avatarControl.setValue(reader.result as string);
-   };
- }

  ngOnInit(): void {
    this.membersService.getAll().then((members) => this.members.set(members));
-   this.membersService.getAllHttp().subscribe((members) => this.members.set(members));

    this.newMember = {
      id: '',
      login: '',
      avatar_url: '',
    };

-   this.createEditForm();
  }

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

  select(member: MemberEntity): void {
    this.memberSelected = { ...member };
-   this.editForm.patchValue(this.memberSelected);
  }
}
```

Para ponerlo en el ts del user-edit

_src/app/user/user-edit/user-edit.ts_

```ts
import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-user-edit',
  styleUrl: './user-edit.css',
  templateUrl: './user-edit.html',
})
export class UserEdit implements OnInit {
  editForm!: FormGroup;
  idControl!: FormControl;
  loginControl!: FormControl;
  avatarControl!: FormControl;

  private fb = inject(FormBuilder);

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

  handleEditFileInput($event: Event) {
    const files = ($event.target as HTMLInputElement).files as FileList;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
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

_src/app/user/user-edit/user-edit.html_

```diff
-<h2>Datos de {{ memberSelected?.login }}</h2>
+<h2>Datos de {{ member()?.login }}</h2>
```

_src/app/user/user-edit/user-edit.ts_

```diff
-import { Component, inject, OnInit } from '@angular/core';
+import { Component, inject, input, OnInit } from '@angular/core';
# ....
+import { MemberEntity } from '../../model';

# ....

export class UserEdit implements OnInit {
  editForm!: FormGroup;
  idControl!: FormControl;
  loginControl!: FormControl;
  avatarControl!: FormControl;
+ member = input<MemberEntity>();
```

- Incluir el selector de user-edit en el html de user-list

_src/app/user/user-list/user-list.ts_

```diff
# ....
import { Members } from '../../services/members';
+import { UserEdit } from '../user-edit/user-edit';

@Component({
- imports: [Highlight, FormsModule, AwesomePipe],
+ imports: [Highlight, FormsModule, AwesomePipe, UserEdit],
# ....
```

_src/app/user/user-list/user-list.html_

```diff
# ....
<table>
  <thead>
    <tr>
      <th appHighlight>Avatar</th>
      <th>Id</th>
      <th>Name</th>
    </tr>
  </thead>
  <tbody>
    @for (member of members(); track member.id) {
      <tr (click)="select(member)">
        <td>
          <img [src]="member.avatar_url" />
        </td>
        <td>
          <span>{{ member.id }}</span>
        </td>
        <td>
          <span>{{ member.login | awesome: 5 }}</span>
        </td>
      </tr>
    }
  </tbody>
</table>
+
+<app-user-edit />
```

- Usamos el decorador `input` para pasar del padre (user-list) al hijo (user-edit) el MemberEntity seleccionado

En el HTML de user-list:

_src/app/user/user-list/user-list.html_

```diff
# ....
<table>
  <thead>
    <tr>
      <th appHighlight>Avatar</th>
      <th>Id</th>
      <th>Name</th>
    </tr>
  </thead>
  <tbody>
    @for (member of members(); track member.id) {
      <tr (click)="select(member)">
        <td>
          <img [src]="member.avatar_url" />
        </td>
        <td>
          <span>{{ member.id }}</span>
        </td>
        <td>
          <span>{{ member.login | awesome: 5 }}</span>
        </td>
      </tr>
    }
  </tbody>
</table>

-<app-user-edit />
+<app-user-edit [member]="memberSelected" />
```

- En el ts de user-edit, usamos el método `ngOnChanges()` para establecer el valor del formulario cada vez que la propiedad `member` actualice su valor

- [OnChanges Docs](https://angular.dev/api/core/OnChanges#ngOnChanges)

_src/app/user/user-edit/user-edit.component.ts_

```diff
-import { Component, inject, input, OnInit } from '@angular/core';
+import { Component, inject, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
# ....
-export class UserEdit implements OnInit {
+export class UserEdit implements OnInit, OnChanges {
  editForm!: FormGroup;
  idControl!: FormControl;
  loginControl!: FormControl;
  avatarControl!: FormControl;
  member = input<MemberEntity>();

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createEditForm();
  }
+
+ ngOnChanges(changes: SimpleChanges): void {
+   if (changes['member'].currentValue) {
+     this.editForm.patchValue(this.member() as unknown as MemberEntity);
+   }
+ }
# ....
```

La selección de usuario ya funciona, y el formulario se puede utilizar, pero queda guardar los cambios al pulsar el botón guardar.

El botón de guardar lo tiene user-edit, pero la lista de miembros está en el padre, en user-list. Habrá que mandar el memberEntity editado del hijo al padre.

- Utilizar el decorador `output` en el hijo para disparar un evento al que el padre pueda poner un listener.

_src/app/user/user-edit/user-edit.ts_

```diff
-import { Component, inject, input, OnChanges, OnInit SimpleChanges } from '@angular/core';
+import { Component, inject, input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
# ....
export class UserEdit implements OnInit, OnChanges {
  editForm!: FormGroup;
  idControl!: FormControl;
  loginControl!: FormControl;
  avatarControl!: FormControl;
  member = input<MemberEntity>();
+ saveEvent = output<MemberEntity>();
# ....
```

- Disparamos el evento cuando se pulse el botón de guardar

El componente user-edit disparará un evento llamado saveEvent cada vez que el usuario pulse el botón de guardar. El contexto del evento ($event) será el nuevo objeto MemberEntity.

El evento se dispara al llamar al método emit() -o su alias next()-. Como argumento de entrada a la función emit() pasamos la información que queremos que se convierta en el contexto del evento.

_src/app/user/user-edit/user-edit.ts_

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

El decorador `output` provoca que la etiqueta app-user-edit disponga de un evento llamado saveEvent al que el padre se podrá bindear en el HTML.

En el HTML de user-list:

_src/app/user/user-list/user-list.html_

```diff
-<app-user-edit [member]="memberSelected" />
+<app-user-edit [member]="memberSelected" (saveEvent)="save($event)" />
```

Y ahora el ts de user-list ya puede modificar el elemento en el listado

_src/app/user/user-list/user-list.ts_

```ts
/*diff*/
  save(member: MemberEntity) {
    this.members.update((members) =>
      members.map((m) => {
        if (m.id === member.id) {
          return member;
        }
        return m;
      }),
    );
  }
/*diff*/
```
