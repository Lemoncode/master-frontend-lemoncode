Start from **09.04-group-inputs**

# Binding select multiple

Continuando con el ejemplo anterior `09.04-group-inputs` podemos sustituir el grupo de _checkbox inputs_ por un _select multiple_ de la siguiente forma:

```ts
<h2>Flavours</h2>

<select multiple bind:value={flavours}>
	{#each menu as flavour}
		<option value={flavour}>
			{flavour}
		</option>
	{/each}
</select>
```
