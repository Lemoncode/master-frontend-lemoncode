<template>
  <v-text-field
    placeholder="Search for ingredients comma separated..."
    :value="searchText"
    @input="onSearch"
  />
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

export default Vue.extend({
  name: "SearchBarComponent",
  props: {
    searchText: String,
    onSearch: { required: true } as PropOptions<(value: string) => void>,
  },
});
</script>
