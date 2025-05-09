# Multiple Templates

We want to add more functionality to our task-list component. To have a more aintainable code, lets first refactor our render so we get a cleaner solution.

Update `src/task-list/task-list.ts`

```ts
renderTodos = () => html`
  <ul>
    ${this._listItems.map(
      (t) =>
        html`<li
          class="${t.completed ? "completed" : ""}"
          @click=${() => this.toggleCompleted(t)}
        >
          ${t.title}
        </li>`
    )}
  </ul>
`;
```

```diff
....
  override render() {
    return html`
      <h2>Tasks!</h2>
-     <ul>
-       ${this._listItems.map(
-         (t) =>
-           html`<li
-             class="${t.completed ? "completed" : ""}"
-             @click=${() => this.toggleCompleted(t)}
-           >
-             ${t.title}
-           </li>`
-       )}
-     </ul>
+     ${this.renderTodos()}
      <input />
      <button @click="${this.addTask}">Add Task</button>
    `;
  }
....
```

We are going to add a new `input` of type checkbox. So lets first refactor the only one that we have:

```diff
....
  override render() {
    return html`
      <h2>Tasks!</h2>
      ${this.renderTodos()}
-     <input />
+     <input id="newTask" aria-label="New task" />
      <button @click="${this.addTask}">Add Task</button>
    `;
  }

  toggleCompleted(task: Task) {
    console.log(task);
    task.completed = !task.completed;
    this.requestUpdate();
  }

- @query("input")
+ @query("#newTask")
  input!: HTMLInputElement;
```

> Check in browser

```diff
....
@customElement("task-list")
export class TaskList extends LitElement {
  static override styles = css`
    .completed {
      text-decoration-line: line-through;
      color: #333;
    }
  `;

  ....

+ @property()
+ hideCompleted = false;
....
  toggleCompleted(task: Task) {
    console.log(task);
    task.completed = !task.completed;
    this.requestUpdate();
  }
+
+ setHideCompleted(e: Event) {
+   this.hideCompleted = (e.target as HTMLInputElement).checked;
+ }
+
  @query("#newTask")
  input!: HTMLInputElement;
....
```

```diff
....
  override render() {
    return html`
      <h2>Tasks!</h2>
      ${this.renderTodos()}
      <input id="newTask" aria-label="New task" />
      <button @click="${this.addTask}">Add Task</button>
+     <br />
+     <label>
+       <input
+         type="checkbox"
+         @change=${this.setHideCompleted}
+         ?checked=${this.hideCompleted}
+       />
+       Hide completed
+     </label>
    `;
  }
....
```

Now we are ready to filter the completed tasks.

```ts
/*diff*/
renderTodos = () => {
  const items = this.hideCompleted
    ? this._listItems.filter((t) => !t.completed)
    : this._listItems;

  return html`
    <ul>
      ${items.map(
        (t) =>
          html`<li
            class="${t.completed ? "completed" : ""}"
            @click=${() => this.toggleCompleted(t)}
          >
            ${t.title}
          </li>`
      )}
    </ul>
  `;
};
/*diff*/
```

Now if we complete all our tasks, notice that nothing is displayed, this would be awkward to users, so lets fix it.

```diff
....
- renderTodos = (items) => {
+ renderTodos = (items: Task[]) => {
- const items = this.hideCompleted
-   ? this._listItems.filter((t) => !t.completed)
-   : this._listItems;

    return html`
      <ul>
        ${items.map(
          (t) =>
            html`<li
              class="${t.completed ? "completed" : ""}"
              @click=${() => this.toggleCompleted(t)}
            >
              ${t.title}
            </li>`
        )}
      </ul>
    `;
  };
....
```

```ts
renderTodosOrMessage = () => {
  const items = this.hideCompleted
    ? this._listItems.filter((t) => !t.completed)
    : this._listItems;

  const completedMessage = html`<p>All done!!</p>`;
  const itemsOrMessage =
    items.length > 0 ? this.renderTodos(items) : completedMessage;

  return itemsOrMessage;
};
```

```diff
....
  override render() {
    return html`
      <h2>Tasks!</h2>
-     ${this.renderTodos()}
+     ${this.renderTodosOrMessage()}
....
```

> Check in browser