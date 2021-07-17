<script lang="typescript">
	import EditName from './edit-name.component.svelte';

	let myName: string = "Svelte";	
</script>

<style>
	h1 {
	  color: blue;
	}
</style>

<h1>Hello {myName}!</h1>
<EditName bind:name={myName} />