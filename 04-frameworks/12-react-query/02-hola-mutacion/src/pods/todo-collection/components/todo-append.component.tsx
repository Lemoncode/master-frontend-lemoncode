import React from "react";
import { Mode, TodoVm, createEmptyTodoItem } from "../todo-collection.vm";
import { TodoItemEdit } from "./todo-item-edit.component";

interface Props {
  mode: Mode;
  setAppendMode: () => void;
  onCancel: () => void;
  onAppend: (item: TodoVm) => void;
}

export const TodoAppendComponent: React.FC<Props> = (props: Props) => {
  const { mode, setAppendMode, onAppend, onCancel } = props;

  return (
    <div>
      {mode !== "Append" ? (
        <button onClick={setAppendMode}>Enter Insert New TODO Mode</button>
      ) : (
        <TodoItemEdit
          item={createEmptyTodoItem()}
          onSave={onAppend}
          onCancel={onCancel}
        />
      )}
    </div>
  );
};
