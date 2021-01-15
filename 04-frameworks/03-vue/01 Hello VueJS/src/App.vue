<template>
  <h1>{{message}}</h1>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
  data() {
    return {
      message: 'Hello from App',
    };
  },
});
</script>
