<template>
  <v-layout row align-center>
    <v-chip outlined>
      {{ ingredient }}
      <v-icon right @click="() => onRemoveIngredient(ingredient)">close</v-icon>
    </v-chip>
  </v-layout>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

export default Vue.extend({
  name: "IngredientRowComponent",
  props: {
    ingredient: String,
    onRemoveIngredient: { required: true } as PropOptions<
      (ingredient: string) => void
    >,
  },
});
</script>
