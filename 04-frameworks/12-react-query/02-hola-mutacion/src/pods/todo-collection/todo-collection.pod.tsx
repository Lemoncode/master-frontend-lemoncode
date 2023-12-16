import React from "react";
import { useTodoCollectionQuery } from "./use-todo-collection-query.hook";
import classes from "./todo-collection.pod.module.css";

export const TodoCollectionPod: React.FC = () => {
  const [connectionLost, setConnectionLost] = React.useState(false);
  const { todoCollection, isError } = useTodoCollectionQuery(!connectionLost);

  React.useEffect(() => {
    if (isError) {
      setConnectionLost(true);
    }
  }, [isError]);

  if (isError) {
    return <button onClick={() => setConnectionLost(false)}>Reconectar</button>;
  }

  return (
    <div>
      <h1>Todo Collection POD</h1>
      <div className={classes.todoList}>
        {todoCollection.map((todo) => (
          <React.Fragment key={todo.id}>
            <div>{todo.isDone ? "✅" : "⭕️"}</div>
            <div>{todo.description}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
