# Styles

We can encapsulate styles into a Lit component, by using the `css` tagged function.

Update `src/task-list/task-list.ts`

```diff
-import { LitElement, html } from "lit";
+import { LitElement, css, html } from "lit";
....
@customElement("task-list")
export class TaskList extends LitElement {
+ static override styles = css`
+   .completed {
+     text-decoration-line: line-through;
+     color: #333;
+   }
+ `;
....
```

Lets add a method that allows us to change a task state.

```ts
  toggleCompleted(task: Task) {
    task.completed = !task.completed;
    this.requestUpdate();
  }
```

Because we are using the reference to a `Task` we are using `requestUpdate`, that will trigger an update cycle.


```diff
  override render() {
    return html`
      <h2>Tasks!</h2>
      <ul>
-       ${this._listItems.map((t) => html`<li>${t.title}</li>`)}
+       ${this._listItems.map(
+         (t) =>
+           html`<li
+             class="${t.completed ? "completed" : ""}"
+             @click=${() => this.toggleCompleted(t)}
+           >
+             ${t.title}
+           </li>`
+       )}
      </ul>
      <input />
      <button @click="${this.addTask}">Add Task</button>
    `;
  }
```

> Check in browser

