<template>
  <ul class="cart full-width card" v-if="totalItemsInCart">
    <li v-for="(cartItem, key) in items" :key="key" class="cart__item">
      <div class="flex justify-comtent-between align-items-center">
        <span>
          <span>{{ cartItem.quantity }}</span
          ><span>{{ cartItem.data.title }}</span>
        </span>
        <button class="button" @click="removeItemFromCart(cartItem.data.id)">
          X
        </button>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default defineComponent({
  computed: {
    ...mapGetters('CartModule', {
      items: 'items',
      totalItemsInCart: 'totalItemsInCart',
    }),
  },
  methods: {
    ...mapActions('CartModule', {
      removeItemFromCart: 'removeItemFromCart',
    }),
  },
})
</script>

<style lang="scss" scoped>
.cart {
  padding: 2em;
}
.cart__item:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}
</style>
