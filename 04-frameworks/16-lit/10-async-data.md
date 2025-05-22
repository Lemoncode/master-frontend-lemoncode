# Async Data

Create `src/async-data.ts`

```ts
import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("async-data")
export class AsyncData extends LitElement {
  @state()
  private _items: string[] = [];

  protected override render() {
    return html`
      <h2>Cats</h2>
      <ul>
        ${this._items.map((i) => html`<li>${i}</li>`)}
      </ul>
    `;
  }

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();
    try {
      const response = await fetch("https://meowfacts.herokuapp.com/?count=3");

      if (response.ok) {
        const { data } = await response.json();
        this._items = [...data];
      }
    } catch (error) {
      console.error(error);
    }
  }
}
```

```bash
npm run build
```

Update `dev/index.html`

```diff
....
  <head>
    <meta charset="UTF-8" />
    <title>&lt;my-element> Demo</title>
-   <script type="module" src="../dist/date-display.js"></script>
+   <script type="module" src="../dist/async-data.js"></script>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
      }
    </style>
  </head>
  <body>
-   <date-display date="06/06/1987"></date-display>
+   <async-data></async-data>
  </body>
....
```

Instead we can use `@lit/task` but this is experimental at the moment