# Reto final: bloc de notas

Solución del reto final de la práctica guiada.

**Playground:** https://play.vuejs.org/#eNqVVutu2zYUfhVC22AHs6Wk2TpAcZKuQYBtGLJiLbof0zDQEm2zlUiBpHyZ4efa/z3ZvkNdLDtO2v6yde7nOzdugx/LMlxWIoiDiU2NLB2zwlXlTaJkUWrj2IN24j6TThs2M7pggzBKNVhKKGejPZesDA607rjJntIh3qHGllVW9JztDlUtn+bCRgcyUE5UqpUlbQXyiKW54GbEVtpkd7pSDpQFN/4vLF4f+hgOftIbthCMl0aoTGY6DMPBGVnldqNSNqtU6qRWLNXlhvSGZ2ybKMb4ikvHFF/KOafc01yWU005rYx04p1YuyEFFC55XglY3CVqEtUAA1p8OFGUOXcCX4xNCi6V/4f/i4ub17lOWSYoJ24nESik47kdsHFKSV0nQZdrEjQmINaaZ18tBM+E6Tjk4MUNrHDGU1fxHOZf9LmZXPY+QZhWzgECtykFvNVfScBeIef0IygtNnB/p0vJzSSqhb7QDFUONn5FP5w2Mon6sU2iHoQdsddAy3GhM5HDNFUCrqK+4B6gmQbbQGyLMvs+6QEJyfJm23F2rOQ5nxo+tGfsv38Zcfb9tWMpN0BVGIGq0QydCLUmtGWsyx819T/KaWLdJqe/U51t0OIzrdx4xguZb2JmNxbC40qOmOXKjq0wcnbFCm7mUsXs/AqhZplU85hdGFFcIS1FbmCn4OvxSmZuEbPLl57XaTFeOe1lHXqYG8Eh38henJ9/c8Wmej228h9veIrWE2YMUs9b+MP33iZFGzOpFgjMeZNNC2x7st9BFBpeIa2M1SZmpZbwbrwKhsZjEIzQZ09snRO7KxMzqcQbo0s7RL7UB+9pEmP21hl4ZjvMZL05RIFJvsa0kcY9Puzwz0FVZihCvFcc/AWF5ya4hasucOznHj21t5AENcvolQXj4rwlwEgqFjoHkqDfk4upYJXifvyxkVrBV1KVFU08hTw8EeOIfS2WAChEJHPh2uXj1an5e+31GM92I38STT8KMXuoiqnAmv4ELlY0GzTnlvLGhGTdfE2a5TSxuaZ1WhBkNc3PK3ZTf3vVYpSJ/6oH91C5pkG5W4/15N7eMgDuTTZq9eA14Z0G5/Dm2PCDBTjduTJi1h2p+pIlSqw9s7sbrepQKukkz9Fog0FzQ+r2o90EKoy1Mv7+sN7tocXYHh7mFerKemNExJzQj0G5DI1X7xQSb/c4nz/am3GUE4lVTmSfk1hnw1+6Jr4mhtbOEHFfN/XaBx5iBgtwbh/TQlvmaO4oSey30VmYCzV3C4bFRDbojp6uTbMMPiuZ4/eGff6pYY9UurSfVutEnuuJ5gnyZGMclXH/dumaCXC0wt0boBY7Ks1ebn+sro9q1C9FjXrTh6e66qkHVl0fZ+FsJucoh1YoiE+KBhGHPRfmt5JgsEkQty2dBDzP9eoXT3OmEqOWni5E+vEE/YNdEy0J3uDUCrPEdu149fKr2fdvH7CXe0xsyyqH9DPM34XVeUUx1mKvK5Uh7J6cj/Zn3xO4Je/s/doJZdukKFA/lV4+CdB1d8+kvg/3MrxspplQ/NvZ98KQVUD4MjwPL4Pd//0E/h4=

## `App.vue`

```vue
<script setup lang="ts">
import NoteEditor from './components/NoteEditor.vue'
import NoteCard from './components/NoteCard.vue'
import { useNoteEditor } from './composables/useNoteEditor'

const { note, clear, wordCount, charCount } = useNoteEditor('Hoy he aprendido...')

async function copyNote() {
  await navigator.clipboard.writeText(note.value)
}
</script>

<template>
  <main>
    <h1>Bloc de notas</h1>

    <NoteCard :count="wordCount">
      <template #header>
        <h2>Nota actual</h2>
        <div>
          <button type="button" @click="copyNote">Copiar</button>
          <button type="button" @click="clear">Limpiar</button>
        </div>
      </template>

      <NoteEditor v-model="note" />

      <template #footer="{ count }">
        <p>{{ count }} palabra(s) · {{ charCount }} caracteres</p>
      </template>
    </NoteCard>
  </main>
</template>

<style>
body { font-family: system-ui, sans-serif; margin: 0; padding: 1rem; }
main { max-width: 36rem; margin: 0 auto; }
textarea { width: 100%; box-sizing: border-box; padding: .75rem; font: inherit; }
button { padding: .4rem .7rem; cursor: pointer; }
</style>
```

## `components/NoteEditor.vue`

```vue
<script setup lang="ts">
defineProps({ modelValue: String })
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <textarea
    :value="modelValue"
    rows="10"
    placeholder="Escribe una nota..."
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

## `components/NoteCard.vue`

```vue
<script setup lang="ts">
defineProps({ count: Number })
</script>

<template>
  <section class="card">
    <header><slot name="header" /></header>
    <slot />
    <footer><slot name="footer" :count="count ?? 0" /></footer>
  </section>
</template>
```

## `composables/useNotes.js`

```js
import { ref } from 'vue'

export function useNotes(initial = '') {
  const note = ref(initial)

  function clear() {
    note.value = ''
  }

  return { note, clear }
}
```

## `composables/useWordCount.js`

```js
import { computed } from 'vue'

export function useWordCount(note) {
  return computed(() =>
    note.value.trim() ? note.value.trim().split(/\s+/).length : 0
  )
}
```

## `composables/useNoteEditor.js`

```js
import { computed } from 'vue'
import { useNotes } from './composables/useNotes'
import { useWordCount } from './composables/useWordCount'

export function useNoteEditor(initial = '') {
  const { note, clear } = useNotes(initial)
  const wordCount = useWordCount(note)
  const charCount = computed(() => note.value.length)

  return { note, clear, wordCount, charCount }
}
```
