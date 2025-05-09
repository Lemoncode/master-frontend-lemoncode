# Working with Lists III

## Handling Events in Lists

There are several ways of adding event listeners to list items in your template. You also need to make sure that the event handler can identify which item the event is related to.

Update `src/task-list/task.model.ts`

```diff
export interface Task {
  title: string;
  completed: boolean;
+ id?: number;
}

```

Update `src/task-list/task-list.ts`

```diff
....
  @state()
  private _listItems: Task[] = [
    {
      completed: false,
      title: "Shopping",
+     id: 1,
    },
    {
      completed: false,
      title: "Movies",
+     id: 2,
    },
    {
      completed: true,
      title: "Study",
+     id: 3,
    },
  ];
....
  renderTodos = (items: Task[]) => {
    return html`
      <ul>
        ${items.map(
          (t) =>
            html`<li
              class="${t.completed ? "completed" : ""}"
              @click=${() => this.toggleCompleted(t)}
            >
              ${t.title}
+             <button @click=${() => this.deleteTask(t.id!)}>Delete</button>
            </li>`
        )}
      </ul>
    `;
  };
+
+ private deleteTask(id: number) {
+   this._listItems = this._listItems.filter((i) => i.id !== id);
+ }
+
....
```

```bash
npm run dev
```

Update `dev/index.html`

```diff
....
-  <script type="module" src="../dist/list-examples/list-examples-repeat.js"></script>
+   <script type="module" src="../dist/task-list/task-list.js"></script>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
      }
    </style>
  </head>
  <body>
-   <list-examples-repeat></list-examples-repeat>
+   <task-list></task-list>
  </body>
....
```

> Check in browser

Seems to work, but there is a bug... Could you figure out what is? Try to fix the bug and them come back to solution.

## Bug Fix

When we are adding the new task we are not populating the ID, to avoid issues overlaping values use `crypto.UUID`