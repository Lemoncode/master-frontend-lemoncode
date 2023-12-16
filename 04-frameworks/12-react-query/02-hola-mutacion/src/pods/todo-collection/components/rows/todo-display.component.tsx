import React from "react";
import { TodoVm } from "../../todo-collection.vm";

interface Props {
  item: TodoVm;
  onEdit: (id: number) => void;
}

export const TodoDisplayComponent: React.FC<Props> = (props: Props) => {
  const { item, onEdit } = props;

  return (
    <>
      <div>{item.isDone ? "✅" : "⭕️"}</div>
      <div>{item.description}</div>
      <button onClick={() => onEdit(item.id)}>Edit</button>
    </>
  );
};
