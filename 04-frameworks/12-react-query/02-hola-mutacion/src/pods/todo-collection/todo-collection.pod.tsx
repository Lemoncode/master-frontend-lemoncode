import React from "react";
import { Mode, TodoVm } from "./todo-collection.vm";
import classes from "./todo-collection.pod.module.css";
import { TodoAppendComponent, TodoRowComponent } from "./components";
import { useTodoCollectionQuery, useTodoMutation } from "./queries";

const usePodQuery = () => {
  const [mode, setMode] = React.useState<Mode>("Readonly");
  // TODO: Mover ese -1 a una constante
  const [editingId, setEditingId] = React.useState(-1);
  const [connectionLost, setConnectionLost] = React.useState(false);
  const { todoCollection, isError } = useTodoCollectionQuery(!connectionLost);
  const { insertTodoMutation, updateTodoMutation } = useTodoMutation();

  React.useEffect(() => {
    if (isError) {
      setConnectionLost(true);
    }
  }, [isError]);

  return {
    mode,
    editingId,
    setEditingId,
    setMode,
    connectionLost,
    setConnectionLost,
    todoCollection,
    insertTodoMutation,
    updateTodoMutation,
    isError,
  };
};

export const TodoCollectionPod: React.FC = () => {
  const {
    mode,
    setMode,
    editingId,
    setEditingId,
    todoCollection,
    insertTodoMutation,
    updateTodoMutation,
    isError,
    setConnectionLost,
  } = usePodQuery();

  const handleAppend = (item: TodoVm) => {
    insertTodoMutation(item);
    setMode("Readonly");
  };

  // TODO: esto lo podemos mover al hook usePodQuery
  const setReadonlyMode = () => {
    setMode("Readonly");
    setEditingId(-1);
  };

  const handleEnterEditMode = (id: number) => {
    console.log("** Enter Edit mode");
    setMode("Edit");
    // TODO... más cosas por venir
    setEditingId(id);
  };

  const handleUpdate = (item: TodoVm) => {
    updateTodoMutation(item);
    setReadonlyMode();
  };

  const handleCancel = () => {
    setReadonlyMode();
  };

  if (isError) {
    return <button onClick={() => setConnectionLost(false)}>Reconectar</button>;
  }

  return (
    <div>
      <h1>Todo Collection POD</h1>
      <div className={classes.todoList}>
        {todoCollection.map((todo) => (
          <TodoRowComponent
            key={todo.id}
            editingId={editingId}
            mode={mode}
            todo={todo}
            onEnterEditMode={handleEnterEditMode}
            onUpdate={handleUpdate}
            onCancel={handleCancel}
          />
        ))}
      </div>
      <TodoAppendComponent
        mode={mode}
        setAppendMode={() => setMode("Append")}
        onCancel={() => setMode("Readonly")}
        onAppend={handleAppend}
      />
    </div>
  );
};
