<script setup lang="ts">
import { computed } from 'vue'
import { useListStore } from '@/stores/useLists'
import type { List } from '@/types'
import ListItem from '@/components/ListItem.vue'
import IconClose from '@/components/Icons/IconClose.vue'
import IconPlus from '@/components/Icons/IconPlus.vue'
import IconTrash from '@/components/Icons/IconTrash.vue'

const props = defineProps<{ list: List }>()
const emit = defineEmits<{ close: [] }>()

const { updateList, deleteList, itemsForList, createListItem, updateListItem, deleteListItem } =
  useListStore()

const title = computed({
  get: () => props.list.title,
  set: (value: string) => updateList(props.list.id, { title: value }),
})

const items = computed(() => itemsForList(props.list.id))

function handleAddItem() {
  createListItem(props.list.id)
}

function handleDeleteList() {
  if (!confirm(`¿Eliminar la lista "${props.list.title}"?`)) return
  deleteList(props.list.id)
  emit('close')
}
</script>

<template>
  <section class="flex max-h-[85vh] flex-col">
    <header class="flex items-center gap-2 border-b border-border p-4">
      <h2 id="list-dialog-title" class="sr-only">{{ title || 'Lista' }}</h2>
      <input
        v-model="title"
        type="text"
        aria-label="Título de la lista"
        class="flex-1 border-b border-transparent bg-transparent pb-1 font-serif text-2xl font-semibold text-ink outline-none transition focus:border-accent"
      />
      <button
        type="button"
        class="rounded-lg p-2 text-muted transition hover:bg-danger/10 hover:text-danger"
        @click="handleDeleteList"
      >
        <span class="sr-only">Eliminar lista</span>
        <IconTrash />
      </button>
      <button
        type="button"
        class="rounded-lg p-2 text-muted transition hover:bg-surface-2 hover:text-ink"
        @click="emit('close')"
      >
        <span class="sr-only">Cerrar</span>
        <IconClose />
      </button>
    </header>

    <div class="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
      <ListItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        @update="updateListItem(item.id, $event)"
        @delete="deleteListItem(item.id)"
        @create="createListItem(props.list.id)"
      />
      <p v-if="items.length === 0" class="py-10 text-center text-sm text-muted">
        Esta lista está vacía. Añade el primer elemento.
      </p>
    </div>

    <footer class="border-t border-border p-4">
      <button
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm text-muted transition hover:border-accent/60 hover:text-accent"
        @click="handleAddItem"
      >
        <IconPlus />
        Añadir elemento
      </button>
    </footer>
  </section>
</template>
