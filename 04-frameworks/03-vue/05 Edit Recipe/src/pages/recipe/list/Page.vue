<template>
  <v-container>
    <h2>Recipes</h2>
    <search-bar-component :search-text="searchText" :on-search="onSearch" />
    <table-component :recipes="filteredRecipes" />
  </v-container>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Recipe } from './viewModel';
import { TableComponent, SearchBarComponent } from './components';
import { filterRecipesByCommaSeparatedText } from './business/filterRecipeBusiness';

export default Vue.extend({
  name: 'RecipeListPage',
  components: { TableComponent, SearchBarComponent },
  props: {
    recipes: {} as PropOptions<Recipe[]>,
  },
  data() {
    return { searchText: '' };
  },
  methods: {
    onSearch(value: string) {
      this.searchText = value;
    },
  },
  computed: {
    filteredRecipes(): Recipe[] {
      return filterRecipesByCommaSeparatedText(this.recipes, this.searchText);
    },
  },
});
</script>
