<template>
  <div class="home">
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
