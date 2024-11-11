# Input Signals

In v16 it was impossible to use signals as inputs to components. Community has a workaround: using _setters_
to turn inputs into signals.

## Signal with Input Setter

```bash
ng g c reader --inline-style --inline-template --skip-tests --flat
```

Update `reader.component.ts`

```ts
import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-reader',
  standalone: true,
  imports: [],
  template: ` <p>{{ inputSignal() }}</p> `,
  styles: ``,
})
export class ReaderComponent {
  inputSignal = signal<string>('');

  @Input() set input(value: string) {
    this.inputSignal.set(value);
  }
}
```

Update `app.component.ts`

```diff
....
+import { ReaderComponent } from './reader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NormalComponent,
    SignalComponent,
+   ReaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'signals-lab'; 
}
```

```ts
export class AppComponent {
  title = 'signals-lab';
  /*diff*/
  toggleCasing() {
    this.title = this.isUpperCase(this.title)
      ? this.title.toLowerCase()
      : this.title.toUpperCase();
  }

  private isUpperCase(str: string): boolean {
    return str === str.toUpperCase();
  }
  /*diff*/
}
```

Update `app.component.html`

```diff
<app-normal />
<app-signal />
+<div>
+ <app-reader [input]="title"/>
+ <button (click)="toggleCasing()">Toggle Casing</button>
+</div>
```

```bash
npm start
```

## Using signal inputs

From Angular v17.1, a new way of declaring input properties for components and directives, the `input` function. This function declares an input, but its value is a signal.

Update `reader.component.ts`

```diff
-import { Component, input, Input, signal } from '@angular/core';
+import { Component, input } from '@angular/core';

@Component({
  selector: 'app-reader',
  standalone: true,
  imports: [],
  template: ` <p>{{ inputSignal() }}</p> `,
  styles: ``,
})
export class ReaderComponent {
- inputSignal = signal<string>('');
+ inputSignal = input<string>('');
-
- @Input() set input(value: string) {
-   this.inputSignal.set(value);
- }
}

```

Update `app.component.html`

```diff
<app-normal />
<app-signal />
<div>
- <app-reader [input]="title"/>
+ <app-reader [inputSignal]="title"/>
  <button (click)="toggleCasing()">Toggle Casing</button>
</div>
```

We have more fetaures, we can set the input as required. Update `reader.component.ts`

```diff
export class ReaderComponent {
- inputSignal = input<string>('');
+ inputSignal = input.required<string>();
}
```

We can also use transformers:

```ts
import { Component, input } from '@angular/core';
/*diff*/
function quoteString(value: string | undefined) {
  if (value) {
    return `"${value}"`;
  }
  return '';
}
/*diff*/
@Component({
  selector: 'app-reader',
  standalone: true,
  imports: [],
  template: ` <p>{{ inputSignal() }}</p> `,
  styles: ``,
})
// .....
```

```diff
.....
export class ReaderComponent {
- inputSignal = input.required<string>();
+ inputSignal = input.required<string, string>({ transform: quoteString });
}
```

For last,we can also use `alias`:

```diff
export class ReaderComponent {
- inputSignal = input.required<string, string>({ transform: quoteString });
  inputSignal = input.required<string, string>({
    transform: quoteString,
+   alias: 'input',
  });
}

```

Update `app.component.html`

```diff
<app-normal />
<app-signal />
<div>
- <app-reader [inputSignal]="title"/>
+ <app-reader [input]="title"/>
  <button (click)="toggleCasing()">Toggle Casing</button>
</div>
```