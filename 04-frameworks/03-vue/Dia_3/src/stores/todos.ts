import { ref } from 'vue'
import { defineStore } from 'pinia'

import type { ToDo } from '../types'

const toDoFactory = (text: string): ToDo => ({
  timestamp: Date.now(),
  text,
  completed: false,
})

const getTodosFromLocalStorage = (): ToDo[] => {
  const todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')!) : []
  return todos
}

const setTodosToLocalStorage = (todo: ToDo) => {
  const storedValue = getTodosFromLocalStorage()
  storedValue.push(todo)
  localStorage.setItem('todos', JSON.stringify(storedValue))
}

export const useTodosStore = defineStore('todosStore', () => {
  const todos = ref<ToDo[]>([])

  const loadTodos = () => {
    todos.value = getTodosFromLocalStorage()
  }

  const addTodo = (todo: string) => {
    const newTodo = toDoFactory(todo)
    todos.value.push(newTodo)
    setTodosToLocalStorage(newTodo)
  }

  const toggleCompleted = (timestamp: number) => {
    const todo = todos.value.find((todo) => todo.timestamp === timestamp)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  const removeTodo = (timestamp: number) => {
    const index = todos.value.findIndex((todo) => todo.timestamp === timestamp)
    if (index !== -1) {
      todos.value.splice(index, 1)
    }
  }

  return {
    todos,
    loadTodos,
    addTodo,
    toggleCompleted,
    removeTodo,
  }
})
