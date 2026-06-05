<script setup lang="ts">
import { products } from '~/data/products';

const config = useRuntimeConfig();

useSeoMeta({
  title: `Productos · ${config.public.siteName}`,
  description: 'Listado de productos',
});
</script>

<template>
  <section class="wrap">
    <h1>Productos</h1>
    <ul class="list">
      <li v-for="p in products" :key="p.id" class="item">
        <NuxtLink :to="`/products/${p.id}`">{{ p.name }}</NuxtLink>
        <span class="price">{{ p.price }} €</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.wrap {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  width: 100%;
}
.list {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
}
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e5e7eb;
}
.item:last-child {
  border-bottom: none;
}
.price {
  font-weight: 700;
}
</style>
