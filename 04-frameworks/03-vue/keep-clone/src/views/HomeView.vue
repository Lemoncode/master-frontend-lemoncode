<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import ListCard from '@/components/ListCard.vue'
import { useLists } from '@/composables/useLists'
import { useViewTransition } from '@/composables/useViewTransition'
import type { ListItem } from '@/types'

const router = useRouter()
const route = useRoute()
const { lists, items, createList } = useLists()

const itemsByList = computed(() => {
  const map = new Map<string, ListItem[]>()

  for (const item of items.value) {
    const listItems = map.get(item.listId) ?? []
    listItems.push(item)
    map.set(item.listId, listItems)
  }

  return map
})

async function handleCreate() {
  const list = createList()

  await useViewTransition(async () => {
    await router.push(`/lists/${list.id}`)
    await nextTick()
  })
}

async function handleOpen(id: string) {
  await useViewTransition(async () => {
    await router.push(`/lists/${id}`)
    await nextTick()
  })
}
</script>

<template>
  <div class="min-h-dvh">
    <AppHeader @create="handleCreate" />

    <main class="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div
        v-if="lists.length === 0"
        class="rounded-2xl border border-dashed border-border p-12 text-center"
      >
        <h2 class="font-serif text-2xl text-ink">Aún no hay listas</h2>
        <p class="mt-2 text-muted">Crea tu primera lista para empezar.</p>
        <button
          type="button"
          class="mt-6 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg transition hover:bg-accent-strong"
          @click="handleCreate"
        >
          Crear lista
        </button>
      </div>

      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <button
          v-for="list in lists"
          :key="list.id"
          type="button"
          class="text-left"
          @click="handleOpen(list.id)"
        >
          <ListCard
            :list="list"
            :items="itemsByList.get(list.id) ?? []"
            :active="route.name === 'list' && route.params.id === list.id"
          />
        </button>
      </div>
    </main>

    <RouterView />
  </div>
</template>
