# Working with Lists I

Lit has built-in support for iterables: pass an array (or other iterable) to a child expression and Lit will render each item in the array.

Create `src/list-examples/list-examples-plain.ts`

```ts
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("lit-examples-plain")
export class LitExamplesPlain extends LitElement {
  protected override render() {
    return html`
      <section>
        <h2>Array</h2>
        <p>${["Hola", "Hello", "Bonjour"]}</p>
      </section>
      <section>
        <h2>Set</h2>
        <p>${new Set(["banana", "apple", "melon"])}</p>
      </section>
      <section>
        <h2>Generator</h2>
        <p>
          ${(function* () {
            for (let i = 1; i < 3; i++) {
              yield i;
            }
          })()}
        </p>
      </section>
    `;
  }
}
```

```bash
npm run build
```

Update `dev/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>&lt;my-element> Demo</title>
    <script
      type="module"
      src="../dist/list-examples/list-examples-plain.js"
    ></script>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
      }
    </style>
  </head>
  <body>
    <lit-examples-plain></lit-examples-plain>
  </body>
</html>
```

> Check in browser

Notice that we will usually need to render a _template_ instead of items directly.

## `map()` directive

`map()` lets you transform the items in an iterable. It returns an iterable containing the result of calling the provided callback function on each item.

Create `src/list-examples/list-examples-map.ts`

```ts
import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";

interface Employee {
  name: string;
  position: string;
}

@customElement("list-examples-map")
export class ListExamplesMap extends LitElement {
  @state()
  employees: Employee[] = [
    {
      name: "John Doe",
      position: "Software Engineer",
    },
    {
      name: "Jane Smith",
      position: "Project Manager",
    },
    {
      name: "Mike Johnson",
      position: "Data Analyst",
    },
  ];

  protected override render() {
    return html`
      <section>
        <h3>Employees</h3>
        <ul></ul>
      </section>
    `;
  }
}
```

```diff
import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
+import { map } from "lit/directives/map.js";
....
protected override render() {
    return html`
      <section>
        <h3>Employees</h3>
-       <ul></ul>
+       <ul>
+         ${map(
+           this.employees,
+           (e) =>
+             html`<li>
+               <p>${e.name}</p>
+               <p>${e.position}</p>
+             </li>`
+         )}
+       </ul>
      </section>
    `;
  }
}
```

```bash
npm run build
```

Update `dev/index.html`

```diff
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>&lt;my-element> Demo</title>
-   <script
-     type="module"
-     src="../dist/list-examples/list-examples-plain.js"
-   ></script>
+   <script type="module" src="../dist/list-examples/list-examples-map.js"></script>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
      }
    </style>
  </head>
  <body>
-   <lit-examples-plain></lit-examples-plain>
+   <list-examples-map></list-examples-map>
  </body>
</html>

```

> Check in browser

Lets refactor this code to associate an icon too each job position when it renders.

```ts
// ....
  private employeeItemRender = (employee: Employee) => {
    const employeePos = employee.position
      .split(" ")
      .map((i) => i[0])
      .reduce((acc, curr) => {
        return (acc += curr);
      }, "");

    const icon = jobPosIcons.get(employeePos);

    return html`<li>
      <p>${employee.name}</p>
      <p>${employee.position}</p>
      <span>${icon}</span>
    </li>`;
  };
// ....
```

```diff
....
        <ul>
-         ${map(
-           this.employees,
-           (e) =>
-              html`<li>
-                <p>${e.name}</p>
-                <p>${e.position}</p>
-              </li>`
-         )}
+         ${map(this.employees, (e) => this.employeeItemRender(e))}
        </ul>
....
```

```bash
npm run build
```

> Check in browser

## `range()` directive

The `range()` directive is used to generate an iterable of integers. For example:

```js
range(4);
```

Returns an array as follows:

```js
[0, 1 , 2, 3, 4]
```
