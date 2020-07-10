<template>
  <form-component
    :recipe="recipe"
    :recipe-error="recipeError"
    :on-update-recipe="onUpdateRecipe"
    :on-add-ingredient="onAddIngredient"
    :on-remove-ingredient="onRemoveIngredient"
    :on-save="onSave"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { FormProps } from "./formProps";
import { FormComponent } from "./components";

export default Vue.extend({
  name: "RecipeEditPage",
  components: { FormComponent },
  props: {
    recipe: {},
    recipeError: {},
    onUpdateRecipe: {},
    onAddIngredient: {},
    onRemoveIngredient: {},
    onSave: {}
  } as FormProps
});
</script>
