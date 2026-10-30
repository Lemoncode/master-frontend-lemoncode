<script setup lang="ts">
import { computed, nextTick, onMounted, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import DialogShell from '@/components/DialogShell.vue'
import ListTitleEditor from '@/components/ListTitleEditor.vue'
import ListItem from '@/components/ListItem.vue'
import IconClose from '@/components/Icons/IconClose.vue'
import IconPlus from '@/components/Icons/IconPlus.vue'
import IconTrash from '@/components/Icons/IconTrash.vue'
import { useLists } from '@/composables/useLists'
import { useViewTransition } from '@/composables/useViewTransition'

const props = defineProps<{ id: string }>()
const router = useRouter()

const {
  listById,
  itemsForList,
  updateList,
  deleteList,
  createListItem,
  updateListItem,
  deleteListItem,
} = useLists()

const list = computed(() => listById(props.id))
const items = computed(() => itemsForList(props.id))
const title = computed({
  get: () => list.value?.title ?? '',
  set: (value: string) => updateList(props.id, { title: value }),
})

const dialogRef = useTemplateRef<{ close: () => void }>('dialogRef')

async function close() {
  await useViewTransition(async () => {
    dialogRef.value?.close()
    await router.push('/')
    await nextTick()
  })
  await nextTick()
  document.getElementById('app-title')?.focus()
}

async function handleDelete() {
  if (!list.value) return
  if (!confirm(`¿Eliminar la lista "${list.value.title}"?`)) return

  deleteList(props.id)
  await close()
}

function handleAddItem() {
  createListItem(props.id)
}

onMounted(() => {
  if (!list.value) router.replace('/')
})
</script>

<template>
  <DialogShell
    v-if="list"
    ref="dialogRef"
    labelledby="list-dialog-title"
    :transition-name="`list-${props.id}`"
    @close="close"
  >
    <template #header="{ close: closeDialog }">
      <header class="flex items-center gap-2 border-b border-border p-4">
        <h2 id="list-dialog-title" class="sr-only">{{ title || 'Lista' }}</h2>
        <ListTitleEditor v-model="title" class="flex-1" />
        <button
          type="button"
          class="rounded-lg p-2 text-muted transition hover:bg-danger/10 hover:text-danger"
          @click="handleDelete"
        >
          <span class="sr-only">Eliminar lista</span>
          <IconTrash />
        </button>
        <button
          type="button"
          class="rounded-lg p-2 text-muted transition hover:bg-surface-2 hover:text-ink"
          @click="closeDialog"
        >
          <span class="sr-only">Cerrar</span>
          <IconClose />
        </button>
      </header>
    </template>

    <div class="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
      <ListItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        @update="updateListItem(item.id, $event)"
        @delete="deleteListItem(item.id)"
      />
      <p v-if="items.length === 0" class="py-10 text-center text-sm text-muted">
        Esta lista está vacía. Añade el primer elemento.
      </p>
    </div>

    <template #footer>
      <div class="border-t border-border p-4">
        <button
          type="button"
          class="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm text-muted transition hover:border-accent/60 hover:text-accent"
          @click="handleAddItem"
        >
          <IconPlus />
          Añadir elemento
        </button>
      </div>
    </template>
  </DialogShell>
</template>
