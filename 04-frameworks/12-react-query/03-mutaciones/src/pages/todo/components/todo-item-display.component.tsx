import React from "react";
import { TodoItem } from "../todo.model";

interface Props {
  item: TodoItem;
  onEdit: (id: number) => void;
}

export const TodoItemDisplay: React.FC<Props> = (props: Props) => {
  const { item, onEdit } = props;

  return (
    <React.Fragment key={item.id}>
      <div>{item.isDone ? "✅" : "⭕️"}</div>
      <div>{item.description}</div>
      <div>
        <button onClick={() => onEdit(item.id)}>Edit</button>
      </div>
    </React.Fragment>
  );
};
