<template>
  <nav class="flex justify-content-between">
    <div>Logo</div>
    <CartBadge />
  </nav>
</template>

<script lang="ts">
import CartBadge from '@/components/CartBadge.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    CartBadge,
  },
})
</script>
