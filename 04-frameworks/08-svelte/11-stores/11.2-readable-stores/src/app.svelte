<script lang="typescript">
	import { randomMessages } from './stores';
</script>

<h1>Random messages:</h1>
{#each $randomMessages as message}
	<p>{message}</p>
{/each}