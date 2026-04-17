<script setup lang="ts">
import { RouterLink } from 'vue-router'

const handleCreateList = () => {
  console.log('create list')
}
</script>

<template>
  <header class="border-b border-dark-border bg-dark-card">
    <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <RouterLink to="/" class="text-2xl font-bold">My Tasks Keeper</RouterLink>
        <button
          @click="handleCreateList"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
        >
          New List
        </button>
      </div>
    </div>
  </header>
</template>
