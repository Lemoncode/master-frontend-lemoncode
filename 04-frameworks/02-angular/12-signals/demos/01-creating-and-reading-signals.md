# Creating and Reading Signals

We're going to build a very, very simplistic shopping cart feature to try out the basics of signals. 

Update `signals-lab/src/app/app.component.ts`

```ts
export class AppComponent {
  title = 'signals-lab';
  /*diff*/
  quantity = signal(1);
  /*diff*/
}
```

Create a signal for a quantity, quantity = signal. Use the Quick Fix to add the needed import. We see a syntax error here. That's because we must provide an initial value. Set an initial value of 1. That makes sense. 

If someone's added a product to a shopping cart, they probably want at least one. We don't need to specify the type. Hovering over the signal variable, we see that it is a `WriteableSignal` with a type of number. Let's read the signal from the constructor. 

Add the constructor, then use console.log to display the value of the signal, first a description, then `this.quantity`. 

```diff
export class AppComponent {
  title = 'signals-lab';

  quantity = signal(1);

+ constructor() {
+   console.log(`Signals value ${this.quantity()}`);
+ }
}
```

When reading the signal, don't forget to "open the box", adding parentheses after the signal name. 

```bash
npm start
```

Open the browser's console.

Update `signals-lab/src/app/app.component.html`

Next, we'll read the signal from the template. Let's delete the generated template and add <h1>Shopping Cart</h1>, and then a div, and bind to the quantity, and div. 

```html
<h1>Shopping Cart</h1>

<div>{{ quantity }}</div>
```

Wow, what is that strange thing? 

```js
() => { producerAccessed(node); return node.value; }
```

Any idea what's wrong? Yep, you guessed it. We didn't open the box. What we see here is the output for a signal instead of the value from the signal. Here in the template, add parentheses to read the signal, and now we see the initial value. 

```diff
<h1>Shopping Cart</h1>

-<div>{{ quantity }}</div>
+<div>{{ quantity() }}</div>
```

Update `signals-lab/src/app/app.component.ts`

Next let's create a signal for the quantity available. That value would normally come from a backend server somewhere, but for practice, we'll define it as a hard‑coded array of numbers, qtyAvailable = signal. Set an initial value of an array containing 1, 2, 3, 4, 5, 6. 

```diff
# ....
quantity = signal(1);
+qtyAvailable = signal([1, 2, 3, 4, 5, 6]);
# ....
```

We're going to use `ngModel` we need to import `FormsModule`

```diff
+import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
- imports: [CommonModule, RouterOutlet],
+ imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
```

Update `signals-lab/src/app/app.component.html`

```html
<h1>Shopping Cart</h1>

<select [ngModel]="quantity()" (ngModelChange)="onQuantitySelected($event)">
  <option disabled value="">--Select a quantity--</option>
  <option *ngFor="let q of qtyAvailable()">{{q}}</option>
</select>

<div>{{ quantity() }}</div>
```

We'll bind that value to a `select` element. I'll paste the element above our div element and then talk through it. The select element provides a drop‑down list. We use property binding to `ngModel` to bind the value of the selection to our current `quantity`. Notice the opening and closing parentheses to read the `quantity` value. Note that we are not using two‑way binding with a banana‑in‑a‑box syntax, rather, we are separately property binding to `ngModel` and event binding to `ngModelChange`. 

> That's because signals don't yet support two‑way binding. 

When the user changes the value, we call `onQuantitySelected` in the component. We pass in `$event`, which is the user‑selected value. The selection options are defined under the select element. The first option hard codes help text for the user. The remaining options are generated using this `ngFor`. Notice how it uses our `qtyAvailable` signal. The `onQuantitySelected` method referenced here in the template doesn't yet exist in the component. Let's create it. 

Update `signals-lab/src/app/app.component.ts`

```diff
export class AppComponent {
  title = 'signals-lab';

  quantity = signal(1);
  qtyAvailable = signal([1, 2, 3, 4, 5, 6]);

  constructor() {
    console.log(`Signals value ${this.quantity()}`);
  }
+
+ onQuantitySelected($event: number): void {
+ }
}
```

Scroll down, `onQuantitySelected`, and since the template is passing in the selected quantity, we define a parameter for the quantity, which is a number. Open in browser.

And there is our select box. Drop‑down the list, and we see our options. The numbers here are coming from our `qtyAvailable` signal. But selecting a new quantity doesn't change the quantity signal. We can see that displayed below the select element. We'll fix that a bit later. 

For now, let's create one more signal. This time we want to create a signal that holds an object. We start by defining an interface for the object. 

Create `signals-lab/src/app/product.ts`

```ts
export interface Product {
  id: number;
  name: string;
  price: number;
}

```

We create an interface called `Product`, define an id that is a number, a name that is a string, and a price that is a number. 

Update `signals-lab/src/app/app.component.ts`

```diff
+import { Product } from './product';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'signals-lab';

  quantity = signal(1);
  qtyAvailable = signal([1, 2, 3, 4, 5, 6]);
+ selectedProduct = signal<Product>({ id: 1, name: 'Foo', price: 12 });
```

Now we can create a signal containing a product object, selectedProduct = signal. For the initial value, we'll define a default product, set the id to 5, the name to Hammer, and the price to 12. Hover over the signal, and we see that it knows the properties of the object, but it doesn't recognize it as a product. Let's add a generic type parameter to the signal to define the type as Product. 

Now hover over, and we see the signal is of type WriteableSignal<Product>. 

Update `signals-lab/src/app/app.component.html`

```diff
<div>{{ quantity() }}</div>
+<div>Product: {{ selectedProduct().name }}</div>
+<div>Price: {{ selectedProduct().price }}</div>
```

In the template, let's read some of the product properties from the signal. After our current div, add another div element and bind to selectedProduct().name, then another div element and selectedProduct().price, and we see the product name and price in the view. 