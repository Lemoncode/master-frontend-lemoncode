<script lang="ts">
  import { counter } from './counter.store';
</script>

<main>
  <h1>Hello Svelte!</h1>
  <h2>Counter: {$counter}</h2>

  <button on:click={() => $counter++}>+1</button>
  <button on:click={() => $counter--}>-1</button>
  <button on:click={() => ($counter = 0)}>Reset</button>
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
