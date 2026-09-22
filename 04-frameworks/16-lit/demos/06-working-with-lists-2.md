# Working with Lists II

## `repeat()` drective

When using the `map()` directive or just providing an iterable within the template, Lit creates a list of DOM nodes and updates them in the iteration order, efficiently reusing any previously rendered nodes. This technique should only be used when Lit controls all of the rendered state (as is commonly the case).

However, when relying instead on the DOM nodes to maintain state that isn't controlled by Lit, unexpected behavior can occur as the example below will demonstrate. In this case, use the `repeat()` directive instead.

Create `src/list-examples/list-examples-repeat.ts`

```ts
import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";

@customElement("list-examples-repeat")
export class ListExamplesRepeat extends LitElement {
  @state()
  movies = [
    {
      id: 1,
      rating: 9.2,
      title: "The Shawshank Redemption",
    },
    {
      id: 2,
      rating: 9.0,
      title: "The Godfather",
    },
    {
      id: 3,
      rating: 8.8,
      title: "The Dark Knight",
    },
    {
      id: 4,
      rating: 8.9,
      title: "Pulp Fiction",
    },
    {
      id: 5,
      rating: 8.7,
      title: "Schindler's List",
    },
    {
      id: 6,
      rating: 8.8,
      title: "Forrest Gump",
    },
    {
      id: 7,
      rating: 8.9,
      title: "Inception",
    },
    {
      id: 8,
      rating: 8.7,
      title: "The Matrix",
    },
    {
      id: 9,
      rating: 8.6,
      title: "Goodfellas",
    },
    {
      id: 10,
      rating: 8.8,
      title: "The Lord of the Rings: The Fellowship of the Ring",
    },
  ];

  protected override render() {
    return html`
      <section>
        <h2>Great Movies</h2>
        <button @click=${() => this._sort(1)}>Sort ascending by rating</button>
        <button @click=${() => this._sort(-1)}>
          Sort descending by rating
        </button>
        <ul>
          ${map(
            this.movies,
            (movie) =>
              html`<li>
                <input type="checkbox" />${movie.id} - ${movie.title}
              </li>`
          )}
        </ul>
      </section>
    `;
  }

  private _sort(direction: number) {
    this.movies.sort((a, b) => (a.rating - b.rating) * direction);
    this.requestUpdate();
  }
}
```

```bash
npm run build
```

Update `dev/index.html`

```diff
- <script type="module" src="../dist/list-examples/list-examples-map.js"></script>
+   <script type="module" src="../dist/list-examples/list-examples-repeat.js"></script>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
      }
    </style>
  </head>
  <body>
-   <list-examples-map></list-examples-map>
+   <list-examples-repeat></list-examples-repeat>
  </body>
```

> Check in browser

Each movie item is rendered as a `<li>` with a checkbox using the `map()` directive. There are buttons to sort the list movies in ascending or descending by rating. The label text is provided by a template expression but there is **no explicit component state** to hold whether the movie is checked or not.

Check one of the movies and change the sort order. Notice that the movie's label text changes but not the position of the checked box. This is because the checkbox state, which is not controlled by Lit, stays with the DOM nodes. During update, Lit only updates the value of the text node holding the label without reordering the DOM nodes.

Use the `repeat()` directive to keep the list movie and checkbox tied to the specific movie of the array. Using this directive with a key function lets Lit maintain the key-to-DOM association between updates by moving the DOM nodes when required.

```diff
....
-import { map } from "lit/directives/map.js";
+import {repeat} from 'lit/directives/repeat.js';
....
  protected override render() {
    return html`
      <section>
        <h2>Great Movies</h2>
        <button @click=${() => this._sort(1)}>Sort ascending by rating</button>
        <button @click=${() => this._sort(-1)}>
          Sort descending by rating
        </button>
        <ul>
-         ${map(
+         ${repeat(
            this.movies,
+           (movie) => movie.id,
            (movie) =>
              html`<li>
                <input type="checkbox" />${movie.id} - ${movie.title}
              </li>`
          )}
        </ul>
      </section>
    `;
  }
....
```

> The key function provided must return a unique key for an item. If you omit the key function—or provide a key function that simply returns the index—`repeat()` behaves exactly like `map()`. 

```bash
npm run build
```

> Check in browser