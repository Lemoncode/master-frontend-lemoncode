<template>
  <div class="home container grid">
    <ProductList />
    <Cart />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProductList from '@/components/ProductList.vue'
import Cart from '@/components/Cart.vue'

export default defineComponent({
  name: 'Home',
  components: {
    ProductList,
    Cart,
  },
})
</script>

<style lang="scss" scoped>
.home {
  grid-template-columns: 60% 1fr;
  gap: 3rem;
}
</style>
