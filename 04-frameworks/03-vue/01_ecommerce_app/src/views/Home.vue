<template>
  <div class="home"></div>
  <ProductList />
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
