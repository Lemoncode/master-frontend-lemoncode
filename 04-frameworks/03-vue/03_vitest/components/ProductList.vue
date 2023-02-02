<template>
  <section class="wrapper">
    <div class="flex align-items-center justify-content-between">
      <h1>Products</h1>
      total: {{ totalProducts }}
    </div>
    <ul class="product-list">
      <li v-for="product in list" :key="product.id">
        <NuxtLink :to="`/product/${product.id}`">
          <article
            class="grid product-container card"
            :class="{
              'product-container--has-discount':
                product.discountPercentage > 15,
            }"
          >
            <div class="image">
              <img :src="product.images[0]" alt="" loading="lazy" />
            </div>
            <div class="product-container__content">
              <h2>
                {{ product.title }}
              </h2>
              <p>
                <span class="grey-text">Description: </span>
                <strong>{{ product.description }}</strong>
              </p>
              <p>
                <span class="grey-text">Brand: </span>
                {{ product.brand }}
              </p>
              <p>
                <span class="grey-text">Category: </span>{{ product.category }}
              </p>
            </div>
            <div class="flex product-container__aside">
              <div class="text-align-end aside__price">
                <StaticPrice :quantity="product.price" />
              </div>
              <AddToCartButton :product="product" @addItem="onAddItem" />
            </div>
          </article>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { Product } from '~~/types'
import useProductsApi from '@/composables/useProductsApi'

const { list, totalProducts } = await useProductsApi()

const onAddItem = (product: Product) => {
  console.log('onAddItem', product)
}
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

.product-container--has-discount {
  background-color: rgba(yellow, 0.5);
}
</style>
