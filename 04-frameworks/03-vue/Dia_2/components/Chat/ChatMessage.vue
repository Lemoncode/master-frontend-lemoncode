<template>
  <div class="flex gap-3 justify-between">
    <div class="flex gap-3">
      <ChatAvatar :sender="record.sender" />
      <p>{{ record.message }}</p>
    </div>

    <time class="text-sm text-slate-400">{{ formattedTime }}</time>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  record: ChatRecord;
}>();

const formattedTime = computed(() => {
  const date = new Date(props.record.timestamp);

  return new Intl.DateTimeFormat('es', {
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
});
</script>
