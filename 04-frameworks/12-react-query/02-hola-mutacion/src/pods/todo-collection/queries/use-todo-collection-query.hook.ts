import { todoKeys } from "@/core/react-query";
import { getTodoCollection } from "../todo-collection.repository";
import { useQuery } from "@tanstack/react-query";
import { TodoVm } from "../todo-collection.vm";

export const useTodoCollectionQuery = (enabled: boolean) => {
  const { data: todoCollection = [], isError } = useQuery<TodoVm[]>({
    queryKey: todoKeys.todoCollection(),
    queryFn: () => getTodoCollection(),
    refetchOnWindowFocus: false,
    enabled,
    retry: false,
  });

  return {
    todoCollection,
    isError,
  };
};
