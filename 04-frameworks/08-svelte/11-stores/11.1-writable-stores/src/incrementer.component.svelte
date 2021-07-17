<script lang="typescript">
	import { count } from './stores';

	const handleClick = () => {
		count.update(n => n + 1);
	}
</script>

<button on:click={handleClick}>
	+
</button>