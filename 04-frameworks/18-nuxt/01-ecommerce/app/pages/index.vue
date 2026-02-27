<template>
  <div>
    <h1>Home</h1>

    <div class="grid">
      <article v-for="p in products" :key="p.id" class="card">
        <div class="row">
          <h2 class="title">
            <NuxtLink class="link" :to="`/products/${p.id}`">{{
              p.name
            }}</NuxtLink>
          </h2>
          <span class="price">{{ p.price }} €</span>
        </div>
        <p class="desc">{{ p.description }}</p>
        <div class="row end">
          <button type="button" class="btn" @click="addToCart(p)">
            Añadir al carrito
          </button>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

useSeoMeta({
  title: `${config.public.siteName} · Products`,
  description:
    'A tiny Nuxt 4 e-commerce demo: SSR data fetching, Nitro API, state, and middleware.',
});
const { data: products } = await useFetch('/api/products');

const { addToCart } = useCart();
</script>

<style scoped>
.hint {
  color: #6b7280;
  margin: 6px 0 20px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: start;
}
.title {
  font-size: 18px;
}
.link {
  color: #6a6120;
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
}
.desc {
  margin: 0.8rem 0;
  color: #4b5563;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.row.end {
  margin-top: auto;
  justify-content: flex-end;
}
.price {
  font-weight: 700;
}
.error {
  background: #fff7ed;
  border: 1px solid #fed7aa;
  padding: 12px;
  border-radius: 12px;
}
@media (max-width: 720px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
