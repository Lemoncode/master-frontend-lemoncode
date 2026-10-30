<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue'
import type { ListItem } from '@/types'
import IconTrash from './Icons/IconTrash.vue'

const props = defineProps<{
  item: ListItem
}>()

const emit = defineEmits<{
  update: [patch: Partial<ListItem>]
  delete: []
}>()

const isEditing = ref(false)
const draft = ref(props.item.content)
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')

function startEditing() {
  draft.value = props.item.content
  isEditing.value = true
  nextTick(() => inputRef.value?.focus())
}

function save() {
  if (!isEditing.value) return
  isEditing.value = false
  emit('update', { content: draft.value.trim() })
}

function cancel() {
  isEditing.value = false
  draft.value = props.item.content
}

function toggle() {
  emit('update', { isChecked: !props.item.isChecked })
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') save()
  if (event.key === 'Escape') cancel()
}
</script>

<template>
  <div
    class="group flex items-center gap-3 rounded-xl border border-transparent bg-surface-2/60 px-3 py-2 transition hover:border-border"
  >
    <button
      type="button"
      :aria-pressed="item.isChecked"
      :aria-label="item.isChecked ? 'Marcar como pendiente' : 'Marcar como hecho'"
      class="cursor-pointer"
      :class="[
        'grid size-5 shrink-0 place-items-center rounded border-2 transition-colors',
        item.isChecked
          ? 'border-accent bg-accent text-bg'
          : 'border-muted hover:border-accent',
      ]"
      @click="toggle"
    >
      <svg v-if="item.isChecked" class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
      </svg>
    </button>

    <button
      v-if="!isEditing"
      type="button"
      class="flex-1 text-left text-sm text-ink"
      :class="{ 'text-muted line-through': item.isChecked }"
      @click="startEditing"
    >
      {{ item.content || 'Haz clic para editar' }}
    </button>

    <input
      v-else
      ref="inputRef"
      v-model="draft"
      type="text"
      aria-label="Editar elemento"
      class="flex-1 rounded border border-border bg-bg px-2 py-1 text-sm text-ink outline-none focus:border-accent"
      @blur="save"
      @keydown="onKeydown"
    />

    <button
      type="button"
      class="shrink-0 rounded p-1 text-muted transition hover:bg-danger/10 hover:text-danger"
      @click="$emit('delete')"
    >
      <span class="sr-only">Eliminar elemento</span>
      <IconTrash />
    </button>
  </div>
</template>
