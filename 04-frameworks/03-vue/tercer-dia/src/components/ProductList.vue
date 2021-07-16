<template>
  <section class="wrapper">
    <div class="flex align-items-center justify-content-between">
      <h1>Products</h1>
      total: {{ totalFilteredProducts }}
    </div>

    <div class="categories-filter">
      <input type="text" v-model="categoriesFilter" />
      <ul>
        <li v-for="(category, index) of categoriesFiltered" :key="index">
          <CategoryFilter
            :category="category"
            @selectedCategory="selectCategory"
          />
        </li>
      </ul>
    </div>

    <ul>
      <li v-for="product in filteredList" :key="product.id">
        <router-link :to="`/detail/${product.id}`">
          <article
            class="grid product-container card"
            :class="{
              'product-container--has-discount': product.discount !== '0.0',
            }"
          >
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
            <div>
              <StaticPrice :quantity="product.price" />
              <AddToCartButton
                :product="product"
                @addItem="($event) => onAddItem($event)"
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

<script lang="ts">
import { defineComponent, ref, Ref, computed } from 'vue'
import { mapActions } from 'vuex'

import { Product } from '@/types'

import { useProductApi } from '@/composables/productsApi'

import StaticPrice from '@/components/StaticPrice.vue'
import AddToCartButton from '@/components/AddToCartButton.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'

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
  async setup() {
    const { list } = await useProductApi()

    const categories = list.value.reduce(
      (accumulated: string[], current: Product) => {
        if (!accumulated.some((category) => category === current.category)) {
          accumulated.push(current.category)
        }
        return accumulated
      },
      []
    )

    const selectedCategories: Ref<string[]> = ref([])

    const selectCategory = (category: string) => {
      if (selectedCategories.value.indexOf(category) === -1) {
        selectedCategories.value.push(category)
      } else {
        selectedCategories.value.splice(
          selectedCategories.value.indexOf(category),
          1
        )
      }
      console.log(selectedCategories.value)
    }

    const filteredList = computed<Product[]>(() => {
      return list.value.filter((product) => {
        return selectedCategories.value.some((category) => {
          return category === product.category
        })
      })
    })

    const totalFilteredProducts = computed(() => filteredList.value.length)

    const categoriesFilter: Ref<string> = ref('')

    const categoriesFiltered = computed(() => {
      return categories.filter((category) => {
        return String(category.toLowerCase()).match(
          categoriesFilter.value.toLowerCase()
        )
      })
    })

    return {
      categoriesFilter,
      selectCategory,
      selectedCategories,
      filteredList,
      categoriesFiltered,
      // totalProducts,
      totalFilteredProducts,
    }
  },
  methods: {
    ...mapActions('CartModule', ['addItemToCart']),
    onAddItem(product: Product) {
      // this.$store.dispatch('CartModule/addItemToCart', product)
      this.addItemToCart(product)
    },
  },
})
</script>

<style>
.product-container--has-discount {
  background-color: rgba(255, 230, 0, 0.5);
}
</style>
