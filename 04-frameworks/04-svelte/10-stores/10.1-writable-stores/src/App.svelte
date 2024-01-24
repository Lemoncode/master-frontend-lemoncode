<script lang="ts">
  import { onDestroy } from 'svelte';
  import { counter } from './counter.store';

  let count: number;

  const unsubscribe = counter.subscribe(value => {
    count = value;
  });

  onDestroy(unsubscribe);
</script>

<main>
  <h1>Hello Svelte!</h1>
  <h2>Counter: {count}</h2>

  <button on:click={() => counter.update(n => n + 1)}>+1</button>
  <button on:click={() => counter.update(n => n - 1)}>-1</button>
  <button on:click={() => counter.set(0)}>Reset</button>
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
