<script setup lang="ts">
defineEmits<{ create: [] }>()
</script>

<template>
  <header class="sticky top-0 z-10 border-b border-border bg-bg/80 backdrop-blur">
    <div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
      <div class="flex items-center gap-3">
        <span class="grid size-9 place-items-center rounded-xl bg-accent/15 text-accent" aria-hidden="true">
          <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 6h8M8 10h8M8 14h5M5 4h14v16H5z"
            />
          </svg>
        </span>
        <div>
          <h1
            id="app-title"
            tabindex="-1"
            class="font-serif text-xl font-semibold tracking-tight text-ink outline-none"
          >
            Keep Clone
          </h1>
          <p class="text-xs text-muted">Listas y notas</p>
        </div>
      </div>
      <button
        type="button"
        class="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg transition hover:bg-accent-strong"
        @click="$emit('create')"
      >
        Nueva lista
      </button>
    </div>
  </header>
</template>
