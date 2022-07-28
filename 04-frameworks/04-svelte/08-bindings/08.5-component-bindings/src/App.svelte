<script lang="ts">
  import EditName from './edit-name.svelte';

  let myName = 'Lemoncoders';
</script>

<main>
  <h1>Hello {myName}!</h1>
  <EditName bind:name={myName} />
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
