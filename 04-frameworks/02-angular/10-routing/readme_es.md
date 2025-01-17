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
ng g c home
ng g c login
ng g c contact
ng g c about
```

- Configuramos el routing

_src/app/app.routes.ts_

```diff
import { Routes } from '@angular/router';
+import { HomeComponent } from './home/home.component';
+import { LoginComponent } from './login/login.component';
+import { AboutComponent } from './about/about.component';
+import { ContactComponent } from './contact/contact.component';
+import { UserListComponent } from './user/user-list/user-list.component';
+
export const routes: Routes = [
+ { path: 'home', component: HomeComponent },
+ { path: 'login', component: LoginComponent },
+ { path: 'about', component: AboutComponent },
+ { path: 'contact', component: ContactComponent },
+ { path: 'users', component: UserListComponent },
];

```

- Indicamos a Angular con la directiva `router-outlet` el lugar exacto donde queremos que aparezcan nuestros componentes enrutados.

_src/app/app.component.ts_

```diff
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MenuComponent,
    SearchComponent,
    UserListComponent,
+   RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
```

_src/app/app.component.html_

```diff
<h1>Hola Mundo</h1>

<app-menu></app-menu>

-<app-user-list></app-user-list>
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

_src/app/layout/menu/menu.component.ts_

```diff
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    HighlightDirective,
+   RouterLink
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

}
```

_src/app/layout/menu/menu.component.html_

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

_src/app/layout/menu/menu.component.ts_

```diff
import { Component } from '@angular/core';
import { HighlightDirective } from '../../directives/highlight.directive';
-import { RouterLink } from '@angular/router';
+import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    HighlightDirective,
    RouterLink,
+   RouterLinkActive
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

}

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

_src/app/layout/menu/menu.component.css_

```css
.selected {
  background-color: lightblue;
}
```

- El servicio Router

El servicio Router ofrece métodos para trabajar con routas. El más utilizado con diferencia es el método navigate() que permite desde TypeScript navegar a una ruta concreta.

_src/app/login/login.component.html_

```html
<div style="margin-top: 1rem;">
  <button (click)="onLoginSuccess()">Login</button>
</div>
```

_src/app/login/login.component.ts_

```diff
import { Component, OnInit } from '@angular/core';
+import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

-  constructor() { }
+  constructor(private router: Router) { }

  ngOnInit(): void {
  }

+  onLoginSuccess() {
+    // ...
+    this.router.navigate(['/users']);
+  }

}
```

- El servicio `ActivatedRoute`

El servicio `ActivatedRoute` permite obtener la información asociada a la ruta: la url, los parámetros, los parámetros de la query-string, el fragment...

```diff
import { Component } from '@angular/core';
-import { Router } from '@angular/router';
+import { ActivatedRoute, Router } from '@angular/router';
+
+type LoginType = 'student' | 'teacher';
+
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
+ loginType: LoginType = 'student';

- constructor(private router: Router) {
+ constructor(private router: Router, private route: ActivatedRoute) {
+   // Si esta fuera la url: https://lemoncode.net/master-frontend/login?type="student"
+   this.route.queryParams.subscribe((queryParams) => {
+     this.loginType = queryParams['type'];
+     console.log(this.loginType);
+   });
+   
+   this.loginType = this.route.snapshot.queryParams['type'];
  }

  onLoginSuccess() {
    this.router.navigate(['/users']);
  }
}

```
