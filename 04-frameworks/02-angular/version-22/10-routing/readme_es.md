# 09 Routing

## Resumen

Este ejemplo toma como punto de partida el ejemplo 08.

Vamos a crear un menú para poder navegar entre páginas

Qué vamos a aprender en este ejemplo:

- Asociar urls con componentes
- Mostrar los componentes asociados a las urls con la directiva router-outlet
- Crear un menú con las directivas routerLink y routerLinkActive
- Los servicios Router y ActivatedRoute

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

- Creamos varios componentes

```bash
ng g c home --skip-tests
ng g c login --skip-tests
ng g c contact --skip-tests
ng g c about --skip-tests
```

- Configuramos el routing

_src/app/app.routes.ts_

```diff
import { Routes } from '@angular/router';
+import { Home } from './home/home';
+import { Login } from './login/login';
+import { About } from './about/about';
+import { Contact } from './contact/contact';
+import { UserList } from './user/user-list/user-list';
+
export const routes: Routes = [
+   { path: 'home', component: Home},
+   { path: 'login', component: Login},
+   { path: 'about', component: About },
+   { path: 'contact', component: Contact},
+   { path: 'users', component: UserList}
];

```

- Indicamos a Angular con la directiva `router-outlet` el lugar exacto donde queremos que aparezcan nuestros componentes enrutados.

_src/app/app.ts_

```diff
# ....
+import { RouterOutlet } from '@angular/router';
import { Search } from './utils/search/search';
import { UserList } from './user/user-list/user-list';
import { Menu } from './layout/menu/menu';

@Component({
- imports: [Search, UserList, Menu],
+ imports: [Menu, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
```

_src/app/app.html_

```diff
<h1>Hola Mundo</h1>

<app-menu />

-<app-user-list />
+<router-outlet></router-outlet>
```

Introduciendo urls en el navegador podemos comprobar que funciona:

- http://localhost:4200/home
- http://localhost:4200/login
- http://localhost:4200/about
- http://localhost:4200/contact
- http://localhost:4200/users

Cada url debe mostar el componente asociado

- Crear el menú de navegación

Construimos un menú normal y corriente con HTML pero en lugar de utilizar el atributo href para navegar, utilizamos la directiva routerLink.

_src/app/layout/menu/menu.ts_

```diff
# ....
-import { Highlight } from '../../directives/highlight';
+import { RouterLink } from '@angular/router';

@Component({
  imports: [
-   Highlight,
+   RouterLink
  ],
  selector: 'app-menu',
  styleUrl: './menu.css',
  templateUrl: './menu.html',
})
```

_src/app/layout/menu/menu.html_

```html
<ul>
  <li><a routerLink="/home">Home</a></li>
  <li><a routerLink="/login">Login</a></li>
  <li><a routerLink="/about">About</a></li>
  <li><a routerLink="/contact">Contact</a></li>
  <li><a routerLink="/users">Users</a></li>
</ul>
```

¡Ya tenemos menú!

> Probar su funcionamiento en el browser

- Marcar con CSS el menú actualmente seleccionado

La directiva `routerLinkActive` permite poner una `class` al elemento que coincida con la ruta actual.

Se puede poner `routerLinkActive` en el mismo elemento que tiene `routerLink` o en su padre.

_src/app/layout/menu/menu.ts_

```diff
# ....
-import { RouterLink } from '@angular/router';
+import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [
    RouterLink,
+   RouterLinkActive
  ],
# ....
```

_src/app/layout/menu/menu.component.html_

```diff
<ul>
-  <li><a routerLink="/home">Home</a></li>
-  <li><a routerLink="/login">Login</a></li>
-  <li><a routerLink="/about">About</a></li>
-  <li><a routerLink="/contact">Contact</a></li>
-  <li><a routerLink="/users">Users</a></li>
+  <li routerLinkActive="selected"><a routerLink="/home">Home</a></li>
+  <li routerLinkActive="selected"><a routerLink="/login">Login</a></li>
+  <li routerLinkActive="selected"><a routerLink="/about">About</a></li>
+  <li routerLinkActive="selected"><a routerLink="/contact">Contact</a></li>
+  <li routerLinkActive="selected"><a routerLink="/users">Users</a></li>
</ul>
```

_src/app/layout/menu/menu.css_

```css
.selected {
  background-color: lightblue;
}
```

- El servicio Router

El servicio Router ofrece métodos para trabajar con routas. El más utilizado con diferencia es el método navigate() que permite desde TypeScript navegar a una ruta concreta.

_src/app/login/login.html_

```html
<div style="margin-top: 1rem;">
  <button (click)="onLoginSuccess()">Login</button>
</div>
```

_src/app/login/login.ts_

```diff
-import { Component } from '@angular/core';
+import { Component, inject } from '@angular/core';
+import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
+ private router = inject(Router);
+
+ onLoginSuccess() {
+   this.router.navigate(['/users']);
+ }
}

```

- El servicio `ActivatedRoute`

El servicio `ActivatedRoute` permite obtener la información asociada a la ruta: la url, los parámetros, los parámetros de la query-string, el fragment...

```diff
-import { Component, inject } from '@angular/core';
+import { Component, inject, OnInit } from '@angular/core';
-import { Router } from '@angular/router';
+import { ActivatedRoute, Router } from '@angular/router';
+
+type LoginType = 'student' | 'teacher';
+
@Component({
  imports: [],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login implements OnInit {
export class Login implements OnInit {
+ loginType: LoginType = 'student';

  private router = inject(Router);
+ private route = inject(ActivatedRoute);

  
  onLoginSuccess() {
    this.router.navigate(['/users']);
  }
+ 
+ ngOnInit(): void {
+   this.route.queryParams.subscribe((params) => {
+     this.loginType = params['type'];
+     console.log(this.loginType);
+   });
+ }
}
```

También podemos usar un `snapshot` en vez del observable.

```diff
# ....
  ngOnInit(): void {
-   this.route.queryParams.subscribe((params) => {
-     this.loginType = params['type'];
-     console.log(this.loginType);
-   });
+   this.loginType = this.route.snapshot.queryParams['type'];
  }
# ....
```