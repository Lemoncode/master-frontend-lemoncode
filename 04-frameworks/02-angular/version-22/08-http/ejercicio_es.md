# Ejercicio: Filtrado de datos.

Dado el actual estado de la solución, filtra la tabla por nombre de usuario. Para ello deberas usar `signals`. El código, que debe ser actualizado su template es:

`src/app/user/user-list/user-list.html`

```html
<div>
  <label>Buscar por nombre</label>
  <input />
</div>

<table>
  <thead>
    <tr>
      <th>Avatar</th>
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
          <span>{{ member.login | enhancer: 7 }}</span>
        </td>
      </tr>
    }
  </tbody>
</table>
```

1. Conecta la caja de búaqueda `input`
2. Guarda los cambios en la `signal`
3. Crea una *computed signal*

## Solución

Actualiza `src/app/user/user-list/user-list.html`

```diff
<div>
  <label>Buscar por nombre</label>
- <input />
+ <input (input)="onChangeFilterByName($event)" />
</div>
```

Actualiza `src/app/user/user-list/user-list.ts`

```ts
/* diff */
filterValue = signal<string>('');
/* diff */

// ....
/* diff */
onChangeFilterByName($event: Event) {
    const { data, inputType } = ($event as InputEvent);

    this.filterValue.update((v) => {
      if (inputType === 'deleteContentBackward') {
        return v.substring(0, v.length - 1);
      } else {
        return `${v}${data}`;
      }
    });
  }

  e = effect(() => console.log('Filter value', this.filterValue()));
/* diff */
```

Ahora que tenemos guardado el valor del filtro, podemos usar una *computed signal* que filtre los elementos de la tabla.

```diff
# ....
+ filterValue = signal<string>('');
+
+ filteredMembers = computed(() => {
+   if (!this.filterValue()) {
+     return this.members();
+   } else {
+     return this.members().filter((m) => m.login.includes(this.filterValue()));
+   }
+ });
# ....
+ e = effect(() => {
+   console.log('Filter value', this.filterValue());
+   console.log('Filtered members', this.filteredMembers());
+ });
# ....
```

Por último, apuntamos a `filteredMembers` en la *Template* . Acutualizamos `src/app/user/user-list/user-list.html`

```diff
# ....
  <tbody>
-   @for (member of members(); track member.id) {
+   @for (member of filteredMembers(); track member.id) {
      <tr (click)="select(member)">
        <td>
          <img [src]="member.avatar_url" />
        </td>
        <td>
          <span>{{ member.id }}</span>
        </td>
        <td>
          <span>{{ member.login | enhancer: 7 }}</span>
        </td>
      </tr>
    }
  </tbody>
# ....
```