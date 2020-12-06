<template>
  <nav class="nav flex align-items-center justify-content-between container">
    <span>logo</span>
    <!-- <ul>
      <li><router-link to="/">Home</router-link></li>
    </ul> -->
    <span>cart</span>
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
ul {
  margin: 0;
  list-style: none;
}
</style>
