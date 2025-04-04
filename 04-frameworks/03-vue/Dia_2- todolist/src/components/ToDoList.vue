<script setup lang="ts">
import { onMounted } from 'vue'
import { useTodosStore } from '../stores/todos'

const todosStore = useTodosStore()

onMounted(() => {
  todosStore.loadTodos()
})

const onChange = (timestamp: number) => {
  todosStore.toggleCompleted(timestamp)
}

const onClick = (timestamp: number) => {
  todosStore.removeTodo(timestamp)
}
</script>

<template>
  <ul class="max-w-[500px]">
    <li v-for="todo in todosStore.todos" :key="todo.timestamp">
      <form @submit.prevent class="flex items-center justify-between">
        <input
          type="checkbox"
          :id="`todo-${todo.timestamp}`"
          :checked="todo.completed"
          @change="onChange(todo.timestamp)"
        />
        <label
          :for="`todo-${todo.timestamp}`"
          :class="[
            'mr-auto',
            {
              'line-through text-gray-400': todo.completed,
            },
          ]"
          >{{ todo.text }}</label
        >
        <button type="button" @click="onClick(todo.timestamp)">Remove</button>
      </form>
    </li>
  </ul>
</template>
