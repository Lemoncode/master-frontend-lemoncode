# 04. Reactivity

Partiremos del ejemplo anterior [03-event-handler](../03-event-handler/README.md).

## Introducción

En los ejemplos anteriores, hemos visto cómo al cambiar el valor de una variable, Svelte se encarga de actualizar el DOM automáticamente. Sin embargo, la reactividad que hemos utilizado es una forma antigua de trabajar (versiones anteriores a Svente 5). No vamos a entrar en detalle, pero antes la reactividad se basaba en **asignación de valores**. Si asignabamos un nuevo valor a una variable, Svelte se encargaba de actualizar el DOM.

En Svelte 5 aparecen las **runas**. El cambio está justificado en varios aspectos, tanto en la forma de escribir bloques de código reactivos como en la tecnología que hay detrás. Las **runas** utilizan **signals** (adoptado por multitud de otros frameworks).

Primero vamos a desactivar la reactividad antigua para ver que no se actualiza el DOM automáticamente con la asignación de nuevos valores a simples variables:

_svelte.config.js_:

```diff
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://svelte.dev/docs/kit/integrations
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        // adapter-auto only supports some environments, see https://svelte.dev/docs/   kit/adapter-auto for a list.
        // If your environment is not supported, or you settled on a specific   environment, switch out the adapter.
        // See https://svelte.dev/docs/kit/adapters for more information about  adapters.
        adapter: adapter()
-    }
+    },

+   compilerOptions: {
+       runes: true
+   }
};

export default config;
```

> También se puede cambiar el `runes mode` para un componente en concreto con `<svelte:options runes={true/false} />`.

Podemos ejecutar el proyecto y comprobar que hemos perdido la reactividad.

### Runas

Las **runas** tienen el prefijo `$` y tienen pinta de funciones:

```svelte
let name = $state('Lemoncoders');
```

¿Nos suena verdad? ¿Qué vamos a necesitar para controlar la reactividad? estados, efectos, props...

Estas son las **runas** que nos ofrece Svelte 5:

- `$state`: para crear un estado.
- `$derived`: para crear un estado derivado.
- `$effect`: para crear un efecto.
- `$inspect`: para inspeccionar el valor de un _state_ (como un _console.log_ pero se re-ejecuta cuando cambia el valor).
- `$props`: para acceder a las props.
- `$bindable`: para convertir una prop en bindeable.
- `$host`: para acceder al elemento _host_ de un _custom element_.

## $state: Estados

Vamos a volver a recuperar la reactividad de nuestro ejemplo, vamos a utilizar la runa `$state`:

_src/lib/playground.svelte_:

```diff
<script lang="ts">
-    let name = 'Lemoncoders!';
+    let name = $state('Lemoncoders!');
</script>

<h1>Hello {name}</h1>
<input type="text" bind:value={name} />

<style>
    h1 {
        color: indianred;
    }
</style>
```

Y voilà, ya tenemos la reactividad de vuelta.

### Deep state

Si usamos `$state` con un array o un objecto simple, el resultado es un estado "deeply reactive" (reactivo en profundidad). Esto significa que si modificamos una propiedad de un objeto o un elemento de un array, Svelte se encargará de actualizar el DOM automáticamente.

Vamos a probar :) Sustituimos el contenido de nuestro componente _Playground_ por el siguiente:

```svelte
<script lang="ts">
	let name = $state('Svelte');
	let list = $state<string[]>([]);

	const onclick = () => {
		list.push(name);
		name = '';
	};
</script>

<p>List: {list.join(', ')}</p>

<input type="text" bind:value={name} />
<button {onclick}>Add</button>

<style>
	h1 {
		color: indianred;
	}
</style>
```

Podemos ejecutar para comprobar que funciona.

## $derived: Estados derivados

Los estados derivados son aquellos que dependen de otros estados. Podemos derivar un estado con la runa `$derived`. Vamos a ver un ejemplo:

_src/lib/playground.svelte_:

```svelte
<script lang="ts">
	let count = $state(0);
	let double = $derived(count * 2);

	const onclick = () => {
		count += 1;
	};
</script>

<button {onclick}>Clicked {count} times!</button>
<div>Double: {double}</div>
```

Si necesitamos hacer derivaciones más complejas, podemos utilizar `$derived.by`:

```diff
<script lang="ts">
	let count = $state(0);
	let double = $derived(count * 2);
+	let fibonacci = $derived.by(() => {
+		const fib = (n: number): number => n <= 1 ? n : fib(n - 1) + fib(n - 2);
+		return fib(count);
+	});

	const onclick = () => {
		count += 1;
	}
</script>

<button {onclick}>Clicked {count} times!</button>
<p>Double: {double}</p>
+ <p>Fibonacci: {fibonacci}</p>
```

## $effect: Efectos

Los efectos se ejecutan cuando cambia un estado (o un estado derivado). Vamos a utilizar al runa `$effect` para ver un ejemplo:

_src/lib/playground.svelte_:

```svelte
<script lang="ts">
	import { onMount } from 'svelte';

	let count = $state(0);

	onMount(() => {
		const interval = setInterval(() => {
			count += 1;
		}, 1000);

		// return the cleanup function
		return () => {
			clearInterval(interval);
		};
	});

	$effect(() => {
		console.log('Count:', count);
	});
</script>

<h1>{count} seconds</h1>

<style>
	h1 {
		color: indianred;
	}
</style>
```

## $inspect: Inspeccionar estados

Para inspeccionar estados podríamos crear un efecto (`$effect`) que haga un _console.log_ cada vez que cambie el valor de un estado. Sin embargo, Svelte nos ofrece una runa para hacer esto de forma más sencilla: `$inspect`. Vamos a ver un ejemplo:

_src/lib/playground.svelte_:

```diff
<script lang="ts">
	let name = $state('Lemoncoders!');
	$inspect(name);
</script>

<h1>Hello, {name}!</h1>

<input type="text" bind:value={name} />
```

Podemos ejecutar el proyecto y comprobar que en la consola del navegador se muestra el valor de `name` cada vez que cambia.

## $props: Props

Vamos a crear un nuevo componente _Greetings_ que reciba un prop `name` y la renderice. Para obtener las _props_ de un componente, utilizamos la runa `$props`:

_src/lib/greetings.svelte_:

```svelte
<script lang="ts">
	let { name } = $props();
</script>

<h1>Hello {name}</h1>
```

Y lo utilizamos en _Playground_:

_src/lib/playground.svelte_:

```svelte
<script lang="ts">
	import Greetings from './greetings.svelte';
</script>

<Greetings name="Lemoncoders!" />
```

> Podemos utilizar _fallback value_, _renaming_ y _rest operator_ en las props.

### Callbacks props

Podemos pasar funciones como _props_ a un componente. Vamos a crear un nuevo componente _TextField_:

_src/lib/text-field.svelte_:

```svelte
<script lang="ts">
	import type { FormEventHandler } from 'svelte/elements';

	interface Props {
		id?: string;
		name?: string;
		value: string;
		onchangetext?: (value: string) => void;
	}

	let { id, name, value, onchangetext }: Props = $props();

	const oninput: FormEventHandler<HTMLInputElement> = (e) => {
		const target = e.target as HTMLInputElement;
		onchangetext?.(target.value);
	};
</script>

<input type="text" {id} {name} {value} {oninput} />

<style>
	input {
		padding: 0.5rem;
		font-size: 1rem;
		border: 2px solid #0099ff;
	}

	input:focus {
		outline: none;
		border-color: #ff9900;
	}
</style>
```

Y lo utilizamos en _Playground_:

_src/lib/playground.svelte_:

```diff
<script lang="ts">
	import Greetings from './greetings.svelte';
+	import TextField from './text-field.svelte';

+	let name = $state('Lemoncoders!');

+	const onchangetext = (value: string) => {
+		name = value;
+	};
</script>

- <Greetings name="Lemoncoders!" />
+ <Greetings {name} />
+ <TextField value={name} {onchangetext} />
```

## $bindable: Bindable props

Podemos hacer que la _prop_ sea bindeable con la runa `$bindable`. Vamos a modificar el componente _TextField_ para hacer que la _prop_ `value` sea bindeable:

_src/lib/text-field.svelte_:

```diff
<script lang="ts">
	import type { FormEventHandler } from 'svelte/elements';

	interface Props {
		id?: string;
		name?: string;
		value: string;
		onchangetext?: (value: string) => void;
	}

-	let { id, name, value, onchangetext }: Props = $props();
+	let { id, name, value = $bindable() }: Props = $props();

	const oninput: FormEventHandler<HTMLInputElement> = (e) => {
		const target = e.target as HTMLInputElement;
+		value = target.value;
-		onchangetext?.(target.value);
	};
</script>

<input type="text" {id} {name} {value} {oninput} />

<style>
	input {
		padding: 0.5rem;
		font-size: 1rem;
		border: 2px solid #0099ff;
	}

	input:focus {
		outline: none;
		border-color: #ff9900;
	}
</style>
```

Y lo utilizamos en _Playground_:

_src/lib/playground.svelte_:

```diff
<script lang="ts">
	import Greetings from './greetings.svelte';
	import TextField from './text-field.svelte';

	let name = $state('Lemoncoders!');

-	const onchangetext = (value: string) => {
-		name = value;
-	};
</script>

<Greetings {name} />

- <TextField value={name} {onchangetext} />
+ <TextField bind:value={name} />
```

Podemos ejecutar para comprobar que funciona.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Si lo que te gusta es el mundo del _backend_ también puedes apuntante a nuestro [Bootcamp backend Online Lemoncode](https://lemoncode.net/bootcamp-backend#bootcamp-backend/inicio)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)