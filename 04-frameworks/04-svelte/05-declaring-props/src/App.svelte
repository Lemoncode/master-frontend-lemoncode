<script lang="ts">
  import Info from './info.svelte';

  let counter = 0;

  $: double = counter * 2;

  $: console.log(counter);

  $: if (counter > 10) {
    counter = 0;
  }

  const user = {
    name: 'Lemoncoders!',
    age: 20,
  };
</script>

<main>
  <h1>Counter {counter}</h1>
  <h2>Double: {double}</h2>
  <button
    on:click={() => {
      counter = counter + 1;
    }}>
    Increment!
  </button>

  <Info counter={counter} {...user} />
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
