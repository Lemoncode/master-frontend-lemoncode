# 04 Pipes

## Resumen

Este ejemplo toma como punto de partida el ejemplo 03.

Vamos a crear una pipe para realizar búsquedas sobre la lista de miembros

Qué vamos a aprender en este ejemplo:

- Creación de pipes personalizadas
- Utilización de pipes

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

- Creamos una caja para buscar por nombre

_src/app/user/user-list/user-list.html_

```diff
<h2>Listado</h2>
+
+<div>
+ <label>Buscar por nombre:</label>
+ <input />
+</div>
+
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
      <tr>
        <td>
          <img [src]="member.avatar_url" />
        </td>
        <td>
          <span>{{ member.id }}</span>
        </td>
        <td>
          <span>{{ member.login }}</span>
        </td>
      </tr>
    }
  </tbody>
</table>

```

- Creamos una pipe utilizando el CLI

```bash
ng g pipe pipes/search-by-login --skip-tests
```

- Programamos la pipe

La función `transform` de la pipe recibirá el valor de un campo, y en función de su longitud imprimirá un icono. La longitud deseada se pasa como parametro de configuración a la pipeline.

_src/app/pipes/awesome-pipe.ts_

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'awesome',
})
export class AwesomePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}

```

Actualizamos _src/app/pipes/awesome-pipe.ts_

```diff
# ...
export class AwesomePipe implements PipeTransform {
- transform(value: unknown, ...args: unknown[]): unknown {
+ transform(value: string, lenght: number): string {
-   return null;
+   return value && value.length > lenght ? `${value} 🏄` : `${value} 🩳`;
  }
}
# ....
```

Importamos la pipe para poderla consumir en el template. Actualizamos _src/app/user/user-list/user-list.ts_

```diff
# ...
+import { AwesomePipe } from '../../pipes/awesome-pipe';

@Component({
- imports: [Highlight, FormsModule],
+ imports: [Highlight, FormsModule, AwesomePipe],
  selector: 'app-user-list',
  styleUrl: './user-list.css',
  templateUrl: './user-list.html',
})
```

Para consumirlo vamos a editar _src/app/user/user-list/user-list.html_

```diff
# ....
  <tbody>
    @for (member of members(); track member.id) {
      <tr>
        <td>
          <img [src]="member.avatar_url" />
        </td>
        <td>
          <span>{{ member.id }}</span>
        </td>
        <td>
-         <span>{{ member.login }}</span>
+         <span>{{ member.login | awesome:5 }}</span>
        </td>
      </tr>
    }
  </tbody>
# ....
```

Ahora podemos probar en el navegador

```bash
npm start
```
