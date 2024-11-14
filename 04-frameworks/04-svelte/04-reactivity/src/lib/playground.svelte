<script lang="ts">
	import Greetings from './greetings.svelte';
	import TextField from './text-field.svelte';

	let name = $state('Lemoncoders!');

	$inspect(name);
</script>

<Greetings {name} />

<TextField bind:value={name} />
