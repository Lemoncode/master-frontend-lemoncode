<template>
  <v-layout row wrap>
    <ingredient-row-component
      v-for="(ingredient, index) in ingredients"
      :key="`${ingredient}_${index}`"
      :ingredient="ingredient"
      :on-remove-ingredient="onRemoveIngredient"
    />
  </v-layout>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import IngredientRowComponent from "./IngredientRow.vue";

export default Vue.extend({
  name: "IngredientListComponent",
  components: { IngredientRowComponent },
  props: {
    ingredients: { required: true } as PropOptions<string[]>,
    onRemoveIngredient: { required: true } as PropOptions<
      (ingredient: string) => void
    >,
  },
});
</script>
