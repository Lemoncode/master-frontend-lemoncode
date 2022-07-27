<script lang="ts">
  import EditMessage from './edit-message.component.svelte';

  export let message: string;
</script>

<p>Edit your data:</p>
<EditMessage message={message} on:message />
