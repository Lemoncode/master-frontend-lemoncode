import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { ToDo } from '../types'
import { useStorage } from '../composables/storage'

const toDoFactory = (text: string): ToDo => ({
  timestamp: Date.now(),
  text,
  completed: false,
})

export const useTodosStore = defineStore('todosStore', () => {
  const todos = ref<ToDo[]>([])
  const completedToDos = computed(() => todos.value.filter((todo) => todo.completed))
  const pendingToDos = computed(() => todos.value.filter((todo) => !todo.completed))

  const total = computed(() => todos.value.length)
  const completed = computed(() => completedToDos.value.length)

  const storage = useStorage<ToDo[]>('todos')

  const loadTodos = () => {
    todos.value = storage.get()
  }

  const addTodo = (todo: string) => {
    const newTodo = toDoFactory(todo)
    todos.value.push(newTodo)
    storage.set(todos.value)
  }

  const toggleCompleted = (timestamp: number) => {
    const todo = todos.value.find((todo) => todo.timestamp === timestamp)
    if (todo) {
      todo.completed = !todo.completed
    }
    storage.set(todos.value)
  }

  const removeTodo = (timestamp: number) => {
    const index = todos.value.findIndex((todo) => todo.timestamp === timestamp)
    if (index !== -1) {
      todos.value.splice(index, 1)
    }
    storage.set(todos.value)
  }

  return {
    todos,
    total,
    completed,
    completedToDos,
    pendingToDos,
    loadTodos,
    addTodo,
    toggleCompleted,
    removeTodo,
  }
})
