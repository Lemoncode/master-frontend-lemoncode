<script setup lang="ts">
import HelloWorld from '../components/HelloWorld/HelloWorld.vue'
import ToDoForm from '../components/ToDoForm.vue'
import TodoList from '../components/ToDoList/ToDoList.vue'
</script>

<template>
  <main class="py-4">
    <ToDoForm />
    <TodoList />
  </main>
  <footer>
    <HelloWorld msg="holaaaa" />
  </footer>
</template>
