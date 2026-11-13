<script setup lang="ts">
import { computed, nextTick, onMounted, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import DialogShell from '@/components/DialogShell.vue'
import ListDialogCard from '@/components/ListDialogCard.vue'
import { useListStore } from '@/stores/useLists'
import { useViewTransition } from '@/composables/useViewTransition'

const props = defineProps<{
  listId: string
}>()

const router = useRouter()

const { listById } = useListStore()

const list = computed(() => listById(props.listId))

const dialogRef = useTemplateRef<{ close: () => void }>('dialogRef')

async function close() {
  await useViewTransition(async () => {
    dialogRef.value?.close()
    await router.push('/')
  })
  await nextTick()
  document.getElementById('app-title')?.focus()
}

onMounted(() => {
  if (!list.value) {
    router.replace('/')
  }
})
</script>

<template>
  <DialogShell
    v-if="list"
    ref="dialogRef"
    labelledby="list-dialog-title"
    :transition-name="`list-${props.listId}`"
    @close="close"
  >
    <ListDialogCard v-if="list" :list="list" @close="close" />
  </DialogShell>
</template>
