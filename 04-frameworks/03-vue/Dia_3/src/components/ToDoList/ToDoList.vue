<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTodosStore } from '../../stores/todos'

const todosStore = useTodosStore()

const onChange = (timestamp: number) => {
  todosStore.toggleCompleted(timestamp)
}

const onClick = (timestamp: number) => {
  todosStore.removeTodo(timestamp)
}

const toDosToShow = ref(todosStore.todos)

const showOnlyPendingToDos = (event: Event) => {
  if ((event.target as HTMLInputElement)?.checked) {
    toDosToShow.value = todosStore.pendingToDos
  } else {
    toDosToShow.value = todosStore.todos
  }
}

onMounted(() => {
  todosStore.loadTodos()
  toDosToShow.value = todosStore.todos
})
</script>

<template>
  <div v-if="todosStore.total">
    <p>Completed: {{ todosStore.completed }} / {{ todosStore.total }}</p>
  </div>
  <div>
    <input type="checkbox" id="toggle" @change="showOnlyPendingToDos" />
    <label for="toggle">Show only pending</label>
  </div>
  <hr />
  <ul class="max-w-[500px]">
    <li v-for="todo in toDosToShow" :key="todo.timestamp">
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
