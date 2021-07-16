<template>
  <nav class="nav flex align-items-center justify-content-between container">
    <div>Logo</div>
    <div class="grid cart-container">
      <div>Cart</div>
      <div class="badge text-align-center" v-if="totalItemsInCart">
        {{ totalItemsInCart }}
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

export default defineComponent({
  computed: {
    ...mapGetters('CartModule', ['totalItemsInCart']),
  },
})
</script>

<style scoped>
.nav {
  min-height: 80px;
  background-color: rgb(198, 247, 244);
  position: sticky;
  top: 0;
}
.cart-container {
  padding-right: 60px;
  grid-template-columns: auto 60px;
  place-items: center;
}
.badge {
  display: flex;
  place-items: center;
  place-content: center;
  background-color: rgba(10, 105, 194, 0.5);
  color: #ffffff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-right: 0;
}
</style>
