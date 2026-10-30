<template>
  <div class="min-h-screen bg-dark-bg">
    <MainHeader />

    <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- <div v-if="listStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div> -->

      <div v-if="!hasLists" class="text-center py-12">
        <p class="text-gray-400 text-lg mb-4">No lists yet</p>
        <button
          @click="handleCreateList"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
        >
          Create Your First List
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <button
          type="button"
          v-for="list in listsStore.lists"
          :key="list.id"
          @click="handleOpenList(list.id)"
        >
          <ListCard :list="list" />
        </button>
      </div>
    </main>

    <RouterView />
  </div>
</template>

<script setup lang="ts">
import ListCard from "@/components/ListCard.vue";
import MainHeader from "@/components/MainHeader.vue";
import { useViewTransition } from "@/composables/useViewTransition";

import { useListsStore } from "@/stores/lists";
import { computed } from "vue";
import { RouterView, useRouter } from "vue-router";

const router = useRouter();

const listsStore = useListsStore();

const hasLists = computed(() => listsStore.lists.length > 0);

const handleCreateList = async () => {
  const newList = await listsStore.createList("New List");
  if (newList) {
    router.push(`/lists/${newList.id}`);
  }
};

const handleOpenList = (listId: string) => {
  useViewTransition(() => {
    router.push(`/lists/${listId}`);
  });
};
</script>
