Start from **03-svelte-typescript**

# Binding text inputs o text areas

En lugar de utilizar un manejador de eventos para setear el valor en el estado interno al escribir en el _input_, podemos usar la directiva `bind:value`, de la siguiente manera:

```ts
<input bind:value={name}>
```

Esto significa que los cambios en el valor de `name` no solo actualizarán el _input_, sino que los cambios en el _input_ actualizarán el valor de `name`.

```ts
<script>
	let value = 'lemoncoders';
</script>

<input bind:value={name}>

<h1>Hello {name}!</h1>
```

En el caso en que el estado interno se llamara `value`, podemos utilizar un _shorthand_:

```ts
<input bind:value>
```
