<script lang="typescript">
    import { createEventDispatcher } from 'svelte';

    export let name: string;

    const dispatch = createEventDispatcher();

    const handleChange = (e) => {
        dispatch('nameChanged', {name: e.target.value})
    }
</script>

<input type="text" on:keyup={handleChange} value={name} />