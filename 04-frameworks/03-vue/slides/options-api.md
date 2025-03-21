---
layout: default
transition: slide
title: ❌ Sintaxis de "Options API"
---
<v-switch>

<template #0-7>
  <h1>❌ Sintaxis de "Options API" 🧑🏽‍🦳</h1>
</template>
<template #7>
  <h1>✅ Sintaxis de "Composition API" 🧑🏽</h1>
</template>

</v-switch>

````md magic-move{at:1}
```vue {all|2,22|4|9|14|19|all}
<script>
export default {
  name: 'MyComponent',
  data() {
    return {
      msg: 'Hello Vue!'
    }
  },
  computed: {
    reversedMsg() {
      return this.msg.split('').reverse().join('')
    }
  },
  methods: {
    reverseMsg() {
      this.msg = this.reversedMsg
    }
  },
  created() {
    console.log('Component created')
  },
}
</script>
```
```vue
<script setup>
import { ref, computed } from 'vue'

defineOptions({
  name: 'MyComponent'
})

const msg = ref('Hello Vue!')

const reversedMsg = computed(() => msg.value.split('').reverse().join(''))

const reverseMsg = () => msg.value = reversedMsg.value

console.log('Component created')
</script>
```
````


<!-- **No es la forma recomendada** de escribir componentes de Vue desde la "Composition API" (`script setup` o `setup` _function_). -->
