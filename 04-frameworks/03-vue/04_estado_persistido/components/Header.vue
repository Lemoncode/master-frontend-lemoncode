<template>
  <nav
    class="nav nav flex align-items-center justify-content-between container"
  >
    <div>Logo</div>
    <div>Cart {{ totalItems }}</div>
  </nav>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const cart = await useCartStore()
const { totalItems } = storeToRefs(cart)
</script>

<style lang="scss" scoped>
.nav {
  min-height: 80px;
  background-color: rgb(198, 247, 244);
  position: sticky;
  top: 0;
}
</style>
