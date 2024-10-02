# Creating Observables
# Creando Observables

## Creating an Observable (of and from)
## Creadon un Observable (of y from)

- Creación de observables
    - of()
    - from()
- Subscribirse a cada onservable

Actualizar `movies/src/app/app.component.ts`

```diff
-import { Component } from '@angular/core';
+import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
-export class AppComponent {
+export class AppComponent implements OnInit, OnDestroy {
- pageTitle = 'movies';
+ pageTitle = 'Lemoncode Store';
+ cartCount = 0;
+ 
+ ngOnInit(): void {
+   
+ }
+
+ ngOnDestroy(): void {
+   
+ }
}

```

Comenzanmos usando `of`

```ts
/*diff*/
import { of } from 'rxjs';
/*diff*/

export class AppComponent implements OnInit, OnDestroy {
  pageTitle = 'Lemoncode Store';
  cartCount = 0;
  
  ngOnInit(): void {
    /*diff*/
    of(2, 4, 6, 8).subscribe((item) => console.log(`Value from of:`, item));
    /*diff*/
  }

  ngOnDestroy(): void {}
}
```

Necesitamos volcar la subscripción en una variable:

```diff
-import { of } from 'rxjs';
+import { Subscription, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  pageTitle = 'Lemoncode Store';
  cartCount = 0;

+ sub!: Subscription;
# ....
```

```diff
export class AppComponent implements OnInit, OnDestroy {
  pageTitle = 'Lemoncode Store';
  cartCount = 0;

  sub!: Subscription;

  ngOnInit(): void {
-   of(2, 4, 6, 8).subscribe((item) => console.log(`Value from of:`, item));
+   this.sub = of(2, 4, 6, 8).subscribe((item) => console.log(`Value from of:`, item));
  }

  ngOnDestroy(): void {
+   this.sub.unsubscribe();
  }
}
```

Probemos.

```bash
npm start
```

Abrir una consola en el navegador. ¿Qué es lo que va a hacer `of` con un array?:

- Actualizar `movies/src/app/app.component.ts`

```diff
export class AppComponent implements OnInit, OnDestroy {
  pageTitle = 'Lemoncode Store';
  cartCount = 0;

  sub!: Subscription;
+ subArray!: Subscription;

  ngOnInit(): void {
    this.sub = of(2, 4, 6, 8).subscribe((item) => console.log(`Value from of:`, item));
+   this.subArray = of([2, 4, 6, 8]).subscribe((item) => console.log(`Value from of:`, item));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
+   this.subArray.unsubscribe();
  }
}

```

Emite una únca notificación, con el array. Por último vamos añadir `from`

```ts
/*diff*/
import { Subscription, from, of } from 'rxjs';
/*diff*/

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  pageTitle = 'Lemoncode Store';
  cartCount = 0;

  sub!: Subscription;
  subArray!: Subscription;
  /*diff*/
  subFrom!: Subscription;
  /*diff*/

  ngOnInit(): void {
    this.sub = of(2, 4, 6, 8).subscribe((item) =>
      console.log(`Value from of:`, item)
    );
    this.subArray = of([2, 4, 6, 8]).subscribe((item) =>
      console.log(`Value from of:`, item)
    );
    /*diff*/
    this.subFrom = from([20, 15, 10, 5]).subscribe({
      next: (item) => console.log('From item:', item),
      error: (err) => console.log('From error', err),
      complete: () => console.log('From completed'),
    });
    /*diff*/
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.subArray.unsubscribe();
    /*diff*/
    this.subFrom.unsubscribe();
    /*diff*/
  }
}

```

## Creando un Observable (fromEvent)

- Create an observable
  - fromEvent()

```diff
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
-import { Subscription, from, of } from 'rxjs';
+import { Subscription, from, fromEvent, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  pageTitle = 'Lemoncode Store';
  cartCount = 0;

  sub!: Subscription;
  subArray!: Subscription;
  subFrom!: Subscription;
+ subEvent!: Subscription;

  ngOnInit(): void {
    this.sub = of(2, 4, 6, 8).subscribe((item) =>
      console.log(`Value from of:`, item)
    );
    this.subArray = of([2, 4, 6, 8]).subscribe((item) =>
      console.log(`Value from of:`, item)
    );
    this.subFrom = from([20, 15, 10, 5]).subscribe({
      next: (item) => console.log('From item:', item),
      error: (err) => console.log('From error', err),
      complete: () => console.log('From completed'),
    });
+   this.subEvent = fromEvent(document, 'click').subscribe({
+     next: (ev) => console.log('Click evt:', ev.target),
+     error: (err) => console.log('Error occurred', err),
+     complete: () => console.log('No more events'),
+   });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.subArray.unsubscribe();
    this.subFrom.unsubscribe();
+   this.subEvent.unsubscribe();
  }
}

```

## Ejercicio

Crea un observable que obseve cuando el usuario teclee dentro del elemento document. Queremos almacenar cada uan de las teclas, crea un array para almacenar los valores.

### Solución

```ts
// 1. Create a new subscription
// 2. Create the following code inside ngOnInit()
const keys: string[] = [];
const this.subKey = fromEvent(document, 'keydown').subscribe(
    ev => {
        keys.push((ev as KeyboardEvent).key);
        console.log('Key array:', keys);
    }
)
```
