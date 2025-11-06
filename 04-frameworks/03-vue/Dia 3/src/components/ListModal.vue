<script setup lang="ts">
import { useListStore } from '@/stores/lists'
import type { List } from '@/types'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IconClose from './Icons/IconClose.vue'
import IconTrash from './Icons/IconTrash.vue'
import IconPlus from './Icons/IconPlus.vue'
import ListItem from './ListItem.vue'
import { useDragAndDrop } from '@/composables/useDragAndDrop'

const route = useRoute()
const router = useRouter()

// List / Store
const listStore = useListStore()
const list = computed(() => listStore.getList(listId.value))
const listId = computed(() => route.params.id as string)
const items = computed(() => listStore.getListItems(listId.value))

// Title
const isEditingTitle = ref(false)
const title = ref('')
const titleInput = ref<HTMLInputElement | null>(null)

const startEditingTitle = async () => {
  isEditingTitle.value = true
  await nextTick()
  titleInput.value?.focus()
  titleInput.value?.select()
}

const saveTitle = async () => {
  const newTitle = title.value.trim()

  await listStore.updateList(listId.value, { title: newTitle })

  isEditingTitle.value = false
}

const handleTitleKeydown = () => {
  saveTitle()
}

const closeModal = () => {
  // progressive enhancement
  if ('startViewTransition' in document) {
    document.startViewTransition(() => router.push('/'))
  } else {
    router.push('/')
  }
}

const handleBackdropClick = () => {
  closeModal()
}

const handleDeleteList = async () => {
  if (confirm('Are you sure you want to delete this list?')) {
    await listStore.deleteList(listId.value)
  }
  closeModal()
}

const handleAddItem = async () => {
  await listStore.createListItem(listId.value, '')
}

const { handleDragStart, handleDragEnter, handleDragEnd, handleDragOver, draggedItem } =
  useDragAndDrop(items, async (reorderedItems) => {
    await listStore.reorderListItems(listId.value, reorderedItems)
  })

onMounted(async () => {
  if (listId.value) {
    await listStore.fetchListItems(listId.value)

    title.value = list.value?.title || ''
  }
})
</script>

<template>
  <div
    v-if="listId"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click="handleBackdropClick"
  >
    <div
      class="bg-dark-card border border-dark-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] min-h-[500px] flex flex-col"
      :style="{ viewTransitionName: `card-${listId}` }"
      @click.stop
    >
      <div class="flex items-center justify-between p-4 border-b border-dark-border">
        <div v-if="!isEditingTitle" class="flex-1 mr-4">
          <button
            type="button"
            @click="startEditingTitle"
            class="block text-2xl font-semibold text-white cursor-pointer hover:text-gray-300 transition-colors empty:bg-dark-bg border-none text-left p-0 m-0 w-full empty:rounded-lg empty:h-[44px]"
          >
            {{ title }}
          </button>
        </div>
        <input
          v-else
          :id="`title-input-${listId}`"
          ref="titleInput"
          v-model="title"
          @blur="saveTitle"
          @keydown.enter="handleTitleKeydown"
          class="block flex-1 mr-4 text-2xl font-semibold bg-dark-hover text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
        />

        <div>
          <button
            @click="handleDeleteList"
            class="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            type="button"
          >
            <span class="sr-only">Delete</span>
            <IconTrash />
          </button>
          <button
            @click="closeModal"
            class="p-2 text-gray-400 hover:text-white hover:bg-dark-hover rounded-lg transition-colors"
          >
            <span class="sr-only">Close</span>
            <IconClose />
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
        <div class="space-y-2 overflow-hidden">
          <TransitionGroup name="list">
            <ListItem
              v-for="item in items"
              :key="item.id"
              :list-id="listId"
              :item="item"
              :is-dragging="draggedItem?.id === item.id"
              @drag-start="handleDragStart(item)"
              @drag-enter="handleDragEnter(item)"
              @drag-end="handleDragEnd"
              @drag-over="handleDragOver"
            />
          </TransitionGroup>
        </div>
      </div>

      <button
        @click="handleAddItem"
        class="mt-4 w-full py-3 text-gray-400 hover:text-white hover:bg-dark-hover rounded-lg transition-colors flex items-center justify-center gap-2 border border-dashed border-gray-600 hover:border-gray-400"
      >
        <IconPlus />
        Add Item
      </button>
    </div>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
