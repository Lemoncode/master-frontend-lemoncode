import { beforeEach, describe, expect, it } from 'vite-plus/test'
import { createPinia, setActivePinia } from 'pinia'
import { useListsStore } from '../useLists'

describe('useListsStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('creates, updates and deletes lists and items', () => {
    const store = useListsStore()

    const list = store.createList('Prueba')
    expect(store.lists.some((candidate) => candidate.id === list.id)).toBe(true)

    store.updateList(list.id, { title: 'Actualizada' })
    expect(store.listById(list.id)?.title).toBe('Actualizada')

    const item = store.createListItem(list.id, 'Primer elemento')
    expect(store.itemsForList(list.id)).toHaveLength(1)

    store.updateListItem(item.id, { isChecked: true })
    expect(store.itemsForList(list.id)[0]?.isChecked).toBe(true)

    store.deleteListItem(item.id)
    expect(store.itemsForList(list.id)).toHaveLength(0)

    store.deleteList(list.id)
    expect(store.listById(list.id)).toBeUndefined()
  })
})
