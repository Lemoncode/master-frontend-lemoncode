<script lang="ts">
  let counter = 0;

  $: console.log(counter);

  $: if (counter > 10) {
    counter = 0;
  }
</script>

<main>
  <h1>Counter {counter}</h1>
  <button
    on:click={() => {
      counter = counter + 1;
    }}>
    Increment!
  </button>
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
