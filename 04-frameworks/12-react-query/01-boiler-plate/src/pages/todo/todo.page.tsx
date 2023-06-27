import React from "react";
import { Link } from "react-router-dom";
import classes from "./todo.page.css";
import axios from "axios";
import { TodoItem } from "./todo.model";

export const TodoPage: React.FC = () => {
  const [data, setData] = React.useState<TodoItem[]>([]);

  React.useEffect(() => {
    axios.get("http://localhost:3000/todos").then((res) => {
      setData(res.data);
    });
  }, []);

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
