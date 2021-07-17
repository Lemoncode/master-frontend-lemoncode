Start from **03-svelte-typescript**

No todo el estado de la aplicación pertenece a la jerarquía de componentes de la aplicación. A veces, tendrás valores que necesitan ser accedidos por múltiples componentes no relacionados. Se conocen como datos de contexto, cross a toda la aplicación: por ejemplo, la información del usuario logado, que necesitará ser accedida desde el header y desde un drawer lateral, además de los componentes que necesiten hacer peticiones a una API que necesita como parámetro el identificador del usuario.

En Svelte, hacemos esto con _stores_. Un _store_ es simplemente un objeto con un método de suscripción que permite que las partes interesadas sean notificadas cada vez que el valor del _store_ cambia.

Vamos a crear nuestro primer _store_ donde almacenar el valor de un contador accesible desde toda la aplicación:

_stores.ts_

```ts
import { writable } from "svelte/store";

export const count = writable(0);
```

Podemos ver que Typescript infiere el tipo de la variable _count_:

`const count: Writable<number>`.

Para consumir el _store_ vamos a modificar _app.svelte_:

```ts
<script lang="typescript">
	import { count } from './stores';

	let count_value;

	const unsubscribe = count.subscribe(value => {
		count_value = value;
	});

	onDestroy(unsubscribe);
</script>

<p>The count is: {count_value}</p>
```

y para modificar el valor del _store_ vamos a crear un nuevo componente _incrementer_:

_incrementer.component.svelte_:

```ts
<script lang="typescript">
	import { count } from './stores';

	const handleClick = () => {
		count.update(n => n + 1);
	}
</script>

<button on:click={handleClick}>
	+
</button>
```

Y lo utilizamos desde _app_:

_app.svelte_:

```diff
<script lang="typescript">
	import { count } from './stores';
+	import Incrementer from './incrementer.component.svelte';

	let count_value;

	const unsubscribe = count.subscribe(value => {
		count_value = value;
	});

	onDestroy(unsubscribe);
</script>

<p>The count is: {count_value}</p>

+ <Incrementer />
```

## Auto-subscriptions

Esto empieza a ser un poco complicado, especialmente si tu componente se suscribe a múltiples _stores_. En su lugar, Svelte tiene un truco bajo la manga: puedes hacer referencia a un valor del _store_ con **$**:

_app.svelte_

```diff
<script lang="typescript">
	import { count } from './stores';
	import Incrementer from './incrementer.component.svelte';

-	let count_value;

-	const unsubscribe = count.subscribe(value => {
-		count_value = value;
-	});

-	onDestroy(unsubscribe);
</script>

- <p>The count is: {count_value}</p>
+ <p>The count is: {$count}</p>
<Incrementer />
```


La suscripción automática sólo funciona con variables de _store_ que se declaran (o importan) en el ámbito de nivel superior de un componente.

> No estás limitado a usar _$count_ dentro del marcado. Puedes usarlo en cualquier parte del _script_ también, como en los manejadores de eventos o declaraciones reactivas.

Cualquier nombre que comience con $ se supone que se refiere a un valor de un _store_. Es un carácter reservado - Svelte evitará que declares tus propias variables con un prefijo _$_.
