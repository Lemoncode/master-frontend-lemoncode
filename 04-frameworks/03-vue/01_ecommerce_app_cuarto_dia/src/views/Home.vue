<template>
  <div class="home">
    <div v-if="error">Error :(</div>
    <Suspense v-else>
      <template #default>
        <ProductList />
      </template>
      <template #fallback>loading...</template>
    </Suspense>
  </div>
</template>

<script lang="ts">
import { defineComponent, onErrorCaptured, Ref, ref } from 'vue'
import ProductList from '@/components/ProductList.vue'

export default defineComponent({
  name: 'Home',
  components: {
    ProductList,
  },
  setup() {
    const error: Ref<unknown> = ref()
    onErrorCaptured(errorCaptured => {
      error.value = errorCaptured
    })

    return {
      error,
    }
  },
})
</script>
