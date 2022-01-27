<template>
  <section>
    <div class="flex align-items-center justify-content-between">
      <h1>Products</h1>
      total: {{ totalProducts }}
    </div>
    <ul class="product-list">
      <li v-for="product in list" :key="product.id">
        <router-link :to="`/detail/${product.id}`">
          <article
            class="grid product-container card"
            :class="{
              'product-container--has-discount': product.discount !== '0.0',
            }"
          >
            <div class="image">
              <img :src="`https://picsum.photos/id/${product.id}/200`" alt="" />
            </div>
            <div class="product-container__content">
              <h2>
                {{ product.title }}
                <span v-if="product.discount !== '0.0'"> DESCUENTO </span>
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
            <div class="flex product-container__aside">
              <div class="text-align-end aside__price">
                <StaticPrice :quantity="product.price" />
              </div>
              <AddToCartButton :product="product" @addItem="onAddItem" />
            </div>
          </article>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import StaticPrice from '@/components/StaticPrice.vue'
import AddToCartButton from '@/components/AddToCartButton.vue'

import useProductsApi from '@/composables/productsApi'

import { Product } from '@/types'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    list: Product[]
  }
}

export default defineComponent({
  components: {
    StaticPrice,
    AddToCartButton,
  },
  async setup() {
    const { list, totalProducts } = await useProductsApi()

    const onAddItem = (product: Product) => {
      console.log(product.title)
    }

    return {
      list,
      totalProducts,
      onAddItem,
    }
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
.product-container--has-discount {
  background-color: rgba(yellow, 0.5);
}
</style>
