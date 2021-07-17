Start from **03-svelte-typescript**

# Binding content editable

Los elementos con un atributo `contenteditable="true"` admiten enlaces `textContent` e `innerHTML`:

```ts
<div
	contenteditable="true"
	bind:innerHTML={html}
></div>
```

Vamos a ver un ejemplo:

```ts
<script>
	let html = '<p>Write some text!</p>';
</script>

<div
	contenteditable="true"
	bind:innerHTML={html}
></div>

<pre>{html}</pre>

<style>
	[contenteditable] {
		padding: 0.5em;
		border: 1px solid #eee;
		border-radius: 4px;
	}
</style>
```
