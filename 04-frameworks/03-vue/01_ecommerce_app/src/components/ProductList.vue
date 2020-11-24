<template>
  <ul class="product-list">
    <li v-for="product in list" :key="product.id">
      <div>
        <article class="flex product-container">
          <div class="product-container__content">
            <h2>
              {{ product.title }}
            </h2>
            <p>
              <span class="grey-text">Author:</span>
              <strong>{{ product.author }}</strong>
            </p>
            <p>
              <span class="grey-text">Publisher:</span> {{ product.publisher }}
            </p>
            <p><span class="grey-text">Year:</span> {{ product.published }}</p>
          </div>
          <div class="flex product-container__aside">
            <p class="text-align-center">{{ product.price }}</p>
            <button class="button" type="button" @click="addItem(product)">
              Add to Cart
            </button>
          </div>
        </article>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { productService } from '@/services/productService'

export default defineComponent({
  data() {
    return {
      list: [] as Product[],
    }
  },
  async created() {
    this.list = await productService.get()
  },
  methods: {
    addItem(product: Product) {
      console.log({ product })
    },
  },
})
</script>

<style lang="scss" scoped>
.product-list {
  list-style: none;
  padding: 0;
  li {
    border-radius: 5px;
    box-shadow: 0 0 10px 6px rgba(0, 0, 0, 0.1);
    padding: 1em;
    margin-bottom: 2em;
  }
  @media (min-width: 900px) {
    max-width: 1000px;
  }
  h2 {
    text-transform: capitalize;
  }
}
.product-container {
  justify-content: space-between;
  align-items: flex-start;
}
.product-container__content {
  margin-left: 10px;
}
.product-container__aside {
  flex-direction: column;
  justify-content: space-around;
  align-self: stretch;
}

.button {
  align-self: stretch;
}
</style>
