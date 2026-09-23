import { ref, onMounted, onUnmounted } from 'vue'

export interface UndoAction {
  undo: () => void | Promise<void>
  redo: () => void | Promise<void>
}

export function useUndo() {
  const undoStack = ref<UndoAction[]>([])
  const redoStack = ref<UndoAction[]>([])
  const maxStackSize = 50

  const addAction = (action: UndoAction) => {
    undoStack.value.push(action)
    if (undoStack.value.length > maxStackSize) {
      undoStack.value.shift()
    }
    redoStack.value = []
  }

  const undo = async () => {
    const action = undoStack.value.pop()
    if (action) {
      await action.undo()
      redoStack.value.push(action)
    }
  }

  const redo = async () => {
    const action = redoStack.value.pop()
    if (action) {
      await action.redo()
      undoStack.value.push(action)
    }
  }

  const canUndo = () => undoStack.value.length > 0
  const canRedo = () => redoStack.value.length > 0

  const handleKeydown = async (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      if (canUndo()) {
        await undo()
      }
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault()
      if (canRedo()) {
        await redo()
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    addAction,
    undo,
    redo,
    canUndo,
    canRedo,
  }
}
