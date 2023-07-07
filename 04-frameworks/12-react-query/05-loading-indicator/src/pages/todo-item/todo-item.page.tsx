import * as React from "react";
import { useParams } from "react-router-dom";
import { todoKeys } from "../../core/query/query-keys";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTodoItem } from "./todo-item.api";

const useTodoQueries = () => {
  const queryClient = useQueryClient();

  const loadTodoItem = (id: string, disableQuery: boolean) => {
    return useQuery(
      [...todoKeys.todoItem(), id],
      () => {
        return getTodoItem(id);
      },
      {
        enabled: disableQuery,
        retry: false,
      }
    );
  };

  return { loadTodoItem };
};

export const TodoItemPage = () => {
  const { id } = useParams();
  const { loadTodoItem } = useTodoQueries();
  // TODO: dejamos el isError de momento
  const { data } = loadTodoItem(id, true);

  return (
    <div>
      <h2>Todo Id: {id}</h2>
      {data && (
        <>
          <h2>Done: {data.isDone ? "Done" : "Pending"}</h2>
          <h2>Description: {data.description}</h2>
        </>
      )}
    </div>
  );
};
