# 03. Event Handler

Partiremos del ejemplo anterior [02-create-new-component](../02-create-new-component/README.md).

## Introducción

Para manejar los eventos del DOM (clic de un botón, cambio un input, etc), podemos crear funciones que se ejecuten cuando estos eventos ocurran. En Svelte podemos asociar estas funciones manejadoras de eventos con `on<nombre_del_evento>`:

_src/lib/playground.svelte_:

```diff
<script lang="ts">
    let name = 'Lemoncoders!';
</script>

<h1>Hello {name}</h1>
+ <input type="text" value={name} oninput={(e) => (name = e.currentTarget!.value)} />

<style>
    h1 {
        color: indianred;
    }
</style>
```

También podemos crear la función en el script de la siguiente manera:

```diff
<script lang="ts">
+   import type { FormEventHandler } from 'svelte/elements';

    let name = 'Lemoncoders!';

+   const handleInput: FormEventHandler<HTMLInputElement> = (e) => {
+       const { value } = e.target as HTMLInputElement;
+       name = value;
+   };

</script>

<h1>Hello {name}</h1>
- <input type="text" value={name} oninput={(e) => (name = e.currentTarget!.value)} />
+ <input type="text" value={name} oninput={handleInput} />

<style>
    h1 {
        color: indianred;
    }
</style>
```

Incluso tenemos un `shorthand`, una forma corta de escribir esto, si llamamos a la funcion igual que al evento:

```diff
<script lang="ts">
    import type { FormEventHandler } from 'svelte/elements';

    let name = 'Lemoncoders!';

-   const handleInput: FormEventHandler<HTMLInputElement> = (e) => {
+   const oninput: FormEventHandler<HTMLInputElement> = (e) => {
+       const { value } = e.target as HTMLInputElement;
+       name = value;
+   };

</script>

<h1>Hello {name}</h1>
- <input type="text" value={name} oninput={handleInput} />
+ <input type="text" value={name} {oninput} />

<style>
    h1 {
        color: indianred;
    }
</style>
```

## Binding

En Svelte, podemos vincular el valor de un input con una variable con la directiva `bind`, y así no tener que escribir la función manejadora de eventos:

```diff
<script lang="ts">
    let name = 'Lemoncoders!';
</script>

<h1>Hello {name}</h1>
- <input type="text" value={name} {oninput} />
+ <input type="text" bind:value={name} />

<style>
    h1 {
        color: indianred;
    }
</style>
```

Incluso si denominamos a la variable `value`, podemos hacer uso del _shorthand_:

```diff
<script lang="ts">
-    let name = 'Lemoncoders!';
+    let value = 'Lemoncoders!';
</script>

- <h1>Hello {name}</h1>
+ <h1>Hello {value}</h1>
- <input type="text" bind:value={name} />
+ <input type="text" bind:value />

<style>
    h1 {
        color: indianred;
    }
</style>
```

Hay diferentes `bindings` que podemos usar en Svelte:

- Text inputs
- Numeric inputs
- Checkbox inputs
- Group inputs
- Select elements
- Select multiple
- Textarea elements

Nos van a simplificar mucho el trabajo a la hora de trabajar con formularios.

## Binding de elementos

Podemos vincular elementos del DOM con variables en Svelte. Para ello, usamos la directiva `bind:this`:

```svelte
<script lang="ts">
	import { onMount } from 'svelte';

	let logo: HTMLImageElement;

	onMount(() => {
		let i = 0;
		const interval = setInterval(() => {
			i++;
			logo.style.transform = `rotate(${i}deg)`;
		}, 50);

		return () => clearInterval(interval);
	});
</script>

<img src="https://avatars.githubusercontent.com/u/7702396?s=200&v=4" bind:this={logo} alt="Logo" />
```

Después de comprobar que funciona como esperamos, volvemos a dejar el playground como estaba para los siguientes ejemplos:

```svelte
<script lang="ts">
	let name = 'Lemoncoders!';
</script>

<h1>Hello {name}</h1>
<input type="text" bind:value={name} />

<style>
	h1 {
		color: indianred;
	}
</style>
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Si lo que te gusta es el mundo del _backend_ también puedes apuntante a nuestro [Bootcamp backend Online Lemoncode](https://lemoncode.net/bootcamp-backend#bootcamp-backend/inicio)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)