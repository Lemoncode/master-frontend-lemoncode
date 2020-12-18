<template>
  <nav class="nav flex align-items-center justify-content-between container">
    <span>Logo</span>
    <!-- <ul>
      <li><router-link to="/">Home</router-link></li>
    </ul> -->
    <div class="grid cart-container">
      <div>Cart</div>
      <span class="badge text-align-center" v-if="totalItemsInCart">{{
        totalItemsInCart
      }}</span>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

export default defineComponent({
  computed: {
    ...mapGetters('CartModule', {
      totalItemsInCart: 'totalItemsInCart',
    }),
  },
})
</script>

<style lang="scss" scoped>
.nav {
  min-height: 80px;
  background-color: rgb(198, 247, 244);
  position: sticky;
  top: 0;
}
ul {
  margin: 0;
  list-style: none;
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
