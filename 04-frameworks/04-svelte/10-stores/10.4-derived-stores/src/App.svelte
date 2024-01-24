<script lang="ts">
  import { currentTimeFormatted } from './current-time.store';
</script>

<main>
  <h1>Hello Svelte!</h1>
  <h2>The current time is {$currentTimeFormatted}</h2>
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
