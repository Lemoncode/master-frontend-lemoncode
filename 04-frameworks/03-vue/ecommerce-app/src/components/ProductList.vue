<template>
  <section class="wrapper">
    <div class="flex align-items-center justify-content-between">
      <h1>Products</h1>
      total: {{ totalProducts }}
    </div>

    <form>
      <label for="filter"></label>
      <input id="filter" v-model="cartStore.filterValue" />
    </form>

    <ul class="product-list">
      <li v-for="product in filteredProducts" :key="product.id">
        <!-- <a ></a> -->
        <router-link :to="`/detail/${product.id}`">
          <article
            :class="{
              'product-container--has-discount': product.discount !== '0.0',
            }"
            class="grid product-container card"
          >
            <div class="image">
              <img :src="`https://picsum.photos/id/${product.id}/200`" alt="" />
            </div>
            <div class="product-container__content">
              <h2>
                {{ product.title }}
              </h2>
              <p>
                <span class="grey-text">Author: </span>
                <strong>{{ product.author }}</strong>
              </p>
              <p>
                <span class="grey-text">Publisher: </span>
                {{ product.publisher }}
              </p>
              <p>
                <span class="grey-text">Year: </span>{{ product.published }}
              </p>
            </div>
            <div class="flex product-container__aside flex column">
              <div class="text-align-end aside__price">
                <StaticPrice :quantity="product.price" />
              </div>
              <AddToCartButton
                class="button adsf"
                @addItem="onAddItem(product)"
              >
                <span>Add to cart</span>
              </AddToCartButton>
            </div>
          </article>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'

import StaticPrice from './StaticPrice.vue'
import AddToCartButton from './AddToCartButton.vue'

import useProductsApi from '@/composables/productsApi'
import { useCartStore } from '@/stores/cart'

const { products } = await useProductsApi()

const cartStore = useCartStore()
const onAddItem = (product: Product) => {
  cartStore.addItemToCart(product)
  console.log(cartStore.items)
}

const filteredProducts = computed(() => {
  const filter = cartStore.filterValue?.toLowerCase()
  return products.value.filter((product) => {
    return product.title.toLowerCase().includes(filter)
  })
})

const totalProducts = computed(() => {
  return filteredProducts.value.length
})
</script>

<style lang="scss">
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
</style>
