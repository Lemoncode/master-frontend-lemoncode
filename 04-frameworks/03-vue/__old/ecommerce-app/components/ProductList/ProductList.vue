<template>
  <section class="wrapper">
    <div class="flex align-items-center justify-content-between">
      <h1>Products</h1>
      total: {{ totalProducts }}
    </div>

    <hr />
    <input type="text" v-model="textFilter" />
    <hr />
    <ul class="product-list">
      <li v-for="product in filteredList" :key="product.id">
        <NuxtLink :to="`/product/${product.id}`">
          <ProductListItem :product="product" />
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { Product } from 'types'

// List of products
const props = defineProps<{
  products?: Product[]
}>()

// Cart
const { addToCart } = useCartStore()

const onAddItem = (product: Product) => {
  addToCart(product)
}

// Filter
const textFilter = ref('')

const filteredList = computed(() => {
  if (!props.products) return []

  return props.products.filter((product: Product) => {
    return product.title.toLowerCase().includes(textFilter.value.toLowerCase())
  })
})

const totalProducts = computed(() => {
  return filteredList.value.length
})
</script>

<style lang="scss" scoped>
.product-list {
  padding: 0;
  li {
    margin-bottom: 2em;
  }
}
.product-container {
  align-items: flex-start;
  grid-template-columns: 210px 1fr 100px;
}

.product-container--has-discount {
  background-color: rgba(yellow, 0.5);
}

.product-container__content {
  padding: 0 1em;
}

.product-container__aside {
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.image {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  img {
    width: 100%;
    aspect-ratio: 1/1;
    object-fit: cover;
  }
}
</style>
