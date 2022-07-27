<script lang="ts">
  import EditMessage from './edit-message.component.svelte';

  let message: string = 'Initial message';

  const handleMessage = (e: CustomEvent<{ message: string }>) => {
    message = e.detail.message;
  };
</script>

<main>
  <h1>Hello Svelte!</h1>
  <h2>{message}</h2>
  <EditMessage on:message={handleMessage} message={message} />
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
