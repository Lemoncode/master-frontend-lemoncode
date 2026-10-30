import { describe, expect, it } from 'vite-plus/test'
import { useLists } from '../useLists'

describe('useLists', () => {
  it('creates, updates and deletes lists and items', () => {
    const {
      lists,
      listById,
      itemsForList,
      createList,
      updateList,
      deleteList,
      createListItem,
      updateListItem,
      deleteListItem,
    } = useLists()

    const list = createList('Prueba')
    expect(lists.value.some((candidate) => candidate.id === list.id)).toBe(true)

    updateList(list.id, { title: 'Actualizada' })
    expect(listById(list.id)?.title).toBe('Actualizada')

    const item = createListItem(list.id, 'Primer elemento')
    expect(itemsForList(list.id)).toHaveLength(1)

    updateListItem(item.id, { isChecked: true })
    expect(itemsForList(list.id)[0]?.isChecked).toBe(true)

    deleteListItem(item.id)
    expect(itemsForList(list.id)).toHaveLength(0)

    deleteList(list.id)
    expect(listById(list.id)).toBeUndefined()
  })
})
