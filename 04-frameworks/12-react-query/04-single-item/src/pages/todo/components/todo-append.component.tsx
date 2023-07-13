import React from "react";
import { Mode, TodoItem, createEmptyTodoItem } from "../todo.model";
import { TodoItemEdit } from "./todo-item-edit.component";

interface Props {
  mode: Mode;
  setAppendMode: () => void;
  onCancel: () => void;
  onAppend: (item: TodoItem) => void;
}

export const TodoAppendComponent: React.FC<Props> = (props: Props) => {
  const { mode, setAppendMode, onAppend, onCancel } = props;

  return (
    <div>
      {mode !== "Append" ? (
        <button onClick={setAppendMode}>Enter Insert New TODO Mode</button>
      ) : (
        <div>
          <TodoItemEdit
            item={createEmptyTodoItem()}
            onSave={onAppend}
            onCancel={onCancel}
          />
        </div>
      )}
    </div>
  );
};
