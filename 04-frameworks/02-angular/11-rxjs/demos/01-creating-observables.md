# Creating Observables

## Creating an Observable (of and from)

- Create observables
    - of()
    - from()
- Subscribe to each observable

Update `LCS/src/app/app.component.ts`

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
  pageTitle = 'Lemoncode Store';
  cartCount = 0;
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

Lets start by using `of`

```ts
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

We need to get the subscription into a variable:

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

Lets give it a try.

```bash
npm start
```

Open browser console. What is going to do `of` with an array:

- Update `movies/src/app/app.component.ts`

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

Emits a single notification, with the array. For last lets add `from`

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

## Creating an Observable (fromEvent)

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

## Exercise

Create an Observable for key press on document element. We want to keep the pressed keys, create an Array to store their values.

### Solution

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
