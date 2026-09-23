import type { List, ListItem } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useListsStore = defineStore("lists", () => {
  const lists = ref<List[]>([]);
  const listItems = ref<Map<List["id"], ListItem[]>>(new Map());

  const createList = async (title: string) => {
    const newList = {
      id: crypto.randomUUID(),
      title,
      position: lists.value.length + 1,
      createdAt: new Date(),
    };

    lists.value.push(newList);

    return newList;
  };

  const updateList = async (listId: string, updatedList: Partial<List>) => {
    const list = lists.value.find((list) => list.id === listId);
    if (list) {
      Object.assign(list, updatedList);
    }
  };

  const deleteList = async (listId: string) => {
    lists.value = lists.value.filter((list) => list.id !== listId);
  };

  const createListItem = async (listId: string, content = "") => {
    const isListCreated = listItems.value.has(listId);

    let position = 0;
    if (isListCreated) {
      position = listItems.value.get(listId)?.length || 0;
    }
    const newListItem: ListItem = {
      id: crypto.randomUUID(),
      listId,
      content,
      isChecked: false,
      position,
      createdAt: Date.now(),
    };

    if (isListCreated) {
      listItems.value.get(listId)?.push(newListItem);
    } else {
      listItems.value.set(listId, [newListItem]);
    }

    return newListItem;
  };

  const getListItems = async (listId: string) => {
    return listItems.value.get(listId) || [];
  };

  const updateListItem = async (itemId: string, listId: string, updatedItem: Partial<ListItem>) => {
    const listItemsIternal = await getListItems(listId);
    const item = listItemsIternal.find((item) => item.id === itemId);
    if (item) {
      Object.assign(item, updatedItem);
    }
    listItems.value.set(listId, listItemsIternal);
  };

  const deleteListItem = async (itemId: string, listId: string) => {
    const listItemsIternal = await getListItems(listId);
    const item = listItemsIternal.find((item) => item.id === itemId);
    if (item) {
      listItemsIternal.splice(listItemsIternal.indexOf(item), 1);
    }
    listItems.value.set(listId, listItemsIternal);
  };

  return {
    lists,
    listItems,
    createList,
    updateList,
    deleteList,
    getListItems,
    updateListItem,
    createListItem,
    deleteListItem,
  };
});
