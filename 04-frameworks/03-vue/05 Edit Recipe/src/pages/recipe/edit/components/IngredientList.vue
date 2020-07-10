<template>
  <v-layout row wrap>
    <template v-for="(ingredient, index) in ingredients">
      <ingredient-row-component
        :key="`${ingredient}_${index}`"
        :ingredient="ingredient"
        :on-remove-ingredient="onRemoveIngredient"
      />
    </template>
  </v-layout>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import IngredientRowComponent from './IngredientRow.vue';

export default Vue.extend({
  name: 'IngredientListComponent',
  components: { IngredientRowComponent },
  props: {
    ingredients: {} as PropOptions<string[]>,
    onRemoveIngredient: {} as PropOptions<(ingredient: string) => void>,
  },
});
</script>
