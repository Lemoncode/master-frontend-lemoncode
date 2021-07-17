<script lang="ts">
	let a: number = 1;
	let b: number = 2;

	const handleChangeA = (e) => {
		a = parseInt(e.target.value);
	}

	const handleChangeB = (e) => {
		b = parseInt(e.target.value);
	}
</script>

<label>
	<input type="number" value={a} on:input={handleChangeA} min=0 max=10>
	<input type="range" value={a} on:input={handleChangeA} min=0 max=10>
</label>

<label>
	<input type="number" value={b} on:input={handleChangeB} min=0 max=10>
	<input type="range" value={b} on:input={handleChangeB} min=0 max=10>
</label>

<p>{a} + {b} = {a + b}</p>