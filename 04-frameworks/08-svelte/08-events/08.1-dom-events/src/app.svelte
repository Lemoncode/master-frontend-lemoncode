<script lang="typescript">
	let m = { x: 0, y: 0 };

	const handleMousemove: svelte.JSX.MouseEventHandler<HTMLDivElement> = (event) => {
		m.x = event.clientX;
		m.y = event.clientY;
	}
</script>

<style>
	div { width: 100vw; height: 100vh; }
</style>

<div on:mousemove={handleMousemove}>
	The mouse position is {m.x} x {m.y}
</div>