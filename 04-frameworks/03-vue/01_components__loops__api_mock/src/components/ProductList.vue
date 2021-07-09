<template>
  <ul class="product-list">
    <li v-for="product in list" :key="product.id">
      <article class="grid product-container card">
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
          <p><span class="grey-text">Year: </span>{{ product.published }}</p>
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

<script lang="ts">
import { productService } from '@/services/products'
import { defineComponent } from 'vue'
import { Product } from '@/types'
export default defineComponent({
  data() {
    return {
      list: [] as Product[],
    }
  },
  async created() {
    this.list = await productService.get()
  },
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
</style>
