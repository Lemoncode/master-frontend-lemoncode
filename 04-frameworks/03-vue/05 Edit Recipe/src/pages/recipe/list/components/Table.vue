<template>
  <table class="table">
    <header-component />
    <tbody>
      <template v-for="recipe in recipes">
        <row-component :key="recipe.id" :recipe="recipe" />
      </template>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Recipe } from "../viewModel";
import HeaderComponent from "./Header.vue";
import RowComponent from "./Row.vue";

export default Vue.extend({
  name: "TableComponent",
  components: { HeaderComponent, RowComponent },
  props: {
    recipes: { required: true } as PropOptions<Recipe[]>,
  },
});
</script>

<style scoped>
.table {
  border-collapse: collapse;
  width: 100%;
}

.table tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
