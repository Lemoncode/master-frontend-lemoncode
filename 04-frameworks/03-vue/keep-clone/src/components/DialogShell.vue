<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

defineProps<{
  labelledby: string
  transitionName?: string
}>()

const emit = defineEmits<{ close: [] }>()
const dialogRef = useTemplateRef<HTMLDialogElement>('dialogRef')

function requestClose() {
  emit('close')
}

function handleCancel(event: Event) {
  event.preventDefault()
  requestClose()
}

function handleClick(event: MouseEvent) {
  if (event.target === dialogRef.value) requestClose()
}

function close() {
  dialogRef.value?.close()
}

onMounted(() => {
  dialogRef.value?.showModal()
})

onBeforeUnmount(() => {
  dialogRef.value?.close()
})

defineExpose({ close })
</script>

<template>
  <dialog
    ref="dialogRef"
    closedby="none"
    :aria-labelledby="labelledby"
    class="m-auto flex max-h-[85vh] w-[min(42rem,calc(100%-2rem))] flex-col rounded-2xl border border-border bg-surface p-0 text-ink shadow-2xl shadow-black/40"
    :style="transitionName ? { viewTransitionName: transitionName } : undefined"
    @cancel="handleCancel"
    @click="handleClick"
  >
    <slot name="header" :close="requestClose" />
    <slot :close="requestClose" />
    <slot name="footer" :close="requestClose" />
  </dialog>
</template>
