<script setup lang="ts">
import { computed } from 'vue'
import type { List, ListItem } from '@/types'

const props = defineProps<{
  list: List
  items: ListItem[]
  active: boolean
}>()

const preview = computed(() => {
  if (props.items.length === 0) return 'Lista vacía'

  const lines = props.items
    .slice(0, 3)
    .map((item) => `${item.isChecked ? '✓' : '○'} ${item.content || 'Sin título'}`)

  if (props.items.length > 3) lines.push('…')
  return lines.join('\n')
})

const status = computed(() => {
  const total = props.items.length
  if (total === 0) return ''

  const checked = props.items.filter((item) => item.isChecked).length
  if (checked === total) return 'Todo hecho'
  if (checked === 0) return `${total} ${total === 1 ? 'elemento' : 'elementos'}`
  return `${checked}/${total} hechos`
})
</script>

<template>
  <article
    class="flex h-full flex-col rounded-2xl border border-border bg-surface p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    :style="{ viewTransitionName: active ? 'none' : `list-${list.id}` }"
  >
    <h2 class="truncate font-medium text-ink">{{ list.title }}</h2>
    <p class="mt-2 line-clamp-3 flex-1 whitespace-pre-line text-sm leading-relaxed text-muted">
      {{ preview }}
    </p>
    <p v-if="status" class="mt-3 text-xs text-muted">{{ status }}</p>
  </article>
</template>
