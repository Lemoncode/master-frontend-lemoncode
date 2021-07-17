<script lang="typescript">
	import EditName from './edit-name.component.svelte';

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
<EditName on:nameChanged={onNameChanged} name={name} />