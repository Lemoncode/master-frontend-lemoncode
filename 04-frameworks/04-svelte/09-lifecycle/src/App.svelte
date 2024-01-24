<script lang="ts">
  import Demo from './demo.svelte';

  let show = false;
</script>

<main>
  <h1>Hello Svelte!</h1>
  <button on:click={() => (show = !show)}>Toggle</button>
  {#if show}
    <Demo />
  {/if}
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
