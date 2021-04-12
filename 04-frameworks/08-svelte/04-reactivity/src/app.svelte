<script>
	let count = 0;

	const handleClick = () => count++;
</script>

<div class="counter">Counter: {count}</div>
<button on:click={handleClick}>Increment!</button>