---
theme: seriph
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Módulo Vue.js con Paul Melero
mdc: true
themeConfig:
  primary: 'rgb(0 220 130)'
layout: custom-cover
background: https://images.unsplash.com/photo-1667818976278-00b0577459b8?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
class: text-center
---

# Bienvenid@s a <carbon-logo-vue /> Vue.js!

🖖

---
layout: image-right-rounded
image: paul.jpeg
class: grid
---

# Paul Melero

<div class="my-auto">

<h3 class="text-green-400 mb-3">Web Engineer | Vue.js Instructor</h3>

- <logos-bluesky />&nbsp;[@gnet.click](https://bsky.app/profile/gnet.click)
- 📩&nbsp;&nbsp;paulmelero@gmail.com
- 🌐&nbsp;&nbsp;https://graficos.net

</div>


---
title: Qué es Vue.js
layout: hero-image
image: logo-vue-3d.png
---

<h1 class="text-center">¿Qué es Vue.js?</h1>

<p class="text-center">https://vuejs.org/</p>

---
title: Definición
layout: hero-image
image: vue-cover.png
---

<v-clicks>

- <logos-vue /> Vue.js es un framework JavaScript de **código abierto** utilizado para construir **interfaces de usuario**. Destaca por su simplicidad y flexibilidad.

- <logos-vue /> Vue.js es un framework _progresivo_, lo que significa que se puede utilizar para construir desde una simple página web hasta una aplicación web compleja.

</v-clicks>

---
layout: quote
---
# <logos-vue /> Características principales

<v-clicks>

- **Reactividad**: Reactive Data Binding
- **Componentes**: Component-based Architecture
- **Tooling**: Vite, Vue CLI, Vue Devtools, Vue Router, Pinia...
- **Meta-framework**: <logos-nuxt-icon /> Nuxt
- Lenguaje dedicado (_domain-specific language (DSL)_)

</v-clicks>


---
layout: quote
---

# <logos-vue /> Ventajas de Vue

<v-clicks>

- 📈 Ligero y fácil de aprender.
- 👣 Integración gradual.
- ✅ Reactividad (intuitivo).
- 🏛️ Framework maduro.
- 📚 Documentación completa y amigable.
- ⚡ Velociddad.

</v-clicks>

<!-- Curva de aprendizaje -->

---
layout: section
---

# Diferencias con otros frameworks

---
layout: two-cols
layoutClass: custom-top
title: Tablas de Diferencias
---

# Vue.js <carbon-arrows-horizontal /> React

<table><tbody><tr><td>
<b style="color: var(--slidev-theme-primary)">Vue</b>
</td><td>
<b style="color: rgb(88 196 220/1)">React</b>
</td></tr>
<tr><td>
Reactividad
</td><td>
APIs Declarativas
</td></tr>
<tr><td>
Two way data binding
</td><td>
One way data flow
</td></tr>
<tr><td>
SFC
</td><td>
JSX
</td></tr>
<tr><td>
Javascript en HTML
</td><td>
CSS y HTML en JS
</td></tr>
<tr><td>
Vuex/Pinia
</td><td>
Context API u otras lib
</td></tr>
<tr><td>
Vite
</td><td>
CRA / Next.js
</td></tr>
<tr><td>
No muy adecuado para Mobile (Vue Native)
</td><td>
React Native / Expo
</td></tr>
</tbody>
</table>

::right::


# Vue.js <carbon-arrows-horizontal /> Angular

<table><tbody><tr><td>
<b style="color: var(--slidev-theme-primary)">Vue</b>
</td><td>
<b style="color: rgb(220 88 88/1)">Angular</b>
</td></tr>
<tr><td>
Reactividad
</td><td>
RxJS
</td></tr>
<tr><td>
SFC
</td><td>
Componentes/Modulos
</td></tr>
<tr><td>
Vuex/Pinia
</td><td>
NgRx/Services
</td></tr>
<tr><td>
Vite
</td><td>
Vite
</td></tr>
<tr><td>
Apto para pequeños proyectos
</td><td>
Aplicaciones grandes
</td></tr>
</tbody>
</table>

---
layout: section
---

# Similitudes con otros frameworks

---
layout: two-cols
layoutClass: custom-top
title: Listas de Similitudes
---

# Vue.js <carbon-arrows-horizontal /> React

<v-clicks>

- **Componentes** (reutilizables)
- **Virtual DOM**
- Librería o Framework
- Velocidad/Performance
- Escalabilidad
- Meta-frameworks: **Nuxt**, **Next.js**
- Diferentes modos de renderizado: **SPA**, **SSR**, **SSG**
- **TypeScript** (opcional)
- **Testing** (Jest, Vitest, Testing Library)
- **PWA** (Progressive Web Apps)
- **Licencia** MIT

</v-clicks>

::right::

# Vue.js <carbon-arrows-horizontal /> Angular

<v-clicks>

- **Componentes** (reutilizables)
- **Reactividad**: Two way data binding
- **Directivas**: JS en HTML
- Diferentes modos de renderizado: **SPA**, **SSR**
- **TypeScript** (opcional en Vue)
- **Testing** (Jest, Vitest, Testing Library)
- **PWA** (Progressive Web Apps)
- **Licencia** MIT

</v-clicks>


---
layout: quote
---

# Números

---
layout: image
title: Números
image: /numbers.png
backgroundSize: contain
---

<!-- Dar opinión sobre empleabilidad -->

---
layout: center
---

# Consejo Personal

<v-clicks>

- 📚 Mi consejo es que aprendáis a usar todos los frameworks del Máster. (Al menos, 2.)
- 🚀 Para la empleabilidad, muchas veces se valora el esfuerzo y las ganas de aprender.
- 😉 Pero, si os gusta uno en concreto, especializaos en él.

</v-clicks>

---
layout: section
---

# Ecosistema de Vue.js

https://vuejs.org/guide/extras/ways-of-using-vue


---
layout: image
image: /eco.jpeg
title: Diagrama Ecosistema
---

<!-- Por cierto, estos slides están hechos con Vue!  -->


---
layout: section
---

# Demo

---
layout: center
---

# Hello World

```vue {all|4,8,9|9|2-4|all}
<script setup>
import { ref } from 'vue'

const msg = ref('World! 🔥🔥')
</script>

<template>
  <h1>Hello {{ msg }}</h1>
  <input v-model="msg" />
</template>
```

👉🏽 [Vue.js SFC Playground](https://play.vuejs.org/#eNp9UE1Lw0AQ/SvjXqJQWqS3EgsqBfWgooKXvYRkkqZudpf9qIGw/8K7J/+fP8HZDY0epIeFnffevHkzA7vUer73yFYst6VptQOLzus1l22nlXEwgMEaAtRGdZCRNOOSy1JJ66CzDVxE/jR7VUZUJ/D9+fEVX3bGZb4YHcmLCoedFoVDqgDy7fn6BoVQMAzJJYR8QVhsmoRsxpylQXXbzHdWSco4xGbOStXpVqB50K6lIJytIDGRK8j1/S5hznicHfByi+XbP/jO9hHj7NGgRbNHzibOFaZBN9Kb53vs6T+Rnaq8IPUR8gmtEj5mHGVXXlYU+48upb1Nl25l82I3vUNpD0vFoFEZkp4zuv71kdV/4y7ny9THZWDhByv9osM=)


---
layout: statement
---

# ¿List@s para Empezar?

<!-- image centered -->
<div class="text-center">
  <img src="/cortar.gif" class="m-auto object-contain max-h-sm" />
</div>


---
layout: section
---

# Qué es la **Reactividad**?

---
layout: center
title: Reactividad (video)
---

<video src="/reactividad.mp4" autoplay loop controls class="m-auto" />

---
layout: section
---

# Reactividad en Vue

---
layout: center
---

# Objetos

```ts{all|1|3|1-5|all}
const obj = { count: 0 }

console.log(obj.count) // 0

obj.count = 1

console.log(obj.count) // 1
```

---
layout: center
---

# Getters y Setters

```ts{all|1-9|3,6|3,11|6,13|all}
const obj = {
  _count: 0,
  get count() {
    return this._count
  },
  set count(value) {
    this._count = value
  }
}

console.log(obj.count) // 0

obj.count = 1

console.log(obj.count) // 1
```

---
layout: center
---

# Getters y Setters (+ transfomación)

```ts{all|4|2,3-5,11|2,3-5,13,15|all}
const obj = {
  _count: 0,
  get count() {
    return BigInt(this._count)
  },
  set count(value) {
    this._count = value
  }
}

console.log(obj.count) // 0n

obj.count = 1

console.log(obj.count) // 1n
```

---
layout: center
---

# JS Proxies

```ts{all}
const obj = { count: 0 }

const proxiedObj = new Proxy(obj, {
  get(target, prop) {
    return target[prop]
  },
  set(target, prop, value) {
    target[prop] = value
  }
})
```
---
layout: center
---

# JS Proxies (+ transfomación o _side effects_)

```ts{all|1-3|4,8|5,9|9,14|15|all}
const obj = { count: 0 }

const proxiedObj = new Proxy(obj, {
  get(target, prop) {
    console.log(`Getting ${prop}`)
    return target[prop]
  },
  set(target, prop, value) {
    console.log(`Setting ${prop} to ${value}`)
    target[prop] = value
  }
})

proxiedObj.count = 1
// > "Setting count to 1"
```

---
layout: center
---

# Cómo funciona la **Reactividad** en Vue?

```ts{all|5,9|9,14-15|5,17-19|all}
const obj = { count: 0 }

const ref = new Proxy(obj, {
  get(target, prop) {
    track(target, prop)
    return target[prop]
  },
  set(target, prop, value) {
    trigger(target, prop)
    target[prop] = value
  }
})

ref.count = 1
// triggers reactivity

console.log(ref.count)
// también triggers reactivity
// > 1
```

---
layout: statement
---

# Sintaxis

---
layout: section
---

# `MyComponent.vue`

---
layout: two-cols
---

# Single File Components

```vue {all|1,4|6,14|16,20|all}
<template>
  <h1>{{ msg }}</h1>
  <p>Blah bla</p>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'MyComponent'
})

const msg = ref('My value')
</script>

<style scoped>
h1 {
  color: red;
}
</style>
```

::right::

<v-clicks depth="3">

- Archivos `.vue`
- HTML, JS, CSS
  - `template`, `script`, `style`
    - No es necesario que estén todos.
  - Otras opciones: `lang="ts"`, `lang="scss"`
- En `template` no es necesario que haya 1 sólo elemento raíz.
- <span v-mark="{ type:'circle', color: '#008f53' }">`script setup`</span> (recomendado)

</v-clicks>



---
layout: two-cols
---

# Con TypeScript

```vue {all|1|all}
<script setup lang="ts">
// MyComponent.vue
import { ref } from 'vue'

const msg = ref('My value')
</script>
```

::right::

- La extensión del archivo sigue siendo `.vue`.
- Pero añadimos <span v-mark="{ type:'circle', color: '#008f53' }">`lang="ts"`</span> en la etiquta `<script>`.


---
layout: two-cols
---

# Con JSX / TSX

```tsx{all|1,8|all}
// MyComponent.tsx
import { ref } from 'vue'

const MyComponent = {
  setup() {
    const msg = ref('My value')

    return () => <h1>{msg}</h1>
  }
}
```

::right::

- La extensión del archivo es `.tsx` (o `.jsx`).
- Es necesario instalar `@vitejs/plugin-vue-jsx` para usar JSX/TSX y configurar
  Vite ([docs](https://www.npmjs.com/package/@vitejs/plugin-vue-jsx)).


---
layout: default
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


---
layout: quote
---

# Interpolación

---
layout: two-cols
---

# Interpolación

```vue {all|2|all}
<template>
  <h1>{{ msg }}</h1>
</template>
```

::right::

<v-clicks>

- `{{ msg }}` es una expresión de Vue.
- Se evalúa y se muestra en el DOM.
- Se actualiza automáticamente si `msg` cambia.

</v-clicks>

---
layout: quote
---

# Directivas

---
layout: two-cols
---

# Condicionales

```vue {all|2,6|all}
<script setup>
const seen = true
</script>

<template>
  <h1 v-if="seen">Me ves</h1>
</template>
```

::right::

## `v-if`

---
layout: two-cols
---

# Loops

```vue {all|2-5|11-12|11,14|3,4,11,14|all}
<script setup>
const todos = [
  { text: 'Learn Vue' },
  { text: 'Build cool things' }
]
</script>

<template>
	<ul>
    <li
      v-for="(todo, index) in todos"
      :key="index"
    >
      {{ todo.text }}
    </li>
  </ul>
</template>
```

::right::

### `v-for` (+ `key`)

<v-clicks depth="2">

- `v-for="(item, index) in items"` o `v-for="(item, index) of items"`
  - <span v-mark="{ at: 7, type:'underline', color: '#008f53' }">`item` y `index`</span> son variables locales (pueden tener cualquier otro nombre).
- <span v-mark="{ at: 8, type:'underline', color: '#008f53' }">`key`</span> es necesario para que Vue pueda identificar los elementos y hacer el
  re-renderizado de forma eficiente.

</v-clicks>

---
layout: quote
---

# Manejando Eventos

---
layout: two-cols
---

# Eventos (interacción)

```vue {all|2,3|5,6|8,9|11,12|16,17|all}
<template>
  <!-- 1 -->
  <button v-on:click="doThis"></button>

  <!-- 2 - same as -->
  <button v-on:click="doThis($event)"></button>

  <!-- 3 - shorthand ✅ -->
  <button @click="doThis"></button>

  <!-- key modifier using keyAlias -->
  <input @keyup.enter="onEnter">
</template>

<script setup>
function doThis(event) { /* ... */ }
function onEnter(event) { /* ... */ }
</script>

```

::right::

### `v-on:` (alias de `@`)

<v-clicks depth="2">

- `v-on:click="doThis"`
  - o <span v-mark="{ at: 8, type:'underline', color: '#008f53' }">`@click="doThis"`</span>
  - o `v-on:click="doThis($event)"`
  - o `@click="doThis($event)"`
  - o `@click="$event => doThis($event)"`
- El evento se pasa automáticamente como argumento a la función.
- Se pueden usar modificadores de teclado (`.enter`, `.ctrl`, `.shift`, `.alt`, `.meta`).
- También se pueden usar keyCodes (`.keyCode`). [Más info](https://vuejs.org/guide/essentials/event-handling.html#key-modifiers)

</v-clicks>

---
layout: two-cols
---

# Custom events

#### Componente Hijo: (`MyChild.vue`)

```vue {all|2-4,12|all}
<template>
  <button @click="emit('my-event', 'some data')">
    Click
  </button>
</template>

<script setup>
defineOptions({
  name: 'MyChild'
})

const emit = defineEmits(['my-event'])
</script>
```

#### Componente Padre: (`Parent.vue`)

```vue
<template>
  <MyChild @my-event="onMyEvent" />
</template>
```

::right::

<v-clicks depth="2">

<ul>
  <li>Definimos eventos custom con <span v-mark="{ at: 3, type:'circle', color: '#008f53' }">`defineEmits`</span>.</li>
  <li>Después, los escuchamos con `@&lt;nombre-del-evento&gt;`.</li>
</ul>

</v-clicks>

---
layout: quote
---

# Props

---
layout: two-cols
---

# Props

```vue {all|2,6-8|all}
<template>
  <h1>{{ msg }}</h1>
</template>

<script setup lang="ts">
const props = defineProps<{
  msg: string
}>()
</script>
```

Componente padre:


```vue {all|2|all}
<template>
  <ChildComponent :msg="msg" />
</template>

<script setup>
import ChildComponent from './ChildComponent.vue'

const msg = ref('My value')
</script>
```


::right::

- `props` son los argumentos que recibe un componente.
- Se definen con <span v-mark="{ at: 2, type:'circle', color: '#008f53' }">`defineProps`</span>.
- Se pasan como atributos al componente hijo con `:propName="propValue"`.


---
layout: quote
---

# Two-way data binding
## (`v-model`)

---
layout: two-cols
---

# Two-way data binding

```vue {all|4,8,9|9|2-4|all}
<script setup>
import { ref } from 'vue'

const msg = ref('World! 🔥🔥')
</script>

<template>
  <h1>Hello {{ msg }}</h1>
  <input v-model="msg" />
</template>
```

---
layout: two-cols-header
---

# Two-way data binding (`v-model`)

- es un shortcut de <span v-mark="{ type:'underline', color: '#008f53' }">`:value` + `@input`</span>.

<br />

````md magic-move
```vue {all|4,8,9|9|2-4|all}
<script setup>
import { ref } from 'vue'

const msg = ref('World! 🔥🔥')
</script>

<template>
  <h1>Hello {{ msg }}</h1>
  <input :value="msg" @input="e => msg = e.target.value" />
</template>
```
```vue {all|9|all}
<script setup>
import { ref } from 'vue'

const msg = ref('World! 🔥🔥')
</script>

<template>
  <h1>Hello {{ msg }}</h1>
  <input v-model="msg" />
</template>
```
````


---
layout: quote
---

# Slots

---
layout: two-cols
---

# Slots

Defniniendo slots (hijo):

```vue {all|3,7,11,12,13,14|11,12,13,14|all}
<template>
  <header>
    <slot name="header" />
  </header>

  <main>
    <slot />
  </main>

  <footer>
    <slot
      name="footer"
      :footerCopyright="'©️ 2024'"
    />
  </footer>
</template>

<script setup>
defineOptions({
  name: 'PageLayout'
})
</script>
```

::right::

<v-clicks depth="3">

**Qué son los `slots`?**
- Permiten pasar contenido al componente hijo.
- `slots` (como los `children` de React).
- Se definen con <span v-mark="{ at: 5, type:'circle', color: '#008f53' }">`<slot>`</span>.
  - Si no tienen `name`, se llaman `default`.

**Scoped slots**
- Se pueden pasar valores a los slots con **props**.
```
<slot name="slotName" :slotProp="slotPropValue" />
```

**Default content**
- Se pueden pasar "contenido" por defecto a los slots con
```
<slot name="slotName">Default content</slot>
```

</v-clicks>

---
layout: two-cols
---

# Slots (II)

Consumiendo componentes con slots (padre):

```vue {all|3-5,7-8,10-12|10|11|all}
<template>
  <PageLayout>
    <template #header>
      <h1>My header</h1>
    </template>

    <!-- Default slot, no tiene `<template>` -->
    <PageContent />

    <template #footer="{ footerCopyrigth }">
      <p>{{ footerCopyrigth }}</p>
    </template>
  </PageLayout>
</template>

<script setup>
import PageLayout from './PageLayout.vue'
</script>
```

::right::

<v-clicks depth="2">

- Se pasan como contenido al componente padre con `<template #slotName>`.
  - Para el slot `default`, se puede omitir `<template>`.
</v-clicks>

---
layout: image
title: Slots
image: /slots.png
backgroundSize: contain
transition: fade
---

---
layout: image
title: Named Slots
image: /named-slots.png
backgroundSize: contain
---

---
layout: section
---

## Composition API

## `defineProps`, `defineEmits`, `defineOptions`, `defineSlots`

---
layout: two-cols-header
---


::left::

```vue {all|3-5|7,8|9-12|13-17|19-21|23-25|all}
<script setup lang="ts">

const props = defineProps<{
  msg: string
}>()

// Shortcut (sin tipado)
const emits = defineEmits(['my-event'])
// o (_runtime object_ + tipado)
const emits = defineEmits({
  'my-event': (arg: string) => true
})
// o ("tuple syntax" + tipado)
const emit = defineEmits<{
  'my-event': [id: number]
  update: [value: string]
}>()

defineSlots<{
  default: () => any
}>()

defineOptions({
  name: 'MyComponent'
})
</script>
```

::right::

### `define-` helpers

`defineProps`, `defineEmits`, `defineOptions`, `defineSlots`

<v-clicks>

- Props: `defineProps` (tipado)
- Emits: `defineEmits` (tipado)
- Slots: `defineSlots` (tipado)
- Options: `defineOptions` (no tipado, meta-información)
</v-clicks>

---
layout: two-cols
---

# `defineProps`


````md magic-move
```vue
<script setup lang="ts">
import { defineProps } from 'vue'

// Definidas con una interfaz de TypeScript
const props = defineProps<{
  msg: string
}>()

</script>
```
```vue
<script setup lang="ts">
import { defineProps } from 'vue'

// Podemos extraer el tipado a una `interface` o `type`
interface Props {
  msg: string
}
const props = defineProps<Props>()

</script>
```
```vue
<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  msg: string
}

// Con `withDefaults` podemos definir
// valores por defecto
const props = withDefaults(
  defineProps<Props>(),
  {
    msg: 'Hello'
  }
)

</script>
```
```vue
<script setup lang="ts">
import { defineProps } from 'vue'

// O podemos definirlas con un "runtime object"
const props = defineProps({
  msg: String
})
</script>
```
```vue
<script setup lang="ts">
import { defineProps } from 'vue'

// Los "runtime objects" nos dan más opciones:
const props = defineProps({
  msg: {
    type: String,
    required: true,
    default: 'Hello'
    validator: (value: string) => value.length > 3
  }
})
</script>
```
````

---
layout: quote
---

# Reactivity API: Core

---
layout: two-cols-header
---

# `ref`, `reactive`, `computed`

::left::

```vue {all|5|5-7|9-12|14|15|all}
<script setup>
import { ref, reactive, computed } from 'vue'

 // Strings, Numbers, Arrays, Objects, etc.
const msg = ref('Hello')

console.log(msg.value) // `.value` para acceder al valor

const todos = reactive([
  { text: 'Learn Vue' },
  { text: 'Build cool things' }
])

const reversedTodos = computed(() => todos.reverse())
const reversedMsg = computed(() => msg.value.split('').reverse().join(''))

console.log(reversedTodos.value, reversedMsg.value) // `.value` para acceder al valor
</script>
```

::right::

<v-clicks depth="2">

- <span v-mark="{ at: 7, type:'underline', color: '#008f53' }">⭐️ `ref`</span> para todo tipo de valores.
- `computed` para computar valores a partir de otros.
- `reactive` para objetos.
  - `toRefs` para desestructurar.

</v-clicks>

<!-- - (No es necesario definir las dependencias como en React.)
- no es necesario usar `.value` para acceder a los valores como con `ref`. -->

---
layout: two-cols
---

# `watch` y `watchEffect`

```vue {all|5-8|9-12|all}
<script setup>
import { ref, watch } from 'vue'

const msg = ref('Hello')

watch(msg, (newValue, oldValue) => {
  console.log(newValue, oldValue)
})

watchEffect(() => {
  console.log(msg.value)
})
</script>
```

::right::

<v-clicks depth="2">

- <span v-mark="{ at: 4, type:'underline', color: '#008f53' }">`watch`</span> para observar cambios en un valor.
  - Es necesario definir las dependencias en el primer parámetro.
- <span v-mark="{ at: 6, type:'underline', color: '#008f53' }">`watchEffect`</span> para observar cambios en uno o varios valores y ejecutar una función.
  - No es necesario definir las dependencias.

</v-clicks>

---
layout: quote
---

# Lifecycle Hooks

---
layout: two-cols
title: Lifecycle Hooks
---

<v-clicks depth="2">

- 🧬 Lifecycle Hooks (en orden):
  - `onBeforeMount()`
  - `onMounted()`
  - `onBeforeUpdate()`
  - `onUpdated()`
  - `onBeforeUnmount()`
  - `onUnmounted()`

- 🦆 Debug Hooks:
  - `onErrorCaptured()`
  - `onRenderTracked()`
  - `onRenderTriggered()`

</v-clicks>

::right::

<v-clicks depth="2">

- 🥀 `<KeepAlive>` Hooks:
  - `onActivated()`
  - `onDeactivated()`

- 🛜 SSR Hook:
  - `onServerPrefetch()`

</v-clicks>

---
layout: image
image: /mhm.gif
title: Homer
---

---
layout: section
---

# Estilos: `class` y `style`

---
layout: quote
---

# Clases dinámicas

---
layout: two-cols
---

# Clases dinámicas (condicionales)

```vue{all|2|2,6|all}
<template>
  <div :class="{ active: isActive }"></div>
</template>

<script setup>
const isActive = ref(true)
</script>
```

::right::

### `:class` (Object syntax)

<v-clicks>

- (alias de`v-bind:class`)
- Se le pasa un objecto `:class="{ className: condition }"`
- En este caso: La clase `'active'` se añade si `isActive` es `true`.

</v-clicks>


---
layout: two-cols
---

# Clases dinámicas (composición)

```vue{all|2|2,6-7|all}
<template>
  <div :class="[class1, class2]"></div>
</template>

<script setup>
const class1 = 'active'
const class2 = ref('text-red bg-blue')
</script>
```

::right::

### `:class` (Array syntax)

<v-clicks>

- (alias de`v-bind:class`)
- Se le pasa un array `:class="[class1, class2]"`
- En este caso: Se añaden las clases `'active'`, `'text-red'` y `'bg-blue'`.

</v-clicks>

---
layout: two-cols
---

# Clases dinámicas (mezcla)

```vue{all|2-5|2-5,9-10|all}
<template>
  <div :class="[
    class1,
    { active: isActive }
  ]"></div>
</template>

<script setup>
const class1 = 'text-red'
const isActive = ref(true)
</script>
```

::right::

### `:class` (Combining syntaxes)

<v-clicks>

- (alias de`v-bind:class`)
- Se le pasa un array que puede contener objetos `:class="[class1, { active: isActive }]"`
- En este caso: Se añaden las clases `'active'` y `'text-red'`.

</v-clicks>

---
layout: quote
---

# Estilos en línea

---
layout: two-cols
---

# Estilos en línea

```vue{all|2|2,6|all}
<template>
  <div :style="{ backgroundColor: bgColor }"></div>
</template>

<script setup>
const bgColor = ref('red')
</script>
```

::right::

### `:style`

<v-clicks depth="2">

- (alias de`v-bind:style`)
- Se le pasa un objecto `:style="{ styleName: value }"`
  - Los nombres de las propiedades son "camelCase", como en <logos-javascript /> JS.
- En este caso: El fondo del elemento será rojo.

</v-clicks>

---
layout: quote
---

# Scoped Styles

---
layout: two-cols
---

# Bloque de estilo en los componentes

```vue{all|5|2,5-9|all}
<template>
  <div>Ejemplo</div>
</template>

<style scoped>
div {
  background-color: red;
}
</style>
```

::right::

### `scoped`

<v-clicks>

- Si añade el atributo `scoped` al bloque de estilos, los estilos se aplican solo al componente actual.

```vue
<style>
/* global styles: leaking */
</style>

<style scoped>
/* local styles: contained */
</style>
```

</v-clicks>


---
layout: quote
---

# <logos-css-3 /> Estilos Globales

---
layout: two-cols
transition: fade
---

# Estilos Globales (JS/TS)

## Opción 1: <logos-typescript-icon /> `import`

```ts{all}
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
// 👇🏽 Importamos los estilos globales
// Vite se encarga de importarlos en el HTML
import './styles.css'

createApp(App).mount('#app')
```
---
layout: two-cols
---

# Estilos Globales (HTML)

## Opción 2: <logos-html-5 /> `link` o `<style>`

```html{all}
<!-- index.html -->
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <link rel="stylesheet" href="/styles.css">
    <style>
      /* global styles */
    </style>
    <title>Vue App</title>
  </head>
    <!-- ... -->
```

::right::

<v-clicks>

- Normalmente, se importan en el `main.ts` o en el `index.html`.
- Se pueden importar como un módulo JS o como un archivo CSS normal.

</v-clicks>


---
layout: statement
---

# Parte práctica

---
layout: two-cols-header
---

# ¿Qué necesitamos?

### Herramientas

::left::
<v-clicks depth="2">

- Editor
  - (**VSCode**)
  - Extensiones: `Prettier`, `ESLint`
  - Extensión `Vue - Official` (para VSCode)
- Gestor de paquetes (npm/**pnpm**/yarn)
  - `pnpm`
- Vue DevTools
</v-clicks>

::right::

<div class="relative">
  <div class="absolute translate-y-[-50%] max-h-md overflow-hidden" v-click=[2,3]>
    <img src="/vscode.png" class="mb-5" />
    <a href="https://code.visualstudio.com/docs/nodejs/vuejs-tutorial"><em>Using Vue in Visual Studio Code</em></a>
  </div>

  <div class="absolute translate-y-[-50%] max-h-md overflow-hidden" v-click=[3,4]>
    <img src="/eslintprettier.png" />
    <a href="https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint">Prettier</a>
    <a href="https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode">ESLint</a>
  </div>

  <div class="absolute translate-y-[-50%] max-h-md overflow-hidden" v-click=[4,5]>
    <img src="/vue-extension.png" />
    <a href="https://marketplace.visualstudio.com/items?itemName=Vue.volar">(antes llamada "Volar")</a>
  </div>

  <div class="absolute translate-y-[-50%] max-h-md overflow-hidden" v-click=[6,7]>
    <img src="/pnpm-logo.png" />
    <a href="https://pnpm.io/"><code>pnpm</code></a>
  </div>

  <div class="absolute translate-y-[-50%] max-h-md overflow-hidden" v-click=[7,8,9,10,11,12]>
    <img src="/devtools.png" />
    <a href="https://devtools.vuejs.org/">Vue Devtools</a>
  </div>
</div>


---
layout: hero-image
image: /teclado.gif
class: text-center
---

# A los teclados!


<!-- Fin de la sesión I -->

---
layout: custom-cover
background: vue-sticker.jpg
---

# <logos-vue /> Vue - II

## 🌈 Vuenas tardes a tod@s! 🌈

---
layout: quote
---

# Agenda

- Composition API


---
layout: hero-image
image: /teclado.gif
class: text-center
---

# Vuelta a los teclados!

---
layout: hero-image
image: /composition-docs.png
---

## Composition API



---
layout: quote
---

# Docs

<img src="/toggle.png" class="max-h-xs" />

https://vuejs.org/guide/introduction.html

---
layout: two-cols
---

# Composition API

![](/comparison.png)

::right::

<v-clicks depth="2">

- Ventajas:

  - Ordenar por features
  - Incluso módulos/paquetes
  - Composición de funciones.

- Desventajas:

  - Arquitectura menos definida
  - Requiere más conocimientos de Vue y JS
  - Llamadas asíncronas requieren `<Suspense>`

</v-clicks>


---
layout: image
image: /side-by-side.jpeg
title: Code Side by Side
backgroundSize: contain
---


---
layout: image
image: /setup-diagram.png
title: Setup()
backgroundSize: contain
---

---
layout: full
---

# Mimimimi

<div class="grid grid-cols-[1fr_5fr]">
  <img src="/brain.png" class="m-auto object-contain max-h-sm" />

  <section>
    <div v-click="1">
      <h3>Options API</h3>
      <a href="https://codesandbox.io/s/traductor-mimimi-vue-3-uie1x" target="_blank">https://codesandbox.io/s/traductor-mimimi-vue-3-uie1x</a>
    </div>
    <div v-click="2" class="mt-10">
      <h3>Composition API con setup()</h3>
      <a href="https://codesandbox.io/s/traductor-mimimi-vue-3-composition-api-tuip2" target="_blank">https://codesandbox.io/s/traductor-mimimi-vue-3-composition-api-tuip2</a>
    </div>
    <div v-click="3" class="mt-9">
      <h3>Composition API con <code>&lt;script setup&gt;</code></h3>
      <a href="https://codesandbox.io/s/traductor-mimimi-vue-3-composition-api-script-setup-sbf4yn?file=/src/App.vue" target="_blank">https://codesandbox.io/s/traductor-mimimi-vue-3-composition-api-script-setup-sbf4yn?file=/src/App.vue</a>
    </div>
    <div v-click="4" class="mt-2">
      <h3>Composables con <code>&lt;script setup&gt;</code></h3>
      <a href="https://codesandbox.io/s/traductor-mimimi-vue-3-composition-api-composables-84t5x?file=/src/App.vue" target="_blank">https://codesandbox.io/s/traductor-mimimi-vue-3-composition-api-composables-84t5x?file=/src/App.vue</a>
    </div>
  </section>
</div>

---
layout: image
image: /lego.jpeg
title: Composables (Lego)
backgroundSize: contain
---

---
layout: hero-image
image: /teclado.gif
class: text-center
---

# <logos-vue /> Vamos a seguir!! 🚀

---
layout: custom-cover
background: vue-sticker.jpg
---

# <logos-vue /> Vue - III

## 🌈 Vuenas tardes!!! 🌈

---
layout: quote
---

# Agenda

- onMounted, watchers, etc.
- Testing


---
layout: end
---

# ¡Muchas Gracias! 🖖🏽 ❤️

<div class="grid grid-cols-2 items-center gap-4 border bg-white mt-5">
  <div class="text-center p-16">
    <img src="/lemoncode.png" />
  </div>
  <div class="text-center p-16">
    <img src="/basefactor.jpeg" />
  </div>
</div>

<div class="flex justify-between mt-10">
  <a href="https://twitter.com/lemoncoders"><logos-twitter /> @lemoncoders</a>
  <a href="https://github.com/lemoncode
"><logos-github-octocat /> https://github.com/lemoncode</a>
  <a href="https://twitter.com/basefactorteam"><logos-twitter /> @basefactorteam</a>
</div>
