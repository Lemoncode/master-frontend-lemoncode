<script lang="ts">
  import { currentTime } from './current-time.store';
</script>

<main>
  <h1>Hello Svelte!</h1>
  <h2>The current time is {$currentTime.toLocaleTimeString()}</h2>
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
