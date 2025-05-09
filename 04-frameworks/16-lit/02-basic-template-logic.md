# Basic Template Logic

Lets create a new component `task-list`. This component it's going to be a task that could be chopped into sub tasks. Lets start it simple.

Create `src/task-list/task.model.ts`

```ts
export interface Task {
  title: string;
  completed: boolean;
}
```

Lets create the component. The inner state of a component must remind private to the component and not be accesiible from outside. We can define properties as _internal reactive state_. It works just like a reactive property, but it isn't exposed as an attribute, and shouldn't be accessed from outside the component.

Create `src/task-list/task-list.ts`

```ts
import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Task } from "./task.model";

@customElement("task-list")
export class TaskList extends LitElement {
  @state()
  private _listItems: Task[] = [
    {
      completed: false,
      title: "Shopping",
    },
    {
      completed: false,
      title: "Movies",
    },
    {
      completed: true,
      title: "Study",
    },
  ];

  override render() {}
}
```

What we want to do is render the list of tasks, we can use standard JavaScript in Lit expressions to create conditional or repeating templates.

```diff
....
   override render() {
+   return html`
+     <h2>Tasks!</h2>
+     <ul>
+       ${this._listItems.map((t) => html`<li>${t.title}</li>`)}
+     </ul>
+   `;
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
-   <script type="module" src="../dist/lc-greetings.js"></script>
+   <script type="module" src="../dist/task-list/task-list.js"></script>
    <style>
      p {
        border: solid 1px solid;
        padding: 8px;
      }
    </style>
  </head>
  <body>
-   <lc-greetings></lc-greetings>
+   <task-list></task-list>
  </body>
</html>

```

```bash
npm run serve
```

We want o add a new functionality, we want to be able to add a new task, for that purpose we are going to add an input and a button into our template.

Update `src/task-list/task-list.ts`

```diff
....
  override render() {
    return html`
      <h2>Tasks!</h2>
      <ul>
        ${this._listItems.map((t) => html`<li>${t.title}</li>`)}
      </ul>
+     <input />
+     <button>Add Task</button>
    `;
  }
....
```

The behavior that we want is to write down into the input, and when we click the button, update the tasks list and clean the input value.

Update `src/task-list/task-list.ts`

```ts
// ....
export class TaskList extends LitElement {
  // ....

  override render() {
    return html`
      <h2>Tasks!</h2>
      <ul>
        ${this._listItems.map((t) => html`<li>${t.title}</li>`)}
      </ul>
      <input />
      <!-- diff -->
      <button @click="${this.addTask}">Add Task</button>
      <!-- diff -->
    `;
  }
  /*diff*/
  addTask() {
    const inputElement = this.shadowRoot?.querySelector("input");
    const newTask = (inputElement as HTMLInputElement).value;
    this._listItems.push({
      completed: false,
      title: newTask,
    });
    (inputElement as HTMLInputElement).value = "";
  }
  /*diff*/
}
```

If we test it now on browser, we will notice that is **NOT working**. Why is this? Well recall that `_listItems` is an iternal reactive property, it updates with immutable values.

Update `src/task-list/task-list.ts`


```diff
....
  addTask() {
    const inputElement = this.shadowRoot?.querySelector("input");
    const newTask = (inputElement as HTMLInputElement).value;
-   this._listItems.push({
-     completed: false,
-     title: newTask,
-   });
+   this._listItems = [
+     ...this._listItems,
+     { title: newTask, completed: false },
+   ];
    (inputElement as HTMLInputElement).value = "";
  }
....
```

> Check in browser

This is ok, but directly accessing the `shadowRoot` is pretty verbose, Lit comes with a set of built-in decorators that can help us accesing the elemnts in our component.

Update `src/task-list/task-list.ts`

```diff
import { LitElement, html } from "lit";
-import { customElement, state } from "lit/decorators.js";
+import { customElement, state, query } from "lit/decorators.js";
....
```

```diff
....
+ @query("input")
+ input!: HTMLInputElement;

  addTask() {
-   const inputElement = this.shadowRoot?.querySelector("input");
-   const newTask = (inputElement as HTMLInputElement).value;
    this._listItems = [
      ...this._listItems,
-     { title: newTask, completed: false },
+     { title: this.input.value, completed: false },
    ];
-   (inputElement as HTMLInputElement).value = "";
+   this.input.value = "";
  }
}
```

> Check in browser