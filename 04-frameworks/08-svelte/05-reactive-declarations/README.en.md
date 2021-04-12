Start from **03-reactivity**

_app.svelte_

```diff
<script>
	let count = 0;

	const handleClick = () => count++;

+	$: double = count * 2;
</script>

<div class="counter">Counter: {count}</div>
+ <div class="counter">Double: {double}</div>
<button on:click={handleClick}>Increment!</button>
```

We're not limited to declaring reactive values — we can also run arbitrary statements reactively. For example, we can log the value of count whenever it changes:

```diff
<script>
	let count = 0;

	const handleClick = () => count++;

	$: double = count * 2;

+	$: console.log(`the count is ${count}`);
</script>

<div class="counter">Counter: {count}</div>
<div class="counter">Double: {double}</div>
<button on:click={handleClick}>Increment!</button>
```

You can easily group statements together with a block:

```diff
<script>
	let count = 0;

	const handleClick = () => count++;

	$: double = count * 2;

+   $: {
+   	console.log(`the count is ${count}`);
+   	alert(`I SAID THE COUNT IS ${count}`);
+   }
</script>

<div class="counter">Counter: {count}</div>
<div class="counter">Double: {double}</div>
<button on:click={handleClick}>Increment!</button>
```

You can even put the $: in front of things like if blocks:

```diff
<script>
	let count = 0;

	const handleClick = () => count++;

	$: double = count * 2;

+   $: if (count >= 10) {
+   	alert(`count is dangerously high!`);
+   	count = 9;
+   }
</script>

<div class="counter">Counter: {count}</div>
<div class="counter">Double: {double}</div>
<button on:click={handleClick}>Increment!</button>
```

## Updating arrays and objects

