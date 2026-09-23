<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useViewTransition } from "@/composables/useViewTransition";
import { useListsStore } from "@/stores/lists";

const listsStore = useListsStore();

// defineProps<{
//   id: string;
// }>();

const router = useRouter();
const route = useRoute();

const listId = computed(() => route.params.id as string);

const list = computed(() => listsStore.lists.find((list) => list.id === listId.value));

const closeModal = () => {
  useViewTransition(() => {
    router.push("/");
  });
};

const isEditingTitle = ref(false);
const listTitleInternal = ref(list.value?.title || "");

const saveTitle = () => {
  listsStore.updateList(listId.value, { title: listTitleInternal.value });
};

const handleInput = (event: Event) => {
  listTitleInternal.value = (event.target as HTMLInputElement).value;
  saveTitle();
};

onMounted(() => {
  if (!list.value) {
    router.push("/");
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal" @after-leave="() => {}">
      <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        v-if="list"
        @click.stop="closeModal"
      >
        <div
          class="bg-dark-card border border-dark-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] min-h-[500px] flex flex-col"
          :style="{ viewTransitionName: `card-${listId}` }"
          @click.stop
        >
          <button
            class="block text-2xl font-semibold text-white cursor-pointer hover:text-gray-300 transition-colors empty:bg-dark-bg border-none text-left p-0 m-0 w-full empty:rounded-lg empty:h-[44px]"
            v-if="!isEditingTitle"
            @click="isEditingTitle = true"
          >
            {{ list?.title }}
          </button>
          <input
            v-else
            :value="listTitleInternal"
            class="block flex-1 mr-4 text-2xl font-semibold bg-dark-hover text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="handleInput"
            @blur="
              isEditingTitle = false;
              saveTitle();
            "
            @keydown.enter="
              isEditingTitle = false;
              saveTitle();
            "
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.2s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}
</style>
