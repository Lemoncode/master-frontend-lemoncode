# toSignal + toObservable

## Set up

```bash
npm i unique-names-generator
```

Create `persons/person.ts`

```ts
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';

export interface Person {
  name: string;
  id: string;
}

const config: Config = {
  dictionaries: [names],
};

export const createPersons = (numberOfItems: number): Person[] => {
  return [...Array(numberOfItems).keys()].map(() => ({
    name: uniqueNamesGenerator(config),
    id: crypto.randomUUID(),
  }));
};

```

```bash
ng g service persons/person --skip-tests
```

Update `persons/person.service.ts`

```ts
import { Injectable } from '@angular/core';
import { Person, createPersons } from './person';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  getPersons(numberOfPersons: number): Observable<Person[]> {
    return of(createPersons(numberOfPersons));
  }
}

```

## Using `effects`

Lets create a component that uses this service to render a list of persons. We want to render when ever the user types a new number of persons.

```bash
ng g c persons/persons --inline-style --inline-template --skip-tests --flat
```

```ts
import { Component, effect, inject, signal } from '@angular/core';
import { PersonService } from './person.service';
import { Person } from './person';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [],
  template: `
    <input
      type="number"
      (input)="updateNumberOfPersons($event)"
    />
    <ul>
      @for (person of persons; track person.id) {
      <li>{{ person.name }}</li>
      }
    </ul>
  `,
  styles: ``,
})
export class PersonsComponent {
  numberOfPersons = signal<number>(0);
  persons: Person[] = [];

  private personsSvc = inject(PersonService);

  updateNumberOfPersons($event: Event) {
    this.numberOfPersons.set(+($event.target as HTMLInputElement).value);
  }
}

```

We want to render new persons when ever the user update the `input`. In order to do that we are going to use `personsSvc`. But how can we react to any change in the signal? We can try `effect`

```ts
export class PersonsComponent {
  numberOfPersons = signal<number>(0);
  persons: Person[] = [];

  private personsSvc = inject(PersonService);

  updateNumberOfPersons($event: Event) {
    this.numberOfPersons.set(+($event.target as HTMLInputElement).value);
  }
  /*diff*/
  e = effect(() => {
    this.personsSvc.getPersons(this.numberOfPersons()).subscribe((persons) => {
      this.persons = persons;
    });
  });
  /*diff*/
}

```

Update `app.component.ts`

```diff
...
+import { PersonsComponent } from './persons/persons.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NormalComponent,
    SignalComponent,
    ReaderComponent,
+   PersonsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
```

Update `app.component.html`

```diff
<app-normal />
<app-signal />
<div>
  <app-reader [input]="title"/>
  <button (click)="toggleCasing()">Toggle Casing</button>
</div>
+
+<br>
+
+<h2>Persons</h2>
+
+<div>
+ <app-persons />
+</div>
```

```bash
npm start
```

This works but it has drawbacks:

- `persons` is not a signal
- We can change this by  using `{allowSignalWrites: true}`, but this could take issues if we are working with *zoneless change detection*
- The triggering of the effect is decoupled from RxJS, we can not use powerfull opertors.

## Use toSignal + toObservable

Update `persons/persons.component.ts`

```diff
+import { toSignal, toObservable } from '@angular/core/rxjs-interop';
....
export class PersonsComponent {
  numberOfPersons = signal<number>(0);
- persons: Person[] = [];

  private personsSvc = inject(PersonService);

  updateNumberOfPersons($event: Event) {
    this.numberOfPersons.set(+($event.target as HTMLInputElement).value);
  }

- e = effect(() => {
-   this.personsSvc.getPersons(this.numberOfPersons()).subscribe((persons) => {
-     this.persons = persons;
-   });
- });
+  persons = toSignal(
+    toObservable(this.numberOfPersons).pipe(
+      debounceTime(500),
+      switchMap((numberOfPersons) =>
+        this.personsSvc.getPersons(numberOfPersons)
+     )
+   )
+ ) as Signal<Person[]>;
}
```

Update `template`

```diff
@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [],
  template: `
    <input type="number" (input)="updateNumberOfPersons($event)" />
    <ul>
-     @for (person of persons; track person.id) {
+     @for (person of persons(); track person.id) {
      <li>{{ person.name }}</li>
      }
    </ul>
  `,
  styles: ``,
})
```

- https://angular.dev/guide/experimental/zoneless
- https://angular.dev/guide/signals/rxjs-interop