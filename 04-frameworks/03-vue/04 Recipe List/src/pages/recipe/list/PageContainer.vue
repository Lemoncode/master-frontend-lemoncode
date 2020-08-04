<template>
  <recipe-list-page
    :search-text="searchText"
    :on-search="onSearch"
    :recipes="filteredRecipes"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { fetchRecipes } from "../../../rest-api/api/recipe";
import { mapRecipeListModelToVm } from "./mappers";
import { filterRecipesByCommaSeparatedText } from "./business/filterRecipeBusiness";
import { Recipe } from "./viewModel";
import RecipeListPage from "./Page.vue";

export default Vue.extend({
  name: "RecipeListPageContainer",
  components: {
    RecipeListPage,
  },
  data() {
    return {
      recipes: [] as Recipe[],
      searchText: "",
    };
  },
  computed: {
    filteredRecipes(): Recipe[] {
      return filterRecipesByCommaSeparatedText(this.recipes, this.searchText);
    },
  },
  created() {
    fetchRecipes()
      .then((recipes) => {
        this.recipes = mapRecipeListModelToVm(recipes);
      })
      .catch((error) => console.log(error));
  },
  methods: {
    onSearch(value: string) {
      this.searchText = value;
    },
  },
});
</script>
