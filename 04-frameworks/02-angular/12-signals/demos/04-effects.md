# Effects


We've already defined an effect to log out our quantity. 

Update `signals-lab/src/app/app.component.ts`

```diff
export class AppComponent {
  title = 'signals-lab';

  quantity = signal(1);
  qtyAvailable = signal([1, 2, 3, 4, 5, 6]);
  selectedProduct = signal<Product>({ id: 1, name: 'Foo', price: 12 });
  exPrice = computed(() => this.selectedProduct().price * this.quantity());
  color = computed(() => (this.exPrice() > 50 ? 'green' : 'blue'));

+ e = effect(() => console.log('In effect, price:', this.exPrice()))
```

Now let's define a declarative effect to log the extended price, e = effect. 

We pass to the effect the function to execute. We'll use an arrow function. It has no parameters, so we use empty parentheses, an arrow, then we console.log a description and this.exPrice. 

We then see the extended price in the console. When we select a quantity, the updated extended price is logged. 

Use an effect any time you want to run code in response to a change in dependent signals.