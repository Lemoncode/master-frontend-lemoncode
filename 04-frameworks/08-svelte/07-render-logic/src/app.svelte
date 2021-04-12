<script>
	let films = [
		{ id: 'J9fc6bW_oH0', name: 'Cube' },
		{ id: 'OTPtu78Dnpg', name: 'Hypercube' },
		{ id: 'Jb1I2qVau60', name: 'Cube Zero' }
	];
</script>

<h1>The Complete Cube Trilogy</h1>

<ul>
	{#each films as film}
		<li>
			<a target="_blank" href="https://www.youtube.com/watch?v={film.id}">
				{film.name}
			</a>
		</li>
	{/each}
</ul>