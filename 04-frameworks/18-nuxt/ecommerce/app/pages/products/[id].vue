<template>
  <div>
    <h1>Product {{ id }}</h1>
    <button>Add to Cart</button>
  </div>
</template>

<script setup lang="ts">
const { id } = useRoute().params;

const { addToCart } = useCart();

useSeoMeta({
  title: `Product ${id}`,
  description: `Product ${id} description`,
});
</script>
