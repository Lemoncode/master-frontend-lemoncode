---
theme: seriph
lineNumbers: true
drawings:
  persist: false
transition: fade
title: Módulo Vue.js con Paul Melero
mdc: true
themeConfig:
  primary: 'rgb(0 220 130)'
layout: custom-cover
background: vue-sticker.jpg
class: text-center
---

# ¡Bienvenid@s a <br/> <carbon-logo-vue /> Vue.js!

🖖

---
layout: image-right-rounded
image: paul.jpeg
class: grid
---

# Paul Melero

<div class="my-auto">

<h3 class="text-green-400 mb-3">Web Engineer | Vue.js Instructor</h3>

- <logos-bluesky />&nbsp;[@paulmelero.com](https://bsky.app/profile/paulmelero.com)
- 📩&nbsp;&nbsp;contact@paulmelero.com
- 🌐&nbsp;&nbsp;https://paulmelero.com
- <logos-netlify-icon />&nbsp;&nbsp;[Slides](https://slides-vue-lemoncode.netlify.app/)
- <logos-github-icon class="github-icon" />&nbsp;&nbsp;[https://github.com/paulmelero/slides-vue-lemoncode](https://github.com/paulmelero/slides-vue-lemoncode)

<style>
.github-icon * {
  fill: rgb(255 255 255 / 1) !important;
}
</style>



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
# <logos-vue /> Vue en 60 segundos

<v-clicks>

- **Reactividad**: Reactive Data Binding.
- **Componentes**: Component-based Architecture.
- **Tooling**: Vite+, Vue Devtools, Vue Router, Pinia...
- **Meta-framework**: <logos-nuxt-icon /> Nuxt.
- **Ligero, gradual y maduro**: fácil de aprender, integrar y escalar.
- Lenguaje dedicado (_domain-specific language (DSL)_).

</v-clicks>

---
layout: two-cols
---

# ¿Por qué aprender los fundamentos en la era de la IA?

<v-clicks>

- La IA genera código _plausible_ pero no sabe qué es correcto.
- Para escribir mejores prompts necesitas un modelo mental.
- Reactividad, componentes, props/emits, lifecycle y render se aprenden practicando.
- La IA acelera; no sustituye entender.

</v-clicks>

::right::

## Encuentra el bug

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

<v-click>

Falta `count.value++`. La IA también puede olvidar un `.value`.

</v-click>

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
Estado + hooks
</td></tr>
<tr><td>
v-model
</td><td>
Controlled inputs
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
Pinia
</td><td>
Context API / Zustand / Redux
</td></tr>
<tr><td>
Vite / Vite+
</td><td>
Vite / Next.js
</td></tr>
<tr><td>
Ionic / Capacitor
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
Reactividad (refs)
</td><td>
Signals / RxJS
</td></tr>
<tr><td>
SFC
</td><td>
Componentes / Módulos
</td></tr>
<tr><td>
Pinia
</td><td>
NgRx / Services
</td></tr>
<tr><td>
Vite / Vite+
</td><td>
Vite
</td></tr>
<tr><td>
Curva de aprendizaje suave
</td><td>
Curva más pronunciada
</td></tr>
</tbody>
</table>

---
layout: default
title: Números
---

# Números

<div class="max-w-4xl mx-auto mt-8 space-y-3 text-sm">

<div class="grid grid-cols-[7rem_1fr_6rem] items-center gap-3">
  <span class="font-semibold">React</span>
  <div class="h-7 rounded bg-cyan-500" style="width: 100%"></div>
  <span class="text-right">6,05 B</span>
</div>

<div class="grid grid-cols-[7rem_1fr_6rem] items-center gap-3">
  <span class="font-semibold">Vue</span>
  <div class="h-7 rounded bg-emerald-500" style="width: 9.8%; min-width: 4px"></div>
  <span class="text-right">594 M</span>
</div>

<div class="grid grid-cols-[7rem_1fr_6rem] items-center gap-3">
  <span class="font-semibold">Angular</span>
  <div class="h-7 rounded bg-red-500" style="width: 4.4%; min-width: 4px"></div>
  <span class="text-right">263 M</span>
</div>

<div class="grid grid-cols-[7rem_1fr_6rem] items-center gap-3">
  <span class="font-semibold">Svelte</span>
  <div class="h-7 rounded bg-orange-500" style="width: 3.5%; min-width: 4px"></div>
  <span class="text-right">211 M</span>
</div>

</div>

<p class="text-xs opacity-60 mt-8">
  Descargas npm del último año (30 oct 2026) · paquete principal de cada framework · fuente: api.npmjs.org.
  Las descargas no miden empleabilidad ni preferencia.
</p>

<!-- TODO: actualizar esta comparativa cada año con datos de npm y una nota de contexto. -->

---
layout: center
---

# Consejo Personal

<v-clicks>

- 📚 Mi consejo es que aprendáis a usar todos los frameworks del Máster. (Si puede ser, al menos, 2.)
- 🚀 Para la empleabilidad, muchas veces se valora el esfuerzo y las ganas de aprender.
- 😉 Y si os gusta uno en concreto, especializaos en él.

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
layout: quote
---

# Ruta de la sesión

- Qué es Vue y por qué importan los fundamentos.
- Reactividad y sintaxis.
- Componentes, props, eventos y slots.
- Composition API y estilos.
- Práctica guiada: construimos un **bloc de notas**.

---
layout: statement
---

# Empecemos con la Teoría

<!-- image centered -->
<div class="text-center">
  <img src="/squeeze.gif" class="m-auto object-contain max-h-[24rem]" />
</div>

---
layout: section
---

# Qué es la **Reactividad**?

---
layout: center
title: Reactividad (video)
---

<SlidevVideo controls autoreset class="m-auto max-h-[60vh]">
  <source src="/reactividad.mp4" type="video/mp4" />
</SlidevVideo>

---
layout: section
---

# Reactividad en Vue

---
layout: center
---

# Objetos ( en <logos-javascript /> puro)

```ts{all|1|3|1-5|all}
const obj = { count: 0 }

console.log(obj.count) // 0

obj.count = 1

console.log(obj.count) // 1
```

---
layout: center
---

# Getters y Setters (<logos-javascript />)

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

# Getters y Setters (+ transformación)

## <logos-javascript />

<style>
  h2 {text-align: end;}
</style>

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

## <logos-javascript />

<style>
  h2 {text-align: end;}
</style>

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

# JS Proxies (+ _side effects_)


## <logos-javascript />

<style>
  h2 {text-align: end;}
</style>

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


## <logos-javascript />

<style>
  h2 {text-align: end;}
</style>

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

<div class="text-center">
  <img src="/bongo_lemon.webp" class="m-auto object-contain max-h-[24rem]" />
</div>

---
layout: section
title: Mycomponent.vue
---

<h1>
  <code>MyComponent<span v-mark="{ at: 1, type: 'underline', color: '#008f53' }">.vue</span></code></h1>

---
layout: two-cols
---

# <logos-vue /> Single File Components

<style>
  h1 {font-size: 1.75rem}
</style>

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
- `template`
  - En `template` no es necesario que haya 1 sólo elemento raíz.
- `script`
  - <span v-mark="{ type:'circle', color: '#008f53' }">`script setup`</span> (recomendado)
- `style`
  - <span v-mark="{ type:'circle', color: '#008f53' }">`style scoped`</span> (recomendado)

</v-clicks>



---
layout: two-cols
---

# <logos-typescript-icon /> Con TypeScript

```vue {all|1|all}
<script setup lang="ts">
// MyComponent.vue
import { ref } from 'vue'

const msg = ref('My value')
</script>
```

::right::

- La extensión del archivo sigue siendo `.vue`.
- Pero añadimos <span v-mark="{ type:'circle', color: '#008f53' }">`lang="ts"`</span> en la etiqueta `<script>`.


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
title: Options API vs Composition API
---
<v-switch>

<template #0-7>
  <h1>Options API (código heredado) 🧑🏽‍🦳</h1>
</template>
<template #7>
  <h1>Composition API con <code>script setup</code> ✅</h1>
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


<!-- Options API no está deprecada: sigue soportada. Para código nuevo, usa `<script setup>`. -->

> Options API no está deprecada, pero el código nuevo debería usar `<script setup>`. La verás en proyectos heredados.

---
layout: statement
---

# Sintaxis de las plantillas

## `<template>`


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

- `{{ msg }}` es una expresión de Vue (que tiene que estar definida en el componente).
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
  { id: 1, text: 'Learn Vue' },
  { id: 2, text: 'Build cool things' }
]
</script>

<template>
	<ul>
    <li
      v-for="todo in todos"
      :key="todo.id"
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

# 💬 Manejando Eventos

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
- También se pueden usar key aliases (`.enter`, `.esc`, etc.) y modificadores de sistema (`.ctrl`, `.shift`, `.alt`, `.meta`). [Más info](https://vuejs.org/guide/essentials/event-handling.html#key-modifiers)

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
  <li>Después, los escuchamos con `<span v-mark="{ at: 5, type: 'underline', color: '#008f53' }">@</span>&lt;nombre-del-evento&gt;`.</li>
</ul>

</v-clicks>

---
layout: default
---

## Demo · eventos

<Playground url="https://play.vuejs.org/#eNp9k0FP3DAQhf/KyBdA7CasqFopZCNatIf20CLaoy8mmewanLFlj5ddRfnvlRN2gYpySjLvm8x7GacXX53LthFFIcpQe+0YAnJ0YBStl1JwkKKSpDtnPUMPHlsYoPW2g5NtxBNJkmpLgaG2kRiWiTi9OEv1NlLN2hJoqj12SHx6Br0kmNhsq0zE83NJwxvaY8D3SFjCxciW+eS0Sm0lY+eMYqwSXnZK03gHUG4W1WqLxDaU+WZxqLrqxhKrxvoC+v7Z9jCUuTsQ95HZElzXRtePSymO9qWozhdlPun/o0f7UlR36fov7KpSk4sMzqgaN9Y06JdS3EYTFKyI0UsB14+4jy7D9Ph2POTVwWeZP0ct81dfQFIZeG/S7b1t9tBDa4nnreq02RcQ9oGxm0c9g6AozAN63V5Bp/xaUwEXV+BU02haF7Dw2F3BICmNgR46tZs/6YY3BVx+HrVjF6jIdmSnsDOYMk7DC9C0Qa/5FQH9y6Dsk8cOsi/jO+voQ1qMszqlH1vKfIokZoJDbanV6+whWBKFGI+IFLXtnDbof7l0gIIUxXR4kqaMsU8/xhr7iLNDvd5g/fhO/SHsUk2K27RIv0Upjhorv067TfLq90/c8Suxs000+KF4h8GamDxO2LdIjUkrn71x+3382TSt/4TVjpHCIVQymshhNuXeRrz5IPqL3cvscuyTNIjhL8ACVqc=" label="Demo: eventos" />

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
layout: two-cols
---

# `attrs` y `props`

```vue
<!-- MyParent.vue -->
<template>
  <MyComponent
    :msg="myValue"
    class="text-red"
    data-test-id="button"
    @click="handleClick"
  />
</template>

<script setup>
import MyComponent from './MyComponent.vue'
const myValue = 'Hello!'
function handleClick() { /* ... */ }
</script>
```
<v-click>

```vue
<!-- MyComponent.vue -->
<template>
  <button>{{ msg }}</button>
</template>

<script setup lang="ts">
defineProps<{ msg: string }>()
</script>
```

</v-click>

::right::

<v-clicks>

- `attrs` son los atributos de HTML que se pasan al componente hijo.
- `props` son los datos que se pasan al componente hijo.

</v-clicks>

---
layout: default
---

## Demo · props

<Playground url="https://play.vuejs.org/#eNqFU01v1DAQ/SsjXwpSdsO2CKQ0XQlQDyBRKsrRF28ym3Wxx5Y93g9F+e8oTrfNAcrNem/mvZk3ci8+eb/cJxSVqGMTtGeIyMmDUdTdSMFRirUkbb0LDHeO8T7gXuMBtsFZuFiWjbPeERLHckaPmheS6nISXUuSVDNabxTjWhJAbZWm/AKod6v1fXA+1uVudcbmZqzZ4I0U3zWQYyUFVAcX2ngjxepSCignyfJJsy5nVpLqyCczPjeuPUEPW0e82CqrzamCeIqMdpF0AVFRXEQMensNVoVOUwXvrsGrttXUVbAKaK9hkDTaQA9WHRcH3fKugqsPmXvuApXY5dpNYnZUgCaf+Mm8Ak07DJpnFdC/GC3fB7Sw/Jg1mxSiCxV4p4kx5Ja6nFYShfh3/v+5aYtbTZhjf9OP8eWQK3jgoKkrRiRnXMFdshsMhaTh7esnVYF1Y/D5qpfrvp9kYRjqcnd5ZvxIZHUYBvDKqE1QsS790x1fhGanFIXg2Dja6m75GB2JSuS5Zc5AGww/PGtHUYoK+slJCmWMO3zLGIeExRlvdtj8/gv+GI8jJsV9wIhhj1I8c6xChzzRtw93eOQZaV2bDL5K/sToTBpnnMo+J2oNhlldnvZr/m2aul/x9shI8bzUOOhYORTT3vuEX15Z/WXcq+VV7pM0iOEPc59XrA==" label="Demo: props" />

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
layout: default
---

## Demo · v-model

<Playground url="https://play.vuejs.org/#eNqFU2Fr2zAQ/SuHvqSDxF7o2MB1AtsIrIN1o9tHfXHts6NOOgnplCYY//dhOUnD2NpPFvfevbunJ/fio3PZLqIoRBlqrxxDQI4OdEXdSgoOUqwlKeOsZ+jBYwsDtN4amO0izs7QnWW8JRf5CGZ5bY2zhMQhP4PZ1COpthQYyDLCahS9mn2xupq9kVTm0x7rkVYyGqcrxrUkgNJUitIJoNwu17uFsQ3qMt8uT9XnNY7gSopxihSQnzhu3ffT6GEoczdJ50ftMr8YKakMfNDj8cE2B+ihtcSLtjJKHwoIh8BoFlHNIVQUFgG9am/AVL5TVMDbG3BV0yjqClh6NDcwSBrHQA+m2i+eVMPbAq7fJ+zcBVVkm7gPkdnSHFQyNA0vQNEWveILBvTPg7J3Hg1kH5JmHX2wvgBnFTH61FLmkyUxF/9L6JXHMGWXbhdW0GCrCL+lIAJ7Rd366pUY1V8Bpa8U4HRV49bqBv1Kis0o8IBZlh3Du4hGzAWH2lKruuwxWBKF6EdpmTwpjf67Y2UpSFFAP+UuRaW1ffqaauwjzk/1eov173/UH8N+rEnxw2NAv0MpzhhXvkOe4M3PO9zzBWhsEzW+CN5jsDqOO060T5Eajf6Cl7a9TX+Xou5X2OwZKZxMjYuOzGE++d5F/PyC9ed1r7Pr1CdpEMMfB5tbvA==" label="Demo: v-model" />

---
layout: quote
---

# Slots

---
layout: default
---

# Slots

````md magic-move
```vue{all|4|3-5|all}
<!-- components/MyButton.vue -->
<template>
  <button>
    <slot />
  </button>
</template>
```
```vue
<!-- pages/MyParent.vue -->
<template>
  <MyButton>
    Pulsar aquí
  </MyButton>
</template>
```
```vue
<!-- pages/MyParent.vue -->
<template>
  <MyButton>
    Pulsar aquí <!-- 👈🏽 texto / Etiquetas HTML / Componentes de Vue -->
  </MyButton>
</template>
```
```vue
<!-- components/MyButton.vue -->
<template>
  <button>
    <slot />
  </button>
</template>
```
```vue{all|4|all}
<!-- components/MyButton.vue -->
<template>
  <button>
    <slot name="default" />
  </button>
</template>
```
````

---
layout: two-cols
---

# Named Slots (I)

Definiendo slots (hijo):

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

# Named Slots (II)

Consumiendo componentes con slots (padre):

```vue {all|3-5,7-8,10-12|10|11|all}
<template>
  <PageLayout>
    <template #header>
      <h1>My header</h1>
    </template>

    <!-- Default slot, no tiene `<template>` -->
    <PageContent />

    <template #footer="{ footerCopyright }">
      <p>{{ footerCopyright }}</p>
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
layout: default
---

## Demo · slots

<Playground url="https://play.vuejs.org/#eNqFVMtu2zAQ/JUFe0gL2FYefQCKrKANcmiBukHTIy+0tLKZkkuCXDk2BP97IdGvFGnqkzyzszu7GqgTn72frFoUuShiFbRniMitB6NoMZWCoxSlJG29Cwwzx3irQg1NcBbOJlnlrHeExDHbc323M0lFltqVkiQVjNYbxVhKAiis0jQ8ARTLi/LBOI5FtrzYY4cx+ZMLdZxK8WFwAcPv0AzeLFHVGA5M3+6y/K6BHKsiW14eNdmJgwPoy7vICJUjRtK1g5UCZSAax+BdgBobrNhNisyfyo7zG+cYw1SKDgansD3xCVBEq4wpuwO7Ba+MmgcViyxxLxpMwP4K6WbZ7mh/bVJE3pj+ce7qDXTQOOJxo6w2mxziJjLacatHEBXFccSgm2uwKiw05XB+DV7VtaZFDhcB7TVsJfVjoAOr1uMnXfMyh6uPA3dQgWrZDbXzltnRCDT5lnfDc9C0xKD5pAK646DJ+4AWJp+GnlUbogs5eKeJMQySIksriZH4R7r+k9UaG014H5yPb3eXz2HW2jkG2L57PZkRK9buGM6Ur2JIBCmLUykSJgVkZZE9C2Aqy/b/UjieixMmxTHZKRk3N3C+a7mTpZd+9HPy3sVIcKwcNXoxeYyORC66vlwOB9MGww/fq6IUOXTJjRTKGPf0bcA4tDja49USq98v4I9x3WNS3AeMGFYoxYFjFRbIib57mOGaT0jr6tbgq+RPjM60vcdU9qWl2vR3GT1z+3X46mha/Ip3a0aK+6V6o33ldpT2XrV4+8rqR7tXk6tBJ2krtn8A/ZSnwQ==" label="Demo: slots" />

---
layout: statement
---

# Sintaxis de los scripts

## `<script setup>`

---
layout: two-cols
title: script setup
---

# Ejemplos

```vue
<script setup>
console.log('Hello from setup')
</script>
```

::right::

<v-clicks>

````md magic-move
```vue
<script setup>
// variables
const unaVariable = 'Hola!'

// funciones
function unaFuncion() {
  console.log(unaVariable)
}
</script>

<template>
  <button @click="unaFuncion">
    {{ unaVariable }}
  </button>
</template>
```
```vue
<template>
  <button @click="unaFuncion">
    {{ unaVariable }}
  </button>
</template>

<script setup>
// variables
const unaVariable = 'Hola!'

// funciones
function unaFuncion() {
  console.log(unaVariable)
}
</script>
```
````

</v-clicks>

---
layout: section
---

# Composition API

## `define-` helpers

### `defineProps`, `defineEmits`, `defineSlots`, `defineModel`, etc.

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
// o (runtime object + tipado)
const emits = defineEmits({
  'my-event': (arg: string) => true
})
// o ("tuple syntax" + tipado)
const emit = defineEmits<{
  'my-event': [arg: string]
  'my-event-2': [arg2: number]
}>()

defineSlots<{
  default: () => any
}>()

// Alias de emit + props para two-way data binding (v-model)
const model = defineModel()
</script>
```

::right::

<v-click at="1">

- Props: `defineProps` (tipado)

</v-click>

<v-click at="2">

- Emits: `defineEmits` (tipado)

</v-click>

<v-click at="5">

- Slots: `defineSlots` (tipado)

</v-click>

<v-click at="6">

- Model: `defineModel` (tipado)

</v-click>

---
layout: two-cols
---

# `defineProps`


````md magic-move
```vue{all|5-8|all}
<script setup lang="ts">

// Definidas con una interfaz de TypeScript
const props = defineProps<{
  msg: string
}>()

</script>
```
```vue{all|5-8|all}
<script setup lang="ts">

// Podemos extraer el tipado a una `interface` o `type`
interface Props {
  msg: string
}
const props = defineProps<Props>()

</script>
```
```vue
<script setup lang="ts">

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

// O podemos definirlas con un "runtime object"
const props = defineProps({
  msg: String
})
</script>
```
```vue
<script setup lang="ts">

// Los "runtime objects" nos dan más opciones:
const props = defineProps({
  msg: {
    type: String,
    required: true,
    default: 'Hello',
    validator: (value: string) => value.length > 3
  }
})
</script>
```
````

::right::

<v-clicks>

```vue
<template>
  <MyComponent msg="'Hello!'" />
</template>

<script setup>
import MyComponent from './MyComponent.vue'
</script>
```

[Vue Playground](https://play.vuejs.org/#eNp9UstOwzAQ/JXFl4JUNQc4RWklHpUACahoxSmXKNkEl8S2bKe0RPl31k7Tpgi42TO74/HONuxaqcmmRhayyGKlysTiLBYA0dPuVlZKChQWwsoU05hVu7ekrDFmEFBNFAwa6GpSzZUFg7ZWhHBq1haGMrmWFYwmwQBzb49ceyqFsbB/AaYwuseylGfERUGnPGNjZg3V5byYrI0U5LlxVmOWkhwvUb8oy0knZiF4xnEJyXw+eszqGsc9nr5j+vELvjZbh8VsodGg3tB3D5xNdIG2o+fLZ9zS+UBWMqtLqv6HfEUjy9p57MpuapGR7UGdd/vgR8dFsTLzrUVh+k85o66y9fUxo+G5Sf719aPdy8mV74tFS1P8MX+X/TA8KBPh4rakdgyygQxzLnChpTLQ7sPs4wsCuHM0zxIDlBHUIgEuLOo8+aJOWO0ULv0jfdbKC02HspG3TssWgrGaBkB+Z+cXfr36LfCX01XN+MYfAJqGmlv6JqFBB5+sKWu/ARg6AVw=)

</v-clicks>

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

const reversedTodos = computed(() => [...todos].reverse())
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

# Clases de CSS dinámicas

---
layout: two-cols
---

# Clases de CSS dinámicas (condicionales)

```vue{all|2|2,6|all}
<template>
  <div :class="{ active: isActive }"></div>
</template>

<script setup>
const isActive = ref(true)
</script>
```

::right::

### `:class` (Objetos)

<v-clicks>

- _(alias de`v-bind:class`)_
- Se le pasa un objeto `:class="{ className: condition }"`
- En este caso: La clase `'active'` se añade si `isActive` es `true`.

</v-clicks>


---
layout: two-cols
---

# Clases de CSS dinámicas (composición)

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

### `:class` (Arrays)

<v-clicks>

- (alias de`v-bind:class`)
- Se le pasa un array `:class="[class1, class2]"`
- En este caso: Se añaden las clases `'active'`, `'text-red'` y `'bg-blue'`.

</v-clicks>

---
layout: two-cols
---

# Clases de CSS dinámicas (composición + condicionales)

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

### `:class` (Combinando arrays, objetos, strings...)

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

````md magic-move {at: 7}
```vue{all|2|2,6|all}
<template>
  <div :style="{ backgroundColor: bgColor }"></div>
</template>

<script setup>
const bgColor = ref('red')
</script>
```
```vue{all|3|3-4|all}
<template>
  <MyComponent
    :style="{ '--bg-color': bgColor }"
    class="text-[var(--bg-color)]"
  />
</template>

<script setup>
const bgColor = ref('red')
</script>
```
````

::right::

### `:style`

<v-clicks depth="2">

- (alias de`v-bind:style`)
- Se le pasa un objeto `:style="{ styleName: value }"`
  - Los nombres de las propiedades son "camelCase", como en <logos-javascript /> JS.
- En este caso: El fondo del elemento será rojo.
</v-clicks>

<v-click at="12">

- Bastante útil con variables CSS
  - (incluso con <logos-tailwindcss-icon /> TailwindCSS)

</v-click>


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

- Si se añade el atributo `scoped` al bloque de estilos, los estilos se aplican solo al componente actual.

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
// Vite/Vite+ se encarga de importarlos en el HTML
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
layout: section
---

# Práctica guiada: bloc de notas

<!-- image centered -->
<div class="text-center">
  <img src="/cortar.gif" class="m-auto object-contain max-h-[24rem]" />
</div>

---
layout: default
---

# Qué vamos a construir

<v-clicks>

- Un **bloc de notas** con contador de palabras.
- Empezamos con `<script setup>` y acabamos con composables.
- Cada checkpoint tiene un playground embebido: cambia el código y prueba.
- Al final, une todo en una mini-app.

</v-clicks>

---
layout: default
---

## Checkpoint 1 · `<script setup>`

<Playground url="https://play.vuejs.org/#eNp9U9GK2zAQ/JVFUJLQ2E442oJjp/SOe2gf2tL2US+KvbF1lSUhrRKnJv9+yL6kgZZ7EzOzszOLPbBP1qaHgCxnha+ctAQeKVhQQjclZ+Q523ItO2scwQAO90uoTGcDYQ1n2DvTwewQcMY115XRnkAbQiijdD6bLS7o0bj6wQRNUF4N5vMFlFuuYZxJD0IFTMnJbr6Aj/9iqbdK0jzj3L/NFqlC3VALOay4XnBdZFOBbUxSEHZWCcLRveiE1OMLoGjX23tlKqgxbhC+yNr1hSPsSTgUcEg6U6MqOYspOANnjr7kbL3iDKwSFbZG1ehKzh7j2h1C0GI0TNOUM8gulnY7DDflz2ewQomdE3O/KDI75cteAhbZTW6uC08nFZ87U59ggL3RlOxFJ9UpB3/yhF0S5BK80D7x6OR+A51wjdQ5rDZgRV1L3eSwdtht4Mx1XAMDdKJPjrKmNoe79yN3nQIRyIza6y0GeNGuV6s3G9iZPvHyz2i8M65Gl+xMf7Mt/fBu9Ixpc5C6RSdptCyyqRBbMvKV0XvZpE/eaJazId6Bs/hlSIXumyVptOcsh2E6JGdCKXP8MmLkAi4veNVi9fs/+JPvI8bZd4ce3QE5u3IkXIM00Y8/v2JPN2Rn6qDwVfIHeqNCzDjJ7oOuFbob3Zj28/jfSN388o89ofaXUjFoVJ6XU+9DwIdXqv+Ne5fejXNcn9n5GVwSP6M=" label="Checkpoint 1: script setup" />

---
layout: default
---

## Checkpoint 2 · componentes

<Playground url="https://play.vuejs.org/#eNqFVE2P0zAQ/SsjC9RUtEmrFSClSYFFPcBhWbGIC+bgJtPUi2Nb9qQfRP3vyMn2A7Hs3qx5b+a9sZ/csg/WxpsGWcoyXzhpCTxSY0EJXeWckedszrWsrXEELThcjaAwtW0ISzjAypkaBpsGByfSjSFclJKMe0DjJDQYjZp8ckbjvovrwmhPoA0h5EEgGgyGx+rWuPKjaTRBfpKNoiHkc66h64k3QjUYk5N1NIR3/9Zib5WkKOHcv0qGsUJd0RpSmHA95DpL+rXnwUlGWFslCLvpWS2k7k4A2Xo6v1amgBKDgvBZsp4esYuNN+PalKhyzoIPziA5kuy8bS/WORzACiWWTkR+mCW2V0weJLPkwgnXmae9CselKffQwspoGq9ELdU+Bb/3hPW4kSPwQvuxRydXM6iFq6ROYTIDK8pS6iqFqcN6Bgeugwy0UIvdeCtLWqdw9abDTl0gGjIdl3BHwqGAFh6408nk5QyWZjf28nc3eGlciW68NLsLtfjt625mcJuC1Gt0krqRWdIvxEbsv9F4JpElrqTGW2esj1roLv17ePQU7shJXcHhlCGsZYhP37GoJfnox6CxpSBMz42Dn8+k4XgP/XumXcRyzs4TOOshZ7Y+52w6ORasEgWujSrR5ZwtgsQSodGii1Icx0fie6ltQzlnwXL0iMcRvMANaopJuAqpz/mwb0/+zg0bMfKF0StZxffeaJayNtB4d+VSoftiSRrtOUuh7fU5E0qZ7eeuRq7B0bFerLH49Uj93u9CjbNbhx7dBjk7Yb3HHl7c3eCOLsDalI3CJ8Gv6I1qgseedt3oUqG74HVuP3XfjtTVN7/YEWp/XCoYDczDqN970+DHJ1Y/272Kr7o+rg/s8AePJL0m" label="Checkpoint 2: componentes" />

---
layout: default
---

## Checkpoint 3 · slots

<Playground url="https://play.vuejs.org/#eNqVVcFu4zYQ/ZUB28I2akv2Bm0BRXLaDXxoD+miW/RS9kBLY4tbihTIkeNU8L8XJC3ZabJZ1Cd5Zt7Mm0c+qWc/tW1y6JBlLHellS2BQ+paUELvC87IcbbmWjatsQQ9WNzNoTRN2xFWcIKdNQ1MDh1OxqIHQ7ipJBl7ziapBxiNmlx6ySYvUPfCVp/D+NwZwXVptCPQhhAKT2k6mcyG6KOx1b3pNEExEp1OZ1CsuYaASQ5CdZiQlc10BncvY4lrlaRpyrn7Np0lCvWeashgyfWM6zyNQq09k5ywaZUgDN3zRkgdngDyerV+r0wJFfoJwuVpvRpy47ZZ6akWnI20g94QfmNz+KpGUaEdM779u/WDIQGipE6oPK3fXXDpFasxeHUuh0VjKlQFZ353ziC9LrxM3RlDaAvOegg84XTFDiBv1/2YOUErlNhaMXWzPG1fJxMDw/ZRs/Qs2n9Y546elH/cmuoJetgZTYudaKR6ysA9OcJm0ck5OKHdwqGVu1tohN1LncHyFlpRVVLvM1hZbG7hxLUfAz004rh4lBXVGdx8H3IjCkRHJtQSHklYFNDDuXa1XH5zC1tzXDj5T2i8NbZCu9ia49W05IfvQk/PNgOpa7SSQss8jQuxOfusHb7gwgp3UuMHa1o37SEc4R/+2mbwkazUeziNLsBGegNExKaR5KZ/Trq2EoTZBTj56wv3edAhnlwWTFJwdunAWUxZ8+gKzlbLIdAqUWJtVBXuz8aP2CJ0WgQzJEkyFP4oddt5B3jK01c4zuFrPKCmhITdI0WnziI8fX5vXmo7vDb+l7LhRmfw0DVbtEHUtzRyWJI0GkolnNegFLYabZKfjZs7ZQi0aLx8MRZsl6fPnB3L0uFf9N9zcIxxdnl1RAPe3cHy3PIMi+4603shFLnS6J3cJ5+c0SxjvS/nQT+p0P7aepTjLIM+suFMKGUefwkxsh3Oh3hZY/n3K/FP7uhjnH2w6NAekLMxFw8zpjcfH/BIV8nGVJ3CN5O/oTOq8xxj2ftOV8rrMn/G9ufwdZF6/7vbHAm1G5byRH3laR73PnR4/8bqF7o3yU3AcX1ip38BeYRujw==" label="Checkpoint 3: slots" />

---
layout: default
---

## Checkpoint 4 · composables

<Playground url="https://play.vuejs.org/#eNqVVW2P4zQQ/isjA2or2qR7K0DKJt3jTisdCC0nDsEHzAc3mbbec+zInnRbqv53ZLtJX/blIJ+SmXlmnnnsmezYj02TrFtkGctdaWVD4JDaBpTQy4IzcpzNuJZ1YyzBvSG8qyQZCwtrahgkaWnqxmjU5NKj12ccnKHeC1u9hPG+c8QOWofe5WB/jnJirtClnfsC8qex1XvTanoZ1ocMuOa6NNp5rDaEYygVCgt7KPryw8EHs4UVgmgs6kpWJkmSwagDPvb1irPyQ59vxHWeRk1nvlZOWDdKEM64BshrIXV4A8hXV7N3ypRQoWciXJ6urjpfr15W+tQFZ33VcDQQnj45fLVCUaHtPT79m9m9IQGipFaoPF29OfXOWyKjgbYNFpzFL87gbalk+bngLKjC2ewXWTdS2DyNIcfS6UljvfHkqqwntalQFZx5WTiD9DTwSHxhDKEtONtBGQ/xpEGAvJntes8eGqHE3IqhG+Vp8zyZaOgEjLKnB90vWOeOtsq/zk21hR0sjKbJQtRSbTNwW0dYT1o5Bie0mzi0cnEDtbBLqTOY3kAjqkrqZQZXFusb2HPty8AOarGZPMqKVhlcfx98PQpESybEEm5IWBSwg0Ps1XT6zQ3MzWbi5D8h8dzYCu1kbjYn1ZIfvgs5PdsMpF6hlRRS5mlsiI3ZixP6hZmvcCE1frSmccMdhCP8Q6gWM/hEVuol7Ps5wFr6EYiIu1qSG/41aJtKEGZH4ODvL4xEp0M8uWztQQVnxwycRZc1j67g7GraGRolSlwZVYX7c+dLzBFaLcI8JUnSBb6Vumn9EHnKw2c4juFrXKOmhIRdIiWBxCjC0/N781TbbpP9L2XDjc7gvq3naIOor2nksCRpNJRKOK9BKWzVj0l+mP3cKUOgRe3li7Ywdnl6thxiWNp9xfk7B0cbZ8ftEwfw9hamh5QHWJyuA73nhbpY3smDYxnr97fFRb+249+Aa9wE56LVset+L0stSQoFBQwGI9j54vEq+hUDhU/WxYzisulzhH02PIAgAOIph2TeuI8Ii9Raffl34Hr/tJ9+81/05MNawuq/NHbx94j8Dhy6PMPhCIrZJfGErKyHI7h9aktcoyQNU87dt+koUaiXtIIMpj7HKPZCrjR6IZfJgzOaZSwU5qFFqdD+2niGjrOsk4wzoZR5/DnYyLY47uzlCsvPz9gf3MbbOPto0aFdI2e9Lw5adN99uscNnThrU7UKX3X+hs6o1nOMYe9aXSl/Z8dnbH8KZyL18nd3tyHUrmvKEw2nPo59r1t8/0rrR7rXyfXhtuzZ/l+n6ibr" label="Checkpoint 4: composables" />

---
layout: two-cols
---

# Reto final

<v-clicks>

- Añade un botón para **copiar** la nota al portapapeles.
- Muestra también el número de caracteres.
- Extrae el contador a `useWordCount`.
- Compón `useNotes` + `useWordCount` en un `useNoteEditor`.

</v-clicks>

::right::

# Recap

<v-clicks>

- `<script setup>` → estado y lógica juntos.
- `props` / `emits` → componentes.
- `slots` → composición visual.
- `composables` → composición de lógica.

</v-clicks>

---
layout: hero-image
image: /teclado.gif
class: text-center
---

# ¡A los teclados!

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
- Composables
- Ejercicio práctico


---
layout: hero-image
image: /composition-docs.png
---

## Composition API



---
layout: quote
---

# Docs

<img src="/toggle.png" class="max-h-[20rem]" />

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
layout: quote
---

# Composables

- Extraen lógica reactiva reutilizable.
- Se componen entre sí: `useNotes` + `useWordCount`.
- En código nuevo: `<script setup>` + composables.

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

# <logos-vue /> ¡Vamos a seguir! 🚀

---
layout: default
---

# Qué vamos a construir II

<v-clicks>

- Un **clon de Google Keep** con Vue Router
- Usaremos la API del navegador ["View Transition"](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- Usaremos tooling moderno en un caso de aplicación real.

</v-clicks>


---
layout: two-cols-header
---

# ¿Qué necesitamos?

### Stack 2026

::left::
<v-clicks>

- **Editor**: <logos-visual-studio-code /> VS Code (Cursor/Windsurf opcionales).
- **Extensión**: <logos-vue /> Vue - Official (antes Volar).
- **Toolchain**: Vite+ (`vp`) con Vite, Vitest, Oxlint, Oxfmt...
- **Paquetes**: <logos-pnpm /> pnpm (o el gestor que configure Vite+).
- **DevTools**: <logos-vue /> Vue DevTools.

</v-clicks>

::right::

<div class="relative">
  <div class="absolute translate-y-[-50%] max-h-[28rem] overflow-hidden" v-click=[1,2]>
    <img src="/vscode.png" class="mb-5" alt="VS Code" />
    <a href="https://code.visualstudio.com/docs/nodejs/vuejs-tutorial"><em>Using Vue in Visual Studio Code</em></a>
  </div>

  <div class="absolute translate-y-[-50%] max-h-[28rem] overflow-hidden" v-click=[2,3]>
    <img src="/vue-extension.png" alt="Extensión Vue - Official" />
    <a href="https://marketplace.visualstudio.com/items?itemName=Vue.volar">Vue - Official (antes Volar)</a>
  </div>

  <div class="absolute translate-y-[-50%] max-h-[28rem] overflow-hidden" v-click=[3,4]>
    <div class="text-6xl font-mono font-bold text-emerald-500">vp</div>
    <p class="mt-4"><strong>Vite+</strong> · toolchain unificada</p>
    <a href="https://viteplus.dev"><code>viteplus.dev</code></a>
  </div>

  <div class="absolute translate-y-[-50%] max-h-[28rem] overflow-hidden" v-click=[4,5]>
    <img src="/pnpm-logo.png" alt="pnpm" />
    <a href="https://pnpm.io/"><code>pnpm</code></a>
  </div>

  <div class="absolute translate-y-[-50%] max-h-[28rem] overflow-hidden" v-click="5">
    <img src="/devtools.png" alt="Vue DevTools" />
    <a href="https://devtools.vuejs.org/">Vue Devtools</a>
  </div>
</div>

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
src: pages/nuxt.md
---


---
layout: end
---

<style>
.github-icon path {
  fill: rgb(255 255 255 / 1) !important;
}
</style>

# 💚 🖖🏽 ¡Muchas Gracias! 🖖🏽 💚

<div class="grid grid-cols-2 items-center gap-4 border bg-white mt-5">
  <div class="text-center p-16">
    <img src="/lemoncode.png" />
  </div>
  <div class="text-center p-16">
    <img src="/basefactor.jpeg" />
  </div>
</div>

<div class="flex justify-between mt-10">
  <a href="https://x.com/lemoncoders"><logos-x fill="currentColor" /> @lemoncoders</a>
  <a href="https://github.com/lemoncode"><logos-github-icon class="github-icon" /> https://github.com/lemoncode</a>
  <a href="https://x.com/basefactorteam"><logos-x fill="currentColor" /> @basefactorteam</a>
</div>
