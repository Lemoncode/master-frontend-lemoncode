<template> Cart {{ totalItemsInCart }} </template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  computed: {
    totalItemsInCart() {
      return this.$store.getters['CartModule/totalItemsInCart']
    },
  },
})
</script>
