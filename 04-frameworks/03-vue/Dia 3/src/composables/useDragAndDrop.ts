import { ref, type Ref } from 'vue'

export function useDragAndDrop<T extends { id: string }>(
  itemsRef: Ref<T[]>,
  onReorder: (reorderedItems: T[]) => void,
) {
  const draggedItem = ref<T | null>(null)
  const draggedOverItem = ref<T | null>(null)
  const hasReordered = ref(false)

  const reorderBetween = (sourceId: string, targetId: string) => {
    const items = itemsRef.value
    const draggedIndex = items.findIndex((i) => i.id === sourceId)
    const targetIndexRaw = items.findIndex((i) => i.id === targetId)
    if (draggedIndex === -1 || targetIndexRaw === -1) return
    if (draggedIndex === targetIndexRaw) return

    const reorderedItems = [...items]
    const [removed] = reorderedItems.splice(draggedIndex, 1)
    reorderedItems.splice(targetIndexRaw, 0, removed!)
    onReorder(reorderedItems)
  }

  const resetDragState = () => {
    draggedItem.value = null
    draggedOverItem.value = null
    hasReordered.value = false
  }

  const handleDragStart = (item: T) => {
    draggedItem.value = item
    hasReordered.value = false
  }

  const handleDragEnter = (item: T) => {
    if (!draggedItem.value || draggedItem.value.id === item.id) return
    draggedOverItem.value = item
  }

  const handleDrop = (item?: T) => {
    if (!draggedItem.value) return
    const target = item ?? draggedOverItem.value
    if (!target) return
    reorderBetween(draggedItem.value.id, target.id)
    hasReordered.value = true
  }

  const handleDragEnd = () => {
    if (draggedItem.value && draggedOverItem.value && !hasReordered.value) {
      reorderBetween(draggedItem.value.id, draggedOverItem.value.id)
    }
    resetDragState()
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
  }

  return {
    draggedItem,
    draggedOverItem,
    handleDragStart,
    handleDragEnter,
    handleDrop,
    handleDragEnd,
    handleDragOver,
  }
}
