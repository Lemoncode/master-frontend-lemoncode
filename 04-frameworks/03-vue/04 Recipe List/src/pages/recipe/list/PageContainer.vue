<template>
  <recipe-list-page :recipes="recipes" />
</template>

<script lang="ts">
import Vue from 'vue';
import { Recipe } from './viewModel';
import { mapRecipeListModelToVm } from './mappers';
import { fetchRecipes } from '../../../rest-api/api/recipe';
import RecipeListPage from './Page.vue';

export default Vue.extend({
  name: 'RecipeListPageContainer',
  components: { RecipeListPage },
  data() {
    return {
      recipes: [] as Recipe[],
    };
  },
  created() {
    fetchRecipes()
      .then(recipes => {
        this.recipes = mapRecipeListModelToVm(recipes);
      })
      .catch(error => console.log(error));
  },
});
</script>
