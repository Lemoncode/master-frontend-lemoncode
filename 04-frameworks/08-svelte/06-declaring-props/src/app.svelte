<script>
	import HelloComponent from './hello.component.svelte';

	const user = {
		name: 'Frontends',
		lastName: 'Lemoncoders'
	}
</script>

<HelloComponent {...user} />