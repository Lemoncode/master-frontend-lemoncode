import type { List, ListItem } from '@/types'
import { useLocalStorage } from './useLocalStorage'

const lists = useLocalStorage<List[]>('keep-clone:lists', [])
const items = useLocalStorage<ListItem[]>('keep-clone:items', [])

function createList(title = 'Nueva lista'): List {
  const list: List = {
    id: crypto.randomUUID(),
    title,
    position: lists.value.length + 1,
    createdAt: Date.now(),
  }

  lists.value.push(list)
  return list
}

function updateList(id: string, patch: Partial<List>) {
  const list = lists.value.find((list) => list.id === id)
  if (list) Object.assign(list, patch)
}

function deleteList(id: string) {
  lists.value = lists.value.filter((list) => list.id !== id)
  items.value = items.value.filter((item) => item.listId !== id)
}

function listById(id: string) {
  return lists.value.find((list) => list.id === id)
}

function itemsForList(listId: string) {
  return items.value.filter((item) => item.listId === listId)
}

function createListItem(listId: string, content = ''): ListItem {
  const item: ListItem = {
    id: crypto.randomUUID(),
    listId,
    content,
    isChecked: false,
    position: itemsForList(listId).length,
    createdAt: Date.now(),
  }

  items.value.push(item)
  return item
}

function updateListItem(id: string, patch: Partial<ListItem>) {
  const item = items.value.find((item) => item.id === id)
  if (item) Object.assign(item, patch)
}

function deleteListItem(id: string) {
  items.value = items.value.filter((item) => item.id !== id)
}

export function useLists() {
  return {
    lists,
    items,
    listById,
    itemsForList,
    createList,
    updateList,
    deleteList,
    createListItem,
    updateListItem,
    deleteListItem,
  }
}
