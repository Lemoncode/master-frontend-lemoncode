<script setup lang="ts">
import { ref } from 'vue'
import ToDoForm from '../components/ToDoForm.vue'
import TodoList from '../components/TodoList.vue'
</script>

<template>
  <main class="py-4">
    <ToDoForm />
    <TodoList />
  </main>
</template>
