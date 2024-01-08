# Computed Signals

Update `signals-lab/src/app/app.component.ts`

```diff
export class AppComponent {
  title = 'signals-lab';

  quantity = signal(1);
  qtyAvailable = signal([1, 2, 3, 4, 5, 6]);
  selectedProduct = signal<Product>({ id: 1, name: 'Foo', price: 12 });
+ exPrice = this.selectedProduct().price * this.quantity();
# ....
```

Let's add an extended price, which is the product price multiplied by the quantity. Set exPrice = this.selectedProduct.price times this.quantity, and don't forget to open the box both here and here. 

Update `signals-lab/src/app/app.component.html`

```diff
<div>{{ quantity() }}</div>
<div>Product: {{ selectedProduct().name }}</div>
<div>Price: {{ selectedProduct().price }}</div>
+<div>Extended Price: {{ exPrice | currency }}</div>
```

Next, add an HTML element to display our extended price. I'll use a div element, add a label, and use interpolation to bind to the exPrice. Let's add the currency pipe for formatting. And there it is. It's $12, which is the original price of the product times the original value of the quantity. 

It was not recalculated when the quantity was updated here. If we change the quantity in our select box, the extended price is not recalculated. Any guess as to why? Since we defined the extended price as a basic variable, the value is calculated when it's first assigned. It does not react to any changes. 

Let's modify the `exPrice` to a computed signal. Add computed and insert parentheses. We pass an arrow function to the computed constructor. It doesn't have a parameter, so we use empty parentheses, and add the required import. 

```diff
quantity = signal(1);
  qtyAvailable = signal([1, 2, 3, 4, 5, 6]);
  selectedProduct = signal<Product>({ id: 1, name: 'Foo', price: 12 });
- exPrice = this.selectedProduct().price * this.quantity();
+ exPrice = computed(() => this.selectedProduct().price * this.quantity());
```

Wow, that's a big error message.

```
 [ERROR] NG9: No overload matches this call.
  Overload 1 of 3, '(value: string | number, currencyCode?: string | undefined, display?: string | boolean | undefined, digitsInfo?: string | undefined, locale?: string | undefined): string | null', gave the following error.
    Argument of type 'Signal<number>' is not assignable to parameter of type 'string | number'.
  Overload 2 of 3, '(value: null | undefined, currencyCode?: string | undefined, display?: string | boolean | undefined, digitsInfo?: string | undefined, locale?: string | undefined): null', gave the following error.
    Argument of type 'Signal<number>' is not assignable to parameter of type 'null | undefined'.
  Overload 3 of 3, '(value: string | number | null | undefined, currencyCode?: string | undefined, display?: string | boolean | undefined, digitsInfo?: string | undefined, locale?: string | undefined): string | null', gave the following error.
    Argument of type 'Signal<number>' is not assignable to parameter of type 'string | number | null | undefined'. [plugin angular-compiler]

    src/app/app.component.html:11:24:
      11 │ <div>Extended Price: {{ exPrice | currency }}</div>
```

Any idea what may be wrong? Looking at the template, oh, we're referencing the signal, not the signal value, so we need parentheses here, and we're back. 

Update `signals-lab/src/app/app.component.html`

```diff
-<div>Extended Price: {{ exPrice | currency }}</div>
+<div>Extended Price: {{ exPrice() | currency }}</div>
```

Open in browser.


Now notice that the extended price is the updated quantity, which is 2, times the price. If we change the quantity in the drop‑down to 5, the extended price is recalculated appropriately. It works! It reacts to changes! And we didn't need to use a `Subject` or `BehaviorSubject`. Let's try one more thing. 

We want to color code our extended price. If the extended price is greater than 50, we'll display it in green, otherwise, we'll display it in blue. 

Update `signals-lab/src/app/app.component.ts`

```diff
export class AppComponent {
  title = 'signals-lab';

  quantity = signal(1);
  qtyAvailable = signal([1, 2, 3, 4, 5, 6]);
  selectedProduct = signal<Product>({ id: 1, name: 'Foo', price: 12 });
  exPrice = computed(() => this.selectedProduct().price * this.quantity());
+ color = computed(() => (this.exPrice() > 50 ? 'green' : 'blue'));
```

First we create a computed signal for the color, color = computed. Then we pass the function to computed, empty parentheses, arrow, this.exPrice() > 50 ? 'green' : 'blue'. 

This makes use of the ternary operator that evaluates the first expression. If it's true, that is the extended price is greater than 50, it assigns the value of the second expression. If it's false, it assigns the value of the third expression. 

Update `signals-lab/src/app/app.component.html`

```diff
-<div>Extended Price: {{ exPrice() | currency }}</div>
+<div [style.color]="color()">Extended Price: {{ exPrice() | currency }}</div>
```

Next, we bind the `style.color` to our color signal. Now our extended price is blue. Pick 5 from the select box, and our extended price is now green. Cool! 

Computed signals are amazing in their simplicity, and we can use computed signals for much more than just calculations, as we did with our color. Be sure to save your changes, as we'll be adding more to this project. We used an effect here, but haven't talked about what that is. Let's do that, next.