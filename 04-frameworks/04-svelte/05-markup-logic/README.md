# 05. Markup Logic

Vamos a necesitar para estos ejemplos una interface de datos, vamos a crear un ficher `model.ts` con la interface `User`:

```typescript
export interface User {
	id: string;
	name: string;
	email: string;
}

export const createUserList = (): User[] => [
	{
		id: '1',
		name: 'John Doe',
		email: 'john-doe@email.com'
	},
	{
		id: '2',
		name: 'Jane Doe',
		email: 'jane-doe@email.com'
	},
	{
		id: '3',
		name: 'Alice',
		email: 'alice@email.com'
	}
];
```

## #each

```svelte
{#each array as item}...{/each}

{#each array as item (key)}...{/each}

{#each array as item, index}...{/each}

{#each array as item, index (key)}...{/each}
```

Ahora vamos a recorrer la lista de usuarios para renderizarlos en nuestro componente:

_src/lib/playground.svelte_:

```svelte
<script lang="ts">
	import { createUserList, type User } from './model';
	const users = $state<User[]>(createUserList());
</script>

{#each users as user, index (user.id)}
	<div>{index + 1}: {user.name} - {user.email}</div>
{/each}
```

## #await

```svelte
{#await promise}...{:then value}...{:catch error}...{/await}

{#await promise}...{:then value}...{/await}

{#await promise then value}...{/await}

{#await promise catch error}...{/await}
```

Vamos a modificar el comportamiento del ejemplo anterior para traer la lista de usuarios de una API (`https://jsonplaceholder.typicode.com/users?name_like=${name}`):

_api.ts_:

```typescript
import type { User } from './model';

export const getUsers = async (name: string): Promise<User[]> => {
	return fetch(`https://jsonplaceholder.typicode.com/users?name_like=${name}`)
		.then((res) => res.json())
		.then((data) => data);
};
```

Y utilizamos la llamada a la API en el componente:

```svelte
<script lang="ts">
	import { getUsers } from './api';
</script>

{#await getUsers('')}
	<p>Loading...</p>
{:then users}
	{#each users as user (user.id)}
		<div>{user.name} - {user.email}</div>
	{/each}
{:catch error}
	<div>Ooops! Error</div>
{/await}
```

Podemos incluso actualizar la llamada cuando cambie un estado para filtrar por nombre:

```diff
<script lang="ts">
	import { getUsers } from './api';
+	let name = $state('');
</script>

+ <input bind:value={name} />

- {#await getUsers('')}
+ {#await getUsers(name)}
	<p>Loading...</p>
{:then users}
	{#each users as user (user.id)}
		<div>{user.name} - {user.email}</div>
	{/each}
{:catch error}
	<div>Ooops! Error</div>
{/await}
```

## #if

```svelte
{#if expression}...{/if}

{#if expression}...{:else}...{/if}

{#if expression}...{:else if expression}...{:else}...{/if}
```

Vamos a utilizarlo para mostrar un mensaje cuando no se encuentren usuarios:

```diff
<script lang="ts">
	import { getUsers } from './api';
	let name = $state('');
</script>

<input bind:value={name} />

{#await getUsers(name)}
	<p>Loading...</p>
{:then users}
	{#each users as user (user.id)}
		<div>{user.name} - {user.email}</div>
	{/each}

+	{#if users.length === 0}
+		<p>No users found</p>
+	{/if}
{:catch error}
	<div>Ooops! Error</div>
{/await}
```

## #snippet

Para reutilizar bloques de código podemos utilizar la directiva `#snippet`:

```svelte
{#snippet name}...{/snippet}
```

Vamos a crear un snippet para renderizar un item de la lista de usuarios:

```svelte
{#snippet listItem(user: User)}
    <div>{user.name} - {user.email}</div>
{/snippet}
```

## @render

Para renderizar los `snippets` necesitamos utilizar la directiva `@render`:

```diff
<script lang="ts">
	import { getUsers } from './api';
+	import type { User } from './model';

	let name = $state('');
</script>

<input bind:value={name} />

+ {#snippet listItem(user: User)}
+ 	<div>{user.name} - {user.email}</div>
+ {/snippet}

{#await getUsers(name)}
	<p>Loading...</p>
{:then users}
	{#each users as user (user.id)}
-       <div>{user.name} - {user.email}</div>
+		{@render listItem(user)}
	{/each}

	{#if users.length === 0}
		<p>No users found</p>
	{/if}
{:catch error}
	<div>Ooops! Error</div>
{/await}
```

### Example

Con todo lo anterior podríamos tener un componente como el siguiente:

```svelte
<script lang="ts">
	import { getUsers } from './api';
	import type { User } from './model';

	let name = $state('');
</script>

<input bind:value={name} placeholder="Enter user name" />
<h1>Search by "{name}"</h1>

{#snippet listItem(user: User)}
	<li>{user.name} - {user.email}</li>
{/snippet}

{#await getUsers(name)}
	<p>Loading...</p>
{:then users}
	<ul>
		{#each users as user (user.id)}
			{@render listItem(user)}
		{/each}
	</ul>

	{#if users.length === 0}
		<p>No users found</p>
	{/if}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

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
