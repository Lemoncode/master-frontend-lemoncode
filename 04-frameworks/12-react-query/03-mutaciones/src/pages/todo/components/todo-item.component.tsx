import React from "react";
import { TodoItem, Mode } from "../todo.model";
import { TodoItemEdit } from "./todo-item-edit.component";
import { TodoItemDisplay } from "./todo-item-display.component";

interface Props {
  editingId: number;
  mode: Mode;
  todo: TodoItem;
  onEnterEditMode: (id: number) => void;
  onUpdate: (item: TodoItem) => void;
  onCancel: () => void;
}

export const TodoItemComponent: React.FC<Props> = (props: Props) => {
  const { todo, editingId, mode, onEnterEditMode, onUpdate, onCancel } = props;

  return (
    <>
      {mode === "Readonly" || todo.id !== editingId ? (
        <TodoItemDisplay key={todo.id} item={todo} onEdit={onEnterEditMode} />
      ) : (
        <TodoItemEdit
          key={todo.id}
          item={todo}
          onSave={onUpdate}
          onCancel={onCancel}
        />
      )}
    </>
  );
};
