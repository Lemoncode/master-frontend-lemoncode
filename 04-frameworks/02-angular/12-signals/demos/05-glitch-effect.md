# Glitch Effect

One of the major goals of such a primitive is glitch-free execution. Glitch-free execution means never allowing user code to see an intermediate state where only some reactive elements have been updated (by the time you run a reactive element, every source should be updated.)

RxJs only offers a solution that feels hacky at best. Let's look at the example below:

```bash
ng g c normal --inline-template --skip-tests --inline-style  --flat
```

```ts
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { BehaviorSubject, combineLatest, map, tap } from "rxjs";

@Component({
  selector: "app-normal",
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>Hello from {{ fullName$ | async }}!</p>
    <p>{{ fullNameCounter }}</p>

    <button (click)="changeName()">Change Name</button>
  `,
  styles: ``,
})
export class NormalComponent {
  public firstName = new BehaviorSubject("Bart");
  public lastName = new BehaviorSubject("Simpson");

  public fullNameCounter = 0;

  public fullName$ = combineLatest([this.firstName, this.lastName]).pipe(
    tap(() => {
      this.fullNameCounter++;
    }),
    map(([firstName, lastName]) => `${firstName} ${lastName}`)
  );

  public changeName() {
    this.firstName.next("El");
    this.lastName.next("Barto");
  }
}
```

1. We declare two BehaviorSubjects for `firstName` and `lastName`.
2. We combine them into an observable `fullName$` that simply concatenates the two.
3. We declare a `fullNameCounter` which we increment every time our `fullName$` Observable emits.
   We add a changeName function that we can trigger to set `firstName` and `lastName` to a different value AT THE SAME TIME.

Update `app.component.ts`

```diff
+import { NormalComponent } from './normal.component';

@Component({
  selector: 'app-root',
  standalone: true,
- imports: [CommonModule, FormsModule],
+ imports: [CommonModule, FormsModule, NormalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'signals-lab';
-
- quantity = signal(1);
- qtyAvailable = signal([1, 2, 3, 4, 5, 6]);
- selectedProduct = signal<Product>({ id: 1, name: 'Foo', price: 12 });
- exPrice = this.selectedProduct().price * this.quantity();
- exPrice = computed(() => this.selectedProduct().price * this.quantity());
- color = computed(() => (this.exPrice() > 50 ? 'green' : 'blue'));
-
- e = effect(() => console.log('In effect, price:', this.exPrice()));
- constructor() {
- console.log(`Signals value ${this.quantity()}`);
-
- effect(() => console.log('In effect: ', this.quantity()));
-
- this.quantity.update((q) => q * 2);
- }
-
- onQuantitySelected($event: number): void {
-  - console.log($event);
-   this.quantity.set($event);
-  - this.quantity.set(67);
-  - this.quantity.set(42);
- }
}

```

Update `app.component.html`

```diff
-<h2>Shopping Cart</h2>
-
-<select [ngModel]="quantity()" (ngModelChange)="onQuantitySelected($event)">
- <option disabled value="">--Select a quantity--</option>
- <option *ngFor="let q of qtyAvailable()">{{q}}</option>
-</select>
-
-<div>{{ quantity() }}</div>
-<div>Product: {{ selectedProduct().name }}</div>
-<div>Price: {{ selectedProduct().price }}</div>
-<div [style.color]="color()">Extended Price: {{ exPrice() | currency }}</div>

+<app-normal />
```

```bash
npm start
```

We have a **3**, this means `fullName$` emitted twice.

To avoid this and achieve our goal of glitch free execution, we need to add a `debounceTime` to our `fullName$` to avoid the duplicate execution and end up with glitch-free execution.

Update `normal.component.ts`

```diff
-import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
+import { BehaviorSubject, combineLatest, debounceTime, map, tap } from 'rxjs';
.....
export class NormalComponent {
  public firstName = new BehaviorSubject('Bart');
  public lastName = new BehaviorSubject('Simpson');

  public fullNameCounter = 0;

  public fullName$ = combineLatest([this.firstName, this.lastName]).pipe(
+   debounceTime(0),
    tap(() => {
      this.fullNameCounter++;
    }),
    map(([firstName, lastName]) => `${firstName} ${lastName}`)
  );

  public changeName() {
    this.firstName.next('El');
    this.lastName.next('Barto');
  }
}

```

## Exercise 

Refactor to use Signals instead of Observables.

> NOTE: Create a new component to see both in action

### Solution

```bash
ng g c signal --inline-template --skip-tests --inline-style  --flat
```

```ts
import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-signal',
  standalone: true,
  imports: [],
  template: ` 
    <p>{{ fullName() }}</p> 
    <p>{{ signalCounter }}</p>
    <button (click)="changeName()">Change</button>
  `,
  styles: ``,
})
export class SignalComponent {
  firstName = signal('Bart');
  lastName = signal('Simpson');

  signalCounter = 0;

  fullName = computed(() => {
    this.signalCounter++;
    console.log('signal name change');
    return `${this.firstName()} ${this.lastName()}`;
  });

  changeName() {
    this.firstName.set('El');
    this.lastName.set('Barto')
  }
}

```

Update `app.component.ts`

```diff
.....
+import { SignalComponent } from './signal.component';

@Component({
  selector: 'app-root',
  standalone: true,
- imports: [CommonModule, FormsModule, NormalComponent],
+ imports: [CommonModule, FormsModule, NormalComponent, SignalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
```

Update `app.component.html`

```diff
<app-normal />
+<app-signal />
```

```bash
npm start
```