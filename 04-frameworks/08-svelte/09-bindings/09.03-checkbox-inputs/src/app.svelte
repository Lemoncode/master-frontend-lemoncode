<script lang="ts">
	let yes: boolean = false;
</script>

<label>
	<input type=checkbox bind:checked={yes}>
	Aceptar
</label>

{#if yes}
	<p>Ha aceptado las condiciones de uso.</p>
{:else}
	<p>Debe aceptar las condiciones de uso para continuar.</p>
{/if}

<button disabled={!yes}>
	Suscribir
</button>