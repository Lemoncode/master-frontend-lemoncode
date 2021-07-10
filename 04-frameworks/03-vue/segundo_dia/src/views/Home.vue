<template>
  <div class="home">
    <div v-if="error">Sorry, some error... {{ error }}</div>
    <Suspense>
      <template #default>
        <ProductList />
      </template>
      <template v-if="!error" #fallback> loading... </template>
    </Suspense>
  </div>
</template>

<script lang="ts">
import { defineComponent, onErrorCaptured, ref, Ref } from 'vue'

import ProductList from '@/components/ProductList.vue'

export default defineComponent({
  name: 'Home',
  components: {
    ProductList,
  },
  setup() {
    const error: Ref<unknown> = ref()
    onErrorCaptured((errorCaptured) => {
      error.value = errorCaptured
    })
    return {
      error,
    }
  },
})
</script>
