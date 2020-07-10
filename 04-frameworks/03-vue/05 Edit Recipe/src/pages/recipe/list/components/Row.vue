<template>
  <tr>
    <td :class="$style.name">
      <span>{{recipe.name}}</span>
    </td>
    <td :class="$style.description">
      <span>{{recipe.description}}</span>
    </td>
    <td :class="$style.editButton">
      <v-btn flat icon :to="`recipe/${recipe.id}`">
        <v-icon>edit</v-icon>
      </v-btn>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Recipe } from "../viewModel";

export default Vue.extend({
  name: "RowComponent",
  props: {
    recipe: {} as PropOptions<Recipe>
  }
});
</script>

<style module>
.name {
  width: 25%;
}

.description {
  max-width: 177px;
}

.description span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 100%;
}

.edit-button {
  text-align: end;
}
</style>
