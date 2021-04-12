<script lang="typescript">
	let count: number = 0;

	const handleClick = () => count++;

	$: double = count * 2;

	$: if(count >= 10) {
		alert(`count is dangerously high!`);
		count = 9;
	}

	let user = {
		name: 'John',
		lastName: 'Doe',
	}
	
	const handleUserChange = (field: keyof typeof user) => (e: any) => {
		user[field] = e.target?.value;
	}
</script>

<div class="counter">Counter: {count}</div>
<div class="counter">Double: {double}</div>
<button on:click={handleClick}>Increment!</button>

<p>Hello {user.name} {user.lastName}</p>
<input on:keyup={handleUserChange('name')} value={user.name} />
<input on:keyup={handleUserChange('lastName')} value={user.name} />