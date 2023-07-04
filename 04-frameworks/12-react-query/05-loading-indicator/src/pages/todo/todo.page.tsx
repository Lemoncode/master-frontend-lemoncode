import React from "react";
import { produce } from "immer";
import { Link } from "react-router-dom";
import classes from "./todo.page.css";
import { getTodoList, appendTodoItem, updateTodoItem } from "./todo.api";
import { TodoItem, Mode } from "./todo.model";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoAppendComponent, TodoItemComponent } from "./components";
import { todoKeys } from "../../core/query/query-keys";
import { trackPromise } from "react-promise-tracker";

const useTodoQueries = () => {
  const queryClient = useQueryClient();

  const mutationSucceeded = () => {
    queryClient.invalidateQueries(todoKeys.todoList());
  };

  const appendMutation = useMutation(appendTodoItem, {
    onSuccess: () => {
      mutationSucceeded();
    },
  });

  const updateMutation = useMutation(updateTodoItem, {
    onMutate: async (newTodo: TodoItem) => {
      // TODO Aquí hay que hacer más cosas, ver este ejemplo
      // https://tanstack.com/query/latest/docs/react/guides/optimistic-updates
      queryClient.setQueryData(todoKeys.todoList(), (old) => {
        return produce(old, (draft: TodoItem[]) => {
          const index = draft.findIndex((item) => item.id === newTodo.id);
          if (index !== -1) {
            draft[index] = newTodo;
          }
        });
      });
    },
    onSuccess: () => {
      mutationSucceeded();
    },
  });

  const loadTodoList = (disableQuery: boolean) => {
    return useQuery(
      todoKeys.todoList(),
      () => {
        return trackPromise(getTodoList());
      },
      {
        enabled: disableQuery,
        retry: false,
      }
    );
  };

  return { queryClient, appendMutation, updateMutation, loadTodoList };
};

export const TodoPage: React.FC = () => {
  const [mode, setMode] = React.useState<Mode>("Readonly");
  // TODO: Mover ese -1 a una constante
  const [editingId, setEditingId] = React.useState(-1);
  const [isTodosEndPointDown, setIsTodosEndPointDown] = React.useState(false);

  const { loadTodoList, appendMutation, updateMutation } = useTodoQueries();

  const { data, isError, isLoading, isFetching, refetch,  } = loadTodoList(
    !isTodosEndPointDown
  );

  const handleAppend = (item: TodoItem) => {
    appendMutation.mutate(item);
    setMode("Readonly");
  };

  React.useEffect(() => {
    if (isError) {
      setIsTodosEndPointDown(true);
    }
  }, [isError]);

  React.useEffect(() => {
    if (isFetching) {
      console.log("Fetching...");
    } else {
      console.log("Done Fetching...");
    }
  }, [isFetching]);

  React.useEffect(() => {
    if (isLoading) {
      console.log("Loading...");
    } else {
      console.log("Done loading...");
    }
  }, [isLoading]);

  if (isTodosEndPointDown) {
    return (
      <button onClick={() => setIsTodosEndPointDown(false)}>Reconectar</button>
    );
  }

  const handleEnterEditMode = (id: number) => {
    setMode("Edit");
    setEditingId(id);
  };

  const handleUpdate = (item: TodoItem) => {
    updateMutation.mutate(item);
    setMode("Readonly");
  };

  return (
    <>
      <h1>Todo Page</h1>
      <div className={classes.todoList}>
        {data?.map((todo) => (
          <TodoItemComponent
            key={todo.id}
            mode={mode}
            editingId={editingId}
            todo={todo}
            onEnterEditMode={handleEnterEditMode}
            onUpdate={handleUpdate}
            onCancel={() => setMode("Readonly")}
          />
        ))}
      </div>
      <TodoAppendComponent
        mode={mode}
        setAppendMode={() => setMode("Append")}
        onCancel={() => setMode("Readonly")}
        onAppend={handleAppend}
      />
      <button onClick={() => refetch()}>Force load</button>
      <Link to="/pageb">To Page B</Link>
    </>
  );
};
