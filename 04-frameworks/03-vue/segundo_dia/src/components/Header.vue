<template>
  <nav
    class="nav nav flex align-items-center justify-content-between container"
  >
    <div>Logo</div>
    <div>Cart</div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({})
</script>

<style lang="scss" scoped>
.nav {
  min-height: 80px;
  background-color: rgb(198, 247, 244);
  position: sticky;
  top: 0;
}
</style>
