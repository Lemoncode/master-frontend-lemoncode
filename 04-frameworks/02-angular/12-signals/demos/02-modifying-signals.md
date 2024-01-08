# Modifying Signals

In this demo, we'll set and update signals. Let's try the set method first to change the value of a signal. Recall that we have a select element here in our template. When the user selects a quantity from the list, the template calls the `onQuantitySelected` method, passing in the selected quantity. Scrolling down, in this method, let's change our quantity signal to the passed‑in quantity. We call `this.quantity.set` and pass in qty. 

Update `signals-lab/src/app/app.component.ts`

```diff
onQuantitySelected($event: number): void {
+ this.quantity.set($event);
}
```

This replaces the value in the quantity signal with the user selection. 

Here in the UI, if we select a quantity, our selection is set into the signal. The template is then notified, and the quantity binding below the select box displays the selected quantity. It works! 

Next let's try the `update` and use the current signal value to calculate a new value. We'll have a two‑for‑one sale. Use the update method to multiply the quantity by 2. 

Here in the constructor, call this.quantity.update. We pass in an arrow function. The arrow function gets the current quantity from the signal, which we'll call q for quantity. On the right side of the arrow function, multiply q times 2. This multiplies the current value of the signal by 2 and updates the signal with the result. 

```diff
constructor() {
  console.log(`Signals value ${this.quantity()}`);

+ this.quantity.update((q) => q * 2);
}
```

Notice that the initial value shown in the select box is now 2. If we pick another number, however, the value is not doubled. That's because the code in the constructor is only run once. It does not react to changes in the signal. Let's try one more thing. 

First, I'm going to jump ahead for a moment so we can log the values of our signals. I'll use what's called an `effect`. With an `effect`, we run code when a signal value changes. We'll talk more about signal effects shortly. For now, we'll create an `effect` that logs the value of our quantity. 

In the constructor, call `effect`. Then use the Quick Fix to add the needed import. We pass in a function defining the code to execute. We'll pass in an arrow function. An effect doesn't have a parameter, so we use empty parentheses, then define what we want it to do. We'll log a description and our quantity signal. We've already mentioned that this console.log only executes one time when the constructor is first executed. An effect is scheduled to run any time its reference signals change. In this code, it is scheduled to run whenever the quantity signal changes. 

```diff
  constructor() {
    console.log(`Signals value ${this.quantity()}`);

+   effect(() => console.log('In effect: ', this.quantity()));

    this.quantity.update((q) => q * 2);
  }
```

Refresh the application, and we see our initial signal value emitted to the console. Then when the constructor finishes executing, we see the updated value of 2 logged to the console. 

Now let's modify `onQuantityChanged` to update the same signal multiple times. I'll set it to 67, and then to 42. 

```diff
  onQuantitySelected($event: number): void {
    this.quantity.set($event);
+   this.quantity.set(67);
+   this.quantity.set(42);
  }
```

In the UI, pick a quantity from the select box, I'll pick 5, and notice that **only the 42 appears in the console**. 

When the quantity was changed to 5, then 67, then 42, the signal provided notification that the signal's value changed, but the effect didn't have an opportunity to run until after the method was finished executing. 

When the effect did run, it read the current value of the signal, which was 42. It's important to remember that signals are quite different from observables. Signals do not emit values and signals don't provide callback functions for an immediate reaction. 

Rather, signal changes provide a notification, and the code responds to that notification when it has a chance to execute. 

Before we move on, let's comment out these two set lines, and be sure to save the project, as we'll continue to add to it. 

```diff
onQuantitySelected($event: number): void {
    this.quantity.set($event);
-   this.quantity.set(67);
-   this.quantity.set(42);
  }
```

We've now tried out the set and update, but for the real exciting reactivity, we want computed signals.