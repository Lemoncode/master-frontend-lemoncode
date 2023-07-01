import React from "react";
import { Link } from "react-router-dom";
import classes from "./todo.page.css";
import axios from "axios";
import { TodoItem } from "./todo.model";
import { useQuery } from "@tanstack/react-query";

export const TodoPage: React.FC = () => {
  const [isTodosEndPointDown, setIsTodosEndPointDown] = React.useState(false);

  const { data, isError } = useQuery(
    ["todolist"],
    () => {
      return axios.get("http://localhost:3000/todos").then((res) => {
        return res.data;
      });
    },
    {
      enabled: !isTodosEndPointDown,
      retry: false,
    }
  );

  React.useEffect(() => {
    if (isError) {
      setIsTodosEndPointDown(true);
    }
  }, [isError]);

  if (isTodosEndPointDown) {
    return (
      <button onClick={() => setIsTodosEndPointDown(false)}>Reconectar</button>
    );
  }

  return (
    <>
      <h1>Todo Page</h1>
      <div className={classes.todoList}>
        {data?.map((todo) => (
          <React.Fragment key={todo.id}>
            <div>{todo.isDone ? "✅" : "⭕️"}</div>
            <div>{todo.description}</div>
          </React.Fragment>
        ))}
      </div>
      <Link to="/pageb">To Page B</Link>
    </>
  );
};
