<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useViewTransition } from "@/composables/useViewTransition";
import { useListsStore } from "@/stores/lists";
import IconTrash from "./Icons/IconTrash.vue";
import IconClose from "./Icons/IconClose.vue";
import IconPlus from "./Icons/IconPlus.vue";
import ListItem from "./ListItem.vue";
import type { ListItem as ListItemType } from "@/types";

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

const handleDeleteList = () => {
  if (confirm("Are you sure you want to delete this list?")) {
    listsStore.deleteList(listId.value);
    closeModal();
  }
};

const items = computed(() => listsStore.listItems.get(listId.value) || []);
const handleAddItem = async () => {
  listsStore.createListItem(listId.value);
};

onMounted(async () => {
  // Check if list exists
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
        <section
          class="bg-dark-card border border-dark-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] min-h-[500px] flex flex-col"
          :style="{ viewTransitionName: `card-${listId}` }"
          @click.stop
        >
          <header>
            <div class="flex items-center justify-between p-4 border-b border-dark-border">
              <div v-if="!isEditingTitle" class="flex-1 mr-4">
                <button
                  type="button"
                  @click="isEditingTitle = true"
                  class="block text-2xl font-semibold text-white cursor-pointer hover:text-gray-300 transition-colors empty:bg-dark-bg border-none text-left p-0 m-0 w-full empty:rounded-lg empty:h-[44px]"
                >
                  {{ listTitleInternal }}
                </button>
              </div>
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
              <div class="flex items-center gap-2">
                <button
                  @click="handleDeleteList"
                  class="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  type="button"
                >
                  <span class="sr-only">Delete List</span>
                  <IconTrash />
                </button>
                <button
                  @click="closeModal"
                  class="p-2 text-gray-400 hover:text-white hover:bg-dark-hover rounded-lg transition-colors"
                  type="button"
                >
                  <span class="sr-only">Close</span>
                  <IconClose />
                </button>
              </div>
            </div>
          </header>
          <!-- List Content -->
          <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            <TransitionGroup name="list">
              <ListItem v-for="item in items" :key="item.id" :item="item" />
            </TransitionGroup>
          </div>
          <!-- button to add a new todo -->
          <button
            type="button"
            @click="handleAddItem"
            class="mt-4 w-full py-3 text-gray-400 hover:text-white hover:bg-dark-hover rounded-lg transition-colors flex items-center justify-center gap-2 border border-dashed border-gray-600 hover:border-gray-400"
          >
            <IconPlus />
            Add item
          </button>
        </section>
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

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
