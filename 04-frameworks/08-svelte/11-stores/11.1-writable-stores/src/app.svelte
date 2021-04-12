<script lang="typescript">
	import { count } from './stores';
	import Incrementer from './incrementer.component.svelte';
</script>

<p>The count is: {$count}</p>

<Incrementer />