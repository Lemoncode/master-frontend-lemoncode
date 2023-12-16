import React from "react";
import { Mode, TodoVm } from "../todo-collection.vm";
import { TodoDisplayComponent, TodoEditRowComponent } from "./rows";

interface Props {
  editingId: number;
  mode: Mode;
  todo: TodoVm;
  onEnterEditMode: (id: number) => void;
  onUpdate: (item: TodoVm) => void;
  onCancel: () => void;
}

export const TodoRowComponent: React.FC<Props> = (props: Props) => {
  const { todo, editingId, mode, onEnterEditMode, onUpdate, onCancel } = props;

  return (
    <>
      {mode === "Readonly" || todo.id !== editingId ? (
        <TodoDisplayComponent
          key={todo.id}
          item={todo}
          onEdit={onEnterEditMode}
        />
      ) : (
        <TodoEditRowComponent
          key={todo.id}
          item={todo}
          onSave={onUpdate}
          onCancel={onCancel}
        />
      )}
    </>
  );
};
