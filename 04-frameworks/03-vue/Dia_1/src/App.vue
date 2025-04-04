<template>
  <h1>My To-Do List</h1>
  <div>
    <!-- Input for adding new tasks -->
    <input v-model="newTask" @keyup.enter="addTask" placeholder="Add a new task" />
    <button @click="addTask">Add</button>
  </div>
  <ul>
    <!-- Loop through tasks and display them -->
    <li v-for="(task, index) in tasks" :key="task.id">
      <span :class="{ completed: task.completed }">
        {{ task.text }}
      </span>
      <button @click="toggleTask(index)">
        {{ task.completed ? 'Undo' : 'Complete' }}
      </button>
      <button @click="deleteTask(index)">Delete</button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Define the structure of a task
interface Task {
  id: number
  text: string
  completed: boolean
}

// Reactive state
const newTask = ref('')
const tasks = ref<Task[]>([])

// Add a new task
function addTask() {
  if (newTask.value.trim() === '') return // Prevent empty tasks
  tasks.value.push({
    id: new Date().getTime(),
    text: newTask.value,
    completed: false,
  })
  newTask.value = '' // Clear the input
}

// Toggle task completion
function toggleTask(index: number) {
  tasks.value[index].completed = !tasks.value[index].completed
}

// Delete a task
function deleteTask(index: number) {
  tasks.value.splice(index, 1)
}
</script>

<style scoped>
.completed {
  text-decoration: line-through;
  color: gray;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 10px 0;
}
button {
  margin-left: 10px;
}
</style>
