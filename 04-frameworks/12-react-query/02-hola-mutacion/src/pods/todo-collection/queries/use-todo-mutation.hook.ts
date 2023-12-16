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
  });

  return {
    insertTodoMutation,
    updateTodoMutation,
  };
};
