<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();
const { addToCart } = useCart();

const id = Number(route.params.id);

// useFetch llama al endpoint Nitro. Si responde 400/404,
// el error se propaga y Nuxt muestra la página de error.
const { data: product } = await useFetch(`/api/products/${id}`);

useSeoMeta({
  title: `${product.value?.name ?? 'Producto'} · ${config.public.siteName}`,
  description: product.value?.description ?? 'Detalles del producto',
});
</script>

<template>
  <section v-if="product" class="wrap">
    <NuxtLink class="back" to="/">← Volver</NuxtLink>

    <h1>{{ product.name }}</h1>
    <p class="desc">{{ product.description }}</p>

    <div class="row">
      <span class="price">{{ product.price }} €</span>
      <button type="button" class="btn" @click="addToCart(product)">
        Añadir al carrito
      </button>
    </div>
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
.back {
  display: inline-block;
  margin-bottom: 12px;
  color: #6a6120;
  text-decoration: none;
}
.back:hover {
  text-decoration: underline;
}
.desc {
  color: #4b5563;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
}
.price {
  font-weight: 700;
}
</style>
