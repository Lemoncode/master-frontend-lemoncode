<template>
  <ul class="product-list">
    <li v-for="product in list" :key="product.id">
      <article class="grid product-container card">
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
          <p><span class="grey-text">Category: </span>{{ product.category }}</p>
        </div>
        <div class="flex product-container__aside">
          <div class="text-align-end aside__price">
            {{ product.price }}
          </div>
        </div>
      </article>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { productService } from '@/services/products'

const list = await productService.get()
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
</style>
