<script lang="ts">
  import { counter } from './counter.store';
</script>

<main>
  <h1>Hello Svelte!</h1>
  <h2>Counter: {$counter}</h2>

  <button on:click={counter.increment}>+1</button>
  <button on:click={counter.decrement}>-1</button>
  <button on:click={counter.reset}>Reset</button>
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
