<script lang="ts">
  let accepted = false;

  $: console.log(accepted);
</script>

<main>
  <h1>Hello Svelte!</h1>
  <input type="checkbox" bind:checked={accepted} /> Accept terms and conditions.
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
