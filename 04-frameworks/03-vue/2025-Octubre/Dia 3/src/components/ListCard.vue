<script setup lang="ts">
import { useListStore } from '@/stores/lists'
import type { List } from '@/types'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  list: List
}>()

const route = useRoute()
const isActive = computed(() => route.name === 'list' && route.params.id === props.list.id)

const listStore = useListStore()
const items = computed(() => listStore.getListItems(props.list.id))

const previewText = computed(() => {
  const totalCount = items.value.length

  if (totalCount === 0) {
    return 'Empty List'
  }

  const firstItems = items.value.slice(0, 3)
  const preview = firstItems
    .map((item) => {
      const icon = item.isChecked ? '✓' : '○'
      const text = item.content || 'Untitled'

      return `${icon} ${text}`
    })
    .join('\n')

  return preview + (items.value.length > 3 ? '\n...' : '')
})

const statusText = computed(() => {
  const checkedCount = items.value.filter((item) => item.isChecked).length
  const totalCount = items.value.length

  if (totalCount === 0) return ''
  if (checkedCount === totalCount) return 'All done'
  if (checkedCount === 0) return `${totalCount} items`

  return `${checkedCount}/${totalCount} done`
})
</script>

<template>
  <div
    class="bg-dark-card border border-dark-border rounded-lg p-4 hover:bg-dark-hover cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-black/20"
    :style="{ viewTransitionName: !isActive ? `card-${list.id}` : undefined }"
  >
    <h3 class="text-lg font-semibold text-white mb-2 truncate">
      {{ list.title }}
    </h3>

    <div class="text-sm text-gray-400 whitespace-pre-line line-clamp-4 mb-3 font-mono">
      {{ previewText }}
    </div>

    <div v-if="statusText" class="text-xs text-gray-500 font-medium">
      {{ statusText }}
    </div>
  </div>
</template>
