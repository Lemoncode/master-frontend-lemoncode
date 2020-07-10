<template>
  <recipe-edit-page
    :recipe="recipe"
    :recipe-error="recipeError"
    :on-update-recipe="onUpdateRecipe"
    :on-add-ingredient="onAddIngredient"
    :on-remove-ingredient="onRemoveIngredient"
    :on-save="onSave"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import { router } from '../../../router';
import { fetchRecipeById, save } from '../../../rest-api/api/recipe';
import { Recipe, createEmptyRecipe, RecipeError, createEmptyRecipeError } from './viewModel';
import { mapRecipeModelToVm, mapRecipeVmToModel } from './mappers';
import RecipeEditPage from './Page.vue';
import { validations } from './validations';

export default Vue.extend({
  name: 'RecipeEditPageContainer',
  components: { RecipeEditPage },
  props: { id: String },
  data() {
    return {
      recipe: createEmptyRecipe(),
      recipeError: createEmptyRecipeError(),
    };
  },
  beforeMount() {
    const id = Number(this.id || 0);
    fetchRecipeById(id)
      .then(recipe => {
        this.recipe = mapRecipeModelToVm(recipe);
      })
      .catch(error => console.log(error));
  },
  methods: {
    onUpdateRecipe(field: string, value: string) {
      this.recipe = {
        ...this.recipe,
        [field]: value,
      };
      this.validateRecipeField(field, value);
    },
    onAddIngredient(ingredient: string) {
      this.recipe = {
        ...this.recipe,
        ingredients: [...this.recipe.ingredients, ingredient],
      };
      this.validateRecipeField('ingredients', this.recipe.ingredients);
    },
    onRemoveIngredient(ingredient: string) {
      this.recipe = {
        ...this.recipe,
        ingredients: this.recipe.ingredients.filter(i => {
          return i !== ingredient;
        }),
      };
      this.validateRecipeField('ingredients', this.recipe.ingredients);
    },
    onSave() {
      validations.validateForm(this.recipe).then(result => {
        if (result.succeeded) {
          const recipe = mapRecipeVmToModel(this.recipe);
          save(recipe)
            .then(message => {
              console.log(message);
              this.$router.back();
            })
            .catch(error => console.log(error));
        } else {
          this.recipeError = {
            ...this.recipeError,
            ...result.fieldErrors,
          };
        }
      });
    },
    validateRecipeField(field, value) {
      validations
        .validateField(this.recipe, field, value)
        .then(result => this.updateRecipeError(field, result));
    },
    updateRecipeError(field, result) {
      this.recipeError = {
        ...this.recipeError,
        [field]: result,
      };
    },
  },
});
</script>
