import type { List } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useListsStore = defineStore("lists", () => {
  const lists = ref<List[]>([]);

  const createList = async (title: string) => {
    const newList = {
      id: crypto.randomUUID(),
      title,
      position: lists.value.length + 1,
      createdAt: new Date(),
    };

    lists.value.push(newList);
  };

  return { lists, createList };
});
