<script setup lang="ts">
import { useListStore } from '@/stores/lists'
import { List } from '@/types'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// List / Store
const listStore = useListStore()
const list = computed(() => listStore.getList(listId.value))
const listId = computed(() => route.params.id as string)

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

const handleBackdropClick = () => {
  router.push('/')
}

// onMount -> fetchListItems(listId) -> title
onMounted(async () => {
  if (listId.value) {
    await listStore.fetchListItems(listId.value)

    title.value = list.value.title
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
      </div>
    </div>
  </div>
</template>
