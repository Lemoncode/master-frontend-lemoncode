<template>
  <section class="wrapper">
    <div class="flex align-items-center justify-content-between">
      <h1>Products</h1>
      total: {{ totalProducts }}
    </div>

    <ul class="product-list">
      <li v-for="product in list" :key="product.id">
        <div>
          <article
            class="flex justify-content-between product-container"
            :class="{
              'product-container--has-discount': product.discount !== '0.0',
            }"
          >
            <div class="product-container__content">
              <h2>
                {{ product.title }}
              </h2>
              <p>
                <span class="grey-text">Author:</span>
                <strong>{{ product.author }}</strong>
              </p>
              <p>
                <span class="grey-text">Publisher:</span>
                {{ product.publisher }}
              </p>
              <p>
                <span class="grey-text">Year:</span> {{ product.published }}
              </p>
            </div>
            <div class="flex product-container__aside">
              <p class="text-align-center">
                <StaticPrice :quantity="product.price" />
              </p>
              <AddToCartButton :product="product" @addItem="onAddItem" />
            </div>
          </article>
        </div>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { productService } from '@/services/productService'

import AddToCartButton from '@/components/AddToCartButton.vue'
import StaticPrice from '@/components/StaticPrice.vue'

export default defineComponent({
  components: { AddToCartButton, StaticPrice },
  data() {
    return {
      list: [] as Product[],
    }
  },
  async created() {
    this.list = await productService.get()
  },
  computed: {
    totalProducts(): number {
      return this.list.length
    },
  },
  methods: {
    onAddItem(product: Product): void {
      console.log(product)
    },
  },
})
</script>

<style lang="scss" scoped>
.wrapper {
  @media (min-width: 900px) {
    max-width: 1000px;
  }
}
.product-list {
  list-style: none;
  padding: 0;
  li {
    margin-bottom: 2em;
  }
  h2 {
    text-transform: capitalize;
  }
}
.product-container {
  border-radius: 5px;
  align-items: flex-start;
  box-shadow: 0 0 10px 6px rgba(0, 0, 0, 0.1);
  padding: 1em;
}
.product-container__content {
  margin-left: 10px;
}
.product-container__aside {
  flex-direction: column;
  justify-content: space-around;
  align-self: stretch;
}
.product-container--has-discount {
  background-color: pink;
}

.button {
  align-self: stretch;
}
</style>
