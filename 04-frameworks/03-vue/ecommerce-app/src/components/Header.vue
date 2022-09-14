<template>
  <nav class="nav flex align-items-center justify-content-between container">
    <div>Logo</div>
    <div>Cart – {{ cartStore.totalItems }}</div>
  </nav>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
</script>

<style scoped lang="scss">
.nav {
  min-height: 80px;
  background-color: rgb(198, 247, 244);
  position: sticky;
  top: 0;
  color: black;
}
</style>
