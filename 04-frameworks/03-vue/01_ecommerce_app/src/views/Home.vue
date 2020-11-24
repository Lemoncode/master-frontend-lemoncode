<template>
  <div class="home container">
    <h1>Products</h1>
    <ProductList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProductList from '@/components/ProductList.vue'

export default defineComponent({
  name: 'Home',
  components: {
    ProductList,
  },
})
</script>
