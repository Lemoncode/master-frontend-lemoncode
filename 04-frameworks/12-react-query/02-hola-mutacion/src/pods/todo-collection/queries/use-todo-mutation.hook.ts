import { produce } from "immer";
import { TodoVm } from "../todo-collection.vm";
import { useMutation } from "@tanstack/react-query";
import { insertTodo, updateTodo } from "../todo-collection.repository";
import { queryClient, todoKeys } from "@/core/react-query";

export const useTodoMutation = () => {
  const { mutate: insertTodoMutation } = useMutation({
    mutationFn: insertTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: todoKeys.todoCollection(),
      });
    },
  });

  const { mutate: updateTodoMutation } = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: todoKeys.todoCollection(),
      });
    },
    onMutate: async (newTodo: TodoVm) => {
      // TODO Aquí hay que hacer más cosas, ver este ejemplo
      // https://tanstack.com/query/latest/docs/react/guides/optimistic-updates
      queryClient.setQueryData(todoKeys.todoCollection(), (old: TodoVm[]) => {
        return produce(old, (draft: TodoVm[]) => {
          const index = draft.findIndex((item) => item.id === newTodo.id);
          if (index !== -1) {
            draft[index] = newTodo;
          }
        });
      });
    },
  });

  return {
    insertTodoMutation,
    updateTodoMutation,
  };
};
