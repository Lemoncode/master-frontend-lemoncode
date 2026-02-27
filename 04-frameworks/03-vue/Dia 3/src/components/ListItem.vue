<script setup lang="ts">
import { useUndo } from '@/composables/useUndo'
import { useListStore } from '@/stores/lists'
import type { ListItem } from '@/types'
import { ref } from 'vue'

const props = defineProps<{
  item: ListItem
  listId: string
  isDragging?: boolean
}>()

const emit = defineEmits<{
  dragStart: []
  dragEnter: []
  dragEnd: []
  dragOver: [e: DragEvent]
  // newItem: [newItemId: string];
}>()

const isEditing = ref(false)
const content = ref(props.item.content)

const startEditing = () => {
  isEditing.value = true
}

const listStore = useListStore()
const { addAction } = useUndo()

const saveContent = async () => {
  if (content.value !== props.item.content) {
    const oldContent = props.item.content
    const newContent = content.value

    await listStore.updateListItem(props.item.id, props.listId, { content: content.value })

    addAction({
      undo: async () => {
        content.value = oldContent
        await listStore.updateListItem(props.item.id, props.listId, { content: oldContent })
      },
      redo: async () => {
        content.value = newContent
        await listStore.updateListItem(props.item.id, props.listId, { content: newContent })
      },
    })
  }
}

const handleKeydown = async (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    await saveContent()
    // TODo create next item in the list
    isEditing.value = false
  } else if (event.key === 'Escape') {
    content.value = props.item.content
    isEditing.value = false
  }
}

const toggleChecked = async () => {
  await listStore.updateListItem(props.item.id, props.listId, { isChecked: !props.item.isChecked })
}

const deleteItem = async () => {
  const deletedItem = { ...props.item }

  await listStore.deleteListItem(props.item.id, props.listId)

  addAction({
    undo: async () => {
      const newItem = await listStore.createListItem(props.listId, deletedItem.content)
      if (newItem) {
        await listStore.updateListItem(newItem.id, props.listId, {
          isChecked: deletedItem.isChecked,
          position: deletedItem.position,
        })
      }
    },
    redo: async () => {
      await listStore.deleteListItem(deletedItem.id, props.listId)
    },
  })
}
</script>

<template>
  <div
    :class="[
      'flex items-center gap-3 p-3 bg-dark-hover rounded-lg border border-transparent hover:border-dark-border transition-all cursor-move group',
      { 'opacity-50': isDragging },
    ]"
    :draggable="true"
    @dragstart="emit('dragStart')"
    @dragenter="emit('dragEnter')"
    @dragover="emit('dragOver', $event)"
    @dragend="emit('dragEnd')"
  >
    <button
      @click="toggleChecked"
      :class="[
        'flex-shrink-0 w-5 h-5 rounded border-2 transition-colors flex items-center justify-center',
        {
          'bg-blue-600 border-blue-600': item.isChecked,
          'border-gray-500 hover:border-gray-400': !item.isChecked,
        },
      ]"
    >
      <svg
        v-if="item.isChecked"
        class="w-3 h-3 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
      </svg>
    </button>

    <button
      @click="startEditing"
      v-if="!isEditing"
      class="flex-1 cursor-text bg-transparent border-none text-left p-0 m-0"
    >
      <span
        :class="['text-white transition-all', { 'line-through text-gray-500': item.isChecked }]"
      >
        {{ item.content || 'Click to edit' }}
      </span>
    </button>

    <input
      v-else
      type="text"
      v-model="content"
      @blur="saveContent"
      @keydown="handleKeydown"
      class="flex-1 bg-dark-bg text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter item text"
    />

    <button
      @click="deleteItem"
      class="flex-shrink-0 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <div class="flex-shrink-0 text-gray-600 cursor-move">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
      </svg>
    </div>
  </div>
</template>
