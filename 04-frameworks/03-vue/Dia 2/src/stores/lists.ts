import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { List, ListItem, ListInsert, ListItemInsert } from '../types'
import {
  getAllListsOrdered,
  putList,
  updateListById,
  deleteListById,
  getItemsByListOrdered,
  putItem,
  updateItemById,
  deleteItemById,
  deleteItemsByList,
} from '../lib/indexeddb'

export const useListStore = defineStore('lists', () => {
  const lists = ref<List[]>([])
  const listItems = ref<Map<string, ListItem[]>>(new Map())
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchLists = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await getAllListsOrdered()
      lists.value = data || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch lists'
    } finally {
      loading.value = false
    }
  }

  const fetchListItems = async (listId: string) => {
    try {
      const data = await getItemsByListOrdered(listId)
      listItems.value.set(listId, data || [])
      return data || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch list items'
      return []
    }
  }

  const createList = async (title: string = 'Untitled List') => {
    try {
      const maxPosition =
        lists.value.length > 0 ? Math.max(...lists.value.map((l) => l.position)) : -1

      const toInsert: ListInsert = { title, position: maxPosition + 1 }
      const newList: List = {
        id: crypto.randomUUID(),
        title: toInsert.title,
        position: toInsert.position,
        createdAt: Date.now(),
      }
      await putList(newList)
      lists.value.push(newList)
      return newList
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create list'
      return null
    }
  }

  const updateList = async (listId: string, updates: { title?: string; position?: number }) => {
    try {
      const updated = await updateListById(listId, updates)
      if (updated) {
        const index = lists.value.findIndex((l) => l.id === listId)
        if (index !== -1) lists.value[index] = updated
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update list'
    }
  }

  const deleteList = async (listId: string) => {
    try {
      await deleteListById(listId)
      await deleteItemsByList(listId)
      lists.value = lists.value.filter((l) => l.id !== listId)
      listItems.value.delete(listId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete list'
    }
  }

  const createListItem = async (listId: string, content: string = '') => {
    try {
      const items = listItems.value.get(listId) || []
      const maxPosition = items.length > 0 ? Math.max(...items.map((i) => i.position)) : -1

      const toInsert: ListItemInsert = {
        listId: listId,
        content,
        position: maxPosition + 1,
      }
      const newItem: ListItem = {
        id: crypto.randomUUID(),
        listId: toInsert.listId,
        content: toInsert.content,
        position: toInsert.position,
        isChecked: false,
        createdAt: Date.now(),
      }
      await putItem(newItem)
      const currentItems = listItems.value.get(listId) || []
      listItems.value.set(listId, [...currentItems, newItem])
      return newItem
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create item'
      return null
    }
  }

  const updateListItem = async (
    itemId: string,
    listId: string,
    updates: { content?: string; isChecked?: boolean; position?: number },
  ) => {
    try {
      const updated = await updateItemById(itemId, updates)
      if (updated) {
        const items = listItems.value.get(listId) || []
        const index = items.findIndex((i) => i.id === itemId)
        if (index !== -1) {
          items[index] = updated
          listItems.value.set(listId, [...items])
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update item'
    }
  }

  const deleteListItem = async (itemId: string, listId: string) => {
    try {
      await deleteItemById(itemId)
      const items = listItems.value.get(listId) || []
      listItems.value.set(
        listId,
        items.filter((i) => i.id !== itemId),
      )
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete item'
    }
  }

  const reorderListItems = async (listId: string, reorderedItems: ListItem[]) => {
    try {
      const updated = reorderedItems.map((item, index) => ({ ...item, position: index }))
      listItems.value.set(listId, updated)
      await Promise.all(updated.map((item) => updateItemById(item.id, { position: item.position })))
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to reorder items'
    }
  }

  const getList = (listId: string) => {
    return lists.value.find((l) => l.id === listId)
  }

  const getListItems = (listId: string) => {
    return listItems.value.get(listId) || []
  }

  return {
    lists,
    listItems,
    loading,
    error,
    fetchLists,
    fetchListItems,
    createList,
    updateList,
    deleteList,
    createListItem,
    updateListItem,
    deleteListItem,
    reorderListItems,
    getList,
    getListItems,
  }
})
