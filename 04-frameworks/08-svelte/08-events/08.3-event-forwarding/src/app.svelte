<script lang="typescript">
	import FormData from './form-data.component.svelte';

	let name: string = "Svelte";

	const onNameChanged = (e: CustomEvent<{name: string}>) => {
		name = e.detail.name;
	}
</script>

<style>
	h1 {
	  color: blue;
	}
</style>

<h1>Hello {name}!</h1>
<FormData on:nameChanged={onNameChanged} name={name} />