Start from **03-svelte-typescript**

# Binding - this

```bash
npm install --save-dev file-loader
```

_webpack.config.js_

```diff
+	{
+		test: /\.(png|svg|jpg|gif)$/,
+		use: ["file-loader"],
+	},
```

```ts
<script lang="ts">
	import { onMount } from 'svelte';
	import svg from './lemon.svg';

	let logo: HTMLImageElement;

	onMount(() => {
		let i = 0;
		const interval= setInterval(() => {
			i++;
			logo.style.transform = `rotate(${i}deg)`;
		}, 50);

		return () => clearInterval(interval);
	})
</script>

<style>
	:global(body) {
		text-align: center;
	}

	img {
		width: 50%;
	}
</style>

<h1>Master Lemoncode</h1>

<img bind:this={logo} alt="" src={svg} />
```
