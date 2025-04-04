# Hello World

Create `src/lc-greetings.ts`

```ts
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("lc-greetings")
export class LcGreetings extends LitElement {
  @property()
  name = "jai";

  protected override render() {
    return html`
      <p>Welcome to Lit session</p>
      <p>Hi, ${this.name.toUpperCase()}</p>
    `;
  }
}
```

Lit components can have reactive properties. Changing a reactive property triggers the component to update.

```bash
npm run build
```

Lit components are [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components), we can add them as any Custom Element define by us.

Update `dev/index.html`

```diff
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>&lt;my-element> Demo</title>
+   <script type="module" src="../dist/lc-greetings.js"></script>
    <style>
      p {
        border: solid 1px solid;
        padding: 8px;
      }
    </style>
  </head>
  <body>
+   <lc-greetings></lc-greetings>
  </body>
</html>

```

```bash
npm run serve
```

## Declarative event Listeners

We can listen to events and use callbacks in respond to these events as follows:

Update `src/lc-greetings.ts`

```diff
@customElement("lc-greetings")
export class LcGreetings extends LitElement {
  @property()
  name = "jai";

+ changeName(event: Event) {}

  protected override render() {
    return html`
      <p>Welcome to Lit session</p>
      <p>Hi, ${this.name.toUpperCase()}</p>
+     <input @input=${this.changeName} placeholder="What is your name?" />
    `;
  }
}
```

Lets implement `changeName`

```ts
// ...
  changeName(event: Event) {
    const _name = (event.target as HTMLInputElement).value;
    this.name = _name;
  }
// ...
```

```bash
npm run build
```
```bash
npm run serve
```

> Since `name` is a reactive property, setting it in the event handler triggers the component to update.

## Using expressions to set attributes

We can also use expressions to set attributes in our html elements. For example, we can add a checkbox that will allow to edit the name as long is not checked.

Update `src/lc-greetings.ts`

```diff
export class LcGreetings extends LitElement {
  @property()
  name = "jai";
+
+ @property()
+ checked: boolean = false;
+
  changeName(event: Event) {
    const _name = (event.target as HTMLInputElement).value;
    this.name = _name;
  }

+ setChecked() {}

  protected override render() {
    return html`
      <p>Welcome to Lit session</p>
      <p>Hi, ${this.name.toUpperCase()}</p>
      <input @input=${this.changeName} placeholder="What is your name?" />
+     <label>
+       <input type="checkbox" @change=${this.setChecked}>
+       Enable editing.
+     </label>
    `;
  }
}
```

Now we can implement `setChecked`

```ts
// ...
  setChecked(event: Event) {
    this.checked = (event.target as HTMLInputElement).checked;
  }
// ...
```

Now we can used to disabled the `input`

```diff
....
  protected override render() {
    return html`
      <p>Welcome to Lit session</p>
      <p>Hi, ${this.name.toUpperCase()}</p>
-     <input @input=${this.changeName} placeholder="What is your name?" />
+     <input @input=${this.changeName} placeholder="What is your name?" ?disabled=${!this.checked} />
      <label>
        <input type="checkbox" @change=${this.setChecked} />
        Enable editing.
      </label>
    `;
  }
....
```

```bash
npm run build
```
```bash
npm run serve
```

The `?attributeName` syntax tells Lit you want to set or remove a boolean attribute based on the value of the expression.

There are five common positions for expressions in Lit templates:

```html
<!-- Child nodes -->
<h1>${this.pageTitle}</h1>

<!-- Attribute -->
<div class=${this.myTheme}></div>

<!-- Boolean attribute -->
<p ?hidden=${this.isHidden}>I may be in hiding.</p>

<!-- Property -->
<input .value=${this.value}>

<!-- Event listener -->
<button @click=${() => {console.log("You clicked a button.")}}>...</button>
```

