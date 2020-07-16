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
    recipe: { required: true },
    recipeError: { required: true },
    onUpdateRecipe: { required: true },
    onSave: { required: true },
    onRemoveIngredient: { required: true },
    onAddIngredient: { required: true },
  } as FormProps,
});
</script>
