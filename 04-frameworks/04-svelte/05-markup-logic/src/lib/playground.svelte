<script lang="ts">
	import { getUsers } from './api';
	import type { User } from './model';

	let name = '';
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
