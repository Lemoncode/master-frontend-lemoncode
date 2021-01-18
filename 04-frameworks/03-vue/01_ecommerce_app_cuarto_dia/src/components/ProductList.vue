<template>
  <section class="wrapper">
    <div class="flex align-items-center justify-content-between">
      <h1>Products</h1>
      total: {{ totalProducts }}
    </div>

    Cart: {{ totalItemsInCart }}

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
              <AddToCartButton :product="product" />
            </div>
          </article>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

import useProductsApi from '@/use/productsApi'

import StaticPrice from '@/components/StaticPrice.vue'
import AddToCartButton from '@/components/AddToCartButton.vue'
import { CartItem } from '@/store/Cart'

export default defineComponent({
  name: 'ProductList',
  components: {
    StaticPrice,
    AddToCartButton,
  },
  computed: {
    ...mapGetters('CartModule', ['items']),
    totalItemsInCart() {
      const cartItems: CartItem[] = Object.values(this.items || {})
      return cartItems.reduce((acc: number, item: CartItem) => {
        return item.quantity + acc
      }, 0)
    },
  },
  async setup() {
    const { list, totalProducts } = await useProductsApi()

    return {
      list,
      totalProducts,
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
.product-container__aside {
  flex-direction: column;
  justify-content: space-between;
  align-self: stretch;
}
.aside__price {
  margin-top: 2rem;
  padding: 0.7em 0;
}
.product-container--has-discount {
  background-color: rgba(yellow, 0.5);
}
</style>
