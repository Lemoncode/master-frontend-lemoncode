<script setup lang="ts">
import { useListsStore } from "@/stores/lists";
import type { ListItem } from "@/types";
import { nextTick, ref, useTemplateRef } from "vue";

const props = defineProps<{
  item: ListItem;
}>();

const isEditing = ref(false);
const contentInternal = ref(props.item.content);
const inputRef = useTemplateRef("inputRef");

const startEditing = () => {
  isEditing.value = true;

  nextTick(() => {
    inputRef.value?.focus();
  });
};

const listStore = useListsStore();

const toggleChecked = () => {
  listStore.updateListItem(props.item.id, props.item.listId, { isChecked: !props.item.isChecked });
};
const saveContent = () => {
  listStore.updateListItem(props.item.id, props.item.listId, { content: contentInternal.value });
};
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    saveContent();
    isEditing.value = false;
  }
  if (event.key === "Escape") {
    isEditing.value = false;
    contentInternal.value = props.item.content;
  }
};

const deleteItem = () => {
  listStore.deleteListItem(props.item.id, props.item.listId);
};
</script>

<template>
  <div
    class="flex items-center gap-3 p-3 bg-dark-hover rounded-lg border border-transparent hover:border-dark-border transition-all cursor-move group"
  >
    <button
      @click="toggleChecked"
      type="button"
      :class="[
        'flex-shrink-0 w-5 h-5 rounded border-2 transition-colors flex items-center justify-center',
        item.isChecked ? 'bg-blue-600 border-blue-600' : 'border-gray-500 hover:border-gray-400',
      ]"
    >
      <svg
        v-if="item.isChecked"
        class="w-3 h-3 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
      </svg>
    </button>

    <button
      v-if="!isEditing"
      @click="startEditing"
      class="flex-1 cursor-text bg-transparent border-none text-left p-0 m-0"
    >
      <span
        :class="['text-white transition-all', { 'line-through text-gray-500': item.isChecked }]"
      >
        {{ item.content || "Click to edit" }}
      </span>
    </button>

    <input
      v-else
      ref="inputRef"
      v-model="contentInternal"
      @blur="
        isEditing = false;
        saveContent();
      "
      @keydown="handleKeydown"
      class="flex-1 bg-dark-bg text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="text"
      placeholder="Enter item text"
    />

    <button
      @click="deleteItem"
      class="flex-shrink-0 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>
