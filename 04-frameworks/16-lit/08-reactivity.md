# Reactivity

## Introduction

Reactive properties and the reactive update cycle are an important part of the Lit library. Updating a reactive property can trigger a reactive update cycle, which in turn produces side effects—like re-rendering the element and updating its attributes.

## Reactive Property

A reactive property is a property that triggers the component to update whenever the property's value changes.

Create `src/random-dice.ts`

```ts
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("random-dice")
export class RandomDice extends LitElement {
  diceValue: number | undefined;

  rollDice() {
    this.diceValue = Math.floor(Math.random() * 6) + 1;
  }

  protected override render() {
    return html`
      <button @click=${this.rollDice}>Roll Dice!</button>
      <p>Result: ${this.diceValue}</p>
    `;
  }
}
```

```bash
npm run build
```

Update `dev/index.html`

```diff
....
-   <script type="module" src="../dist/task-list/task-list.js"></script>
+   <script type="module" src="../dist/random-dice.js"></script>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
      }
    </style>
  </head>
  <body>
-   <task-list></task-list>
+   <random-dice></random-dice>
  </body>
....
```

```bash
npm run serve
```

Pressing the button changes the property value, but the component never changes its display. Lets fix it.

```diff
....
-import { customElement } from "lit/decorators.js";
+import { customElement, property } from "lit/decorators.js";

@customElement("random-dice")
export class RandomDice extends LitElement {
+ @property()
  diceValue: number | undefined;
```

> Check in browser

## Triggering an update

How does a reactive property work? When you add a reactive property, Lit adds [accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) for that property. When you set the property, Lit checks to see if the property has changed. If the property has changed, Lit starts an update cycle. The update cycle is asynchronous, so that updating several properties in the course of a single event handler, for example, only triggers a single update.

By default, Lit uses a strict inequality check (`!==`) to determine whether a property has changed. If you mutate an existing object or array, Lit won't detect a change.

Update `src/random-dice.ts`

```diff
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("random-dice")
export class RandomDice extends LitElement {
- @property()
  diceValue: number | undefined;
+
+ @property()
+ previousValues: number[] = [];
+
  rollDice() {
    this.diceValue = Math.floor(Math.random() * 6) + 1;
+   this.previousValues.push(this.diceValue);
  }

  protected override render() {
    return html`
      <button @click=${this.rollDice}>Roll Dice!</button>
      <p>Result: ${this.diceValue}</p>
+     <br />
+     <h3>Previous values</h3>
+     ${this.previousValues}
    `;
  }
}

```

Notice that when we get the same value, consecutive times the update looks a bit awkward.

Lit's default equality check works great when using immutable data patterns.

```diff
....
  rollDice() {
    this.diceValue = Math.floor(Math.random() * 6) + 1;
-   this.previousValues.push(this.diceValue);
+   this.previousValues = [...this.previousValues, this.diceValue];
  }
....
```

> Check in browser

Now we can change back `diceValue` as property

````diff
Update `src/random-dice.ts`

```diff
....
@customElement("random-dice")
export class RandomDice extends LitElement {
+ @property()
  diceValue: number | undefined;
....
````

## Should the component update?

Setting a reactive property or calling `requestUpdate()` triggers a reactive update cycle. At the beginning of an update cycle, Lit calls the `shouldUpdate()` method, passing in a map of changed properties.

By default, `shouldUpdate()` always returns `true`. You can override `shouldUpdate()` to determine whether the component needs to update itself.

Update `src/random-dice.ts`

> TODO: Add dice type as property, check that render when we change this property and implement `shouldUpdate` to avoid rendering

```diff
....
@customElement("random-dice")
export class RandomDice extends LitElement {
  @property()
  diceValue: number | undefined;

  @property()
  previousValues: number[] = [];
+
+ @property()
+ dicetypes = "standard";
+
+ @state()
+ _renderCount = 0;
+
+ @state()
+ _diceMaxNumber = 6;
+
  rollDice() {
-   this.diceValue = Math.floor(Math.random() * 6) + 1;
+   this.diceValue = Math.floor(Math.random() * (this._diceMaxNumber)) + 1;
    this.previousValues = [...this.previousValues, this.diceValue];
  }
+
+ setDiceType(e: Event) {
+   const v = (e.target as HTMLSelectElement).value;
+   this.dicetypes = v;
+   if (this.dicetypes === "standard") {
+     this._diceMaxNumber = 6;
+   }
+   if (this.dicetypes === "extended") {
+     this._diceMaxNumber = 24;
+   }
+ }
+
  protected override render() {
+   this._renderCount++;

    return html`
+     <p>
+       <label>Dice Type
+         <select @change=${this.setDiceType}>
+           <option value="standard">standard</option>
+           <option value="extended">extended</option>
+         </select>
+       <label>
+       Render count: ${this._renderCount}
+     </p>
      <button @click=${this.rollDice}>Roll Dice!</button>
      <p>Result: ${this.diceValue}</p>
      <br />
      <h3>Previous values</h3>
      ${this.previousValues}
    `;
  }

```

```bash
npm run build
```

> Check in browser

The component is supposed to update whenever you press the **Roll Dice!** button. But as you can see from the render counter, it also updates when you change the dice type from **standard** to **extended**

> Even though there's no visual change.

To fix this, add the following method to the component class:

```ts
  protected override shouldUpdate(_changedProperties: PropertyValues): boolean {
    return !(
      _changedProperties.size === 1 && _changedProperties.has("dicetypes")
    );
  }
```

## Computing values during an update

One way your component can react to property changes is to compute values based on the new and existing property values.

The `willUpdate()` callback is the ideal place to do these calculations in Lit. It's called near the beginning up the update cycle, before the component renders, so any properties you calculate during `willUpdate()` are available in your `render()` method.

The `willUpdate()` callback receives a map of changed properties as an argument, where the keys are property names and the values are the old values for each changed property.

If your computed value is **only** used for rendering and is cheap to compute, you can do the computation in the `render()` method itself. However, if the property is expensive to compute, it's best to compute in `willUpdate()` and do so only when the inputs to the computation change. When computing a value in `willUpdate()`, it should be stored as a property on the element. This way the value can be used in `render()`, in an event listener, or it could be part of the element's public API.

Create `src/mirror-text.ts`

```ts
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("mirror-text")
export class MirrorText extends LitElement {
  @property() forward = "";
  @property() backward = "";

  onInput(e: Event) {
    const inputEl = e.target as HTMLInputElement;
    if (inputEl.id === "forward") {
      this.forward = inputEl.value;
    }
    if (inputEl.id === "backward") {
      this.backward = inputEl.value;
    }
  }

  protected override render() {
    return html`
      <label
        >Forward:
        <input id="forward" @input=${this.onInput} .value=${this.forward}
      /></label>
      <label
        >Backward:
        <input id="backward" @input=${this.onInput} .value=${this.backward}
      /></label>
      <div>Forward text: ${this.forward}</div>
      <div>Backward text: ${this.backward}</div>
    `;
  }
}
```

```bash
npm run build
```

Update `dev/index.html`

```diff
....
-   <script type="module" src="../dist/random-dice.js"></script>
+   <script type="module" src="../dist/mirror-text.js"></script>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
      }
    </style>
  </head>
  <body>
-   <random-dice></random-dice>
+   <mirror-text></mirror-text>
  </body>
```

The component has two string properties, `forward` and `backward`. The user can update either one, and the component needs to determine which property the user updated, and update the other property.

```ts
protected override willUpdate(_changedProperties: PropertyValues): void {
    if (_changedProperties.has("forward")) {
      this.backward = this.forward.split("").reverse().join("");
    }

    if (_changedProperties.has("backward")) {
      this.forward = this.backward.split("").reverse().join("");
    }
  }
```

```bash
npm run build
```

> Check in browser