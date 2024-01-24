<script lang="ts">
  import { onMount, beforeUpdate, afterUpdate } from 'svelte';

  let value = '';

  onMount(() => {
    console.log('mounted');
    return () => {
      console.log('unmounted');
    };
  });

  beforeUpdate(() => {
    console.log('before update');
  });

  afterUpdate(() => {
    console.log('after update');
  });
</script>

<div>
  <h2>Demo Component</h2>
  <input bind:value={value} />
</div>

<style>
  div {
    border: 1px dashed #ff3e00;
    padding: 1rem;
  }
</style>
