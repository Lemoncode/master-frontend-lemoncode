<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let message: string;

  const dispatch = createEventDispatcher();

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    dispatch('message', { message: target.value });
  };
</script>

<input type="text" on:input={handleInput} value={message} />
