<template>
  <v-container>
    <h2>Recipes</h2>
    <search-bar-component :search-text="searchText" :on-search="onSearch" />
    <table-component :recipes="recipes" />
  </v-container>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Recipe } from "./viewModel";
import { TableComponent, SearchBarComponent } from "./components";

export default Vue.extend({
  name: "RecipeListPage",
  components: { TableComponent, SearchBarComponent },
  props: {
    recipes: { required: true } as PropOptions<Recipe[]>,
    searchText: String,
    onSearch: { required: true } as PropOptions<(value: string) => void>,
  },
});
</script>
