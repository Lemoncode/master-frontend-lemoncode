<template>
  <section>
    <div class="flex align-items-center justify-content-between">
      <h1>Products</h1>
      total: {{ totalFilteredProductsByCategory }}
    </div>

    <div>
      <input type="text" v-model="filteredTitle" />
      <ul>
        <li v-for="(category, index) of categories" :key="index">
          <CategoryFilter
            :category="category"
            @selectedCategory="selectCategory"
          />
        </li>
      </ul>
    </div>

    <ul class="product-list">
      <li v-for="product in filteredProductsByCategory" :key="product.id">
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
              <AddToCartButton :product="product" @addItem="onAddItem">
                <span>Add to Cart</span>
              </AddToCartButton>
            </div>
          </article>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, Ref, ref } from 'vue'
import { mapActions } from 'vuex'

import StaticPrice from '@/components/StaticPrice.vue'
import AddToCartButton from '@/components/AddToCartButton.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'

import useProductsApi from '@/composables/productsApi'

import { CartActionEnums } from '@/store/Cart'

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
    CategoryFilter,
  },
  methods: {
    ...mapActions('CartModule', {
      addItem: CartActionEnums.ADD_ITEM_TO_CART,
    }),
    onAddItem(product: Product) {
      this.addItem(product)
    },
  },
  async setup(context) {
    // Get the products from the API
    const { list } = await useProductsApi()

    // Filtered products by title
    const filteredTitle: Ref<string> = ref('')

    const filteredProducts: ComputedRef<Product[]> = computed(() => {
      return list.value.filter((product: Product) => {
        return product.title
          .toLowerCase()
          .includes(filteredTitle.value.toLowerCase())
      })
    })

    // Categories List
    const categories = list.value.reduce(
      (accumulated: string[], current: Product) => {
        if (!accumulated.includes(current.category)) {
          accumulated.push(current.category)
        }
        return accumulated
      },
      []
    )

    const selectedCategories: Ref<string[]> = ref([])

    const selectCategory = (category: string) => {
      if (selectedCategories.value.includes(category)) {
        selectedCategories.value.splice(
          selectedCategories.value.indexOf(category),
          1
        )
      } else {
        selectedCategories.value.push(category)
      }
      console.log(selectedCategories.value)
    }

    const filteredProductsByCategory = computed(() => {
      return filteredProducts.value.filter((product: Product) => {
        return selectedCategories.value.includes(product.category)
      })
    })

    const totalFilteredProductsByCategory = computed(() => {
      return filteredProductsByCategory.value.length
    })

    return {
      filteredProductsByCategory,
      totalFilteredProductsByCategory,
      filteredTitle,
      categories,
      selectCategory,
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
