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

function close() {
  dialogRef.value?.close()
}

onMounted(() => {
  dialogRef.value?.show()
  document.getElementById('app')?.setAttribute('inert', '')
})

onBeforeUnmount(() => {
  dialogRef.value?.close()
  document.getElementById('app')?.removeAttribute('inert')
})

defineExpose({ close })
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]" @click="requestClose" />
    <dialog
      ref="dialogRef"
      :aria-labelledby="labelledby"
      class="fixed inset-0 z-50 m-auto flex max-h-[85vh] w-[min(42rem,calc(100%-2rem))] flex-col rounded-2xl border border-border bg-surface p-0 text-ink shadow-2xl shadow-black/40"
      :style="transitionName ? { viewTransitionName: transitionName } : undefined"
      @keydown.esc="requestClose"
    >
      <slot name="header" :close="requestClose" />
      <slot :close="requestClose" />
      <slot name="footer" :close="requestClose" />
    </dialog>
  </Teleport>
</template>
