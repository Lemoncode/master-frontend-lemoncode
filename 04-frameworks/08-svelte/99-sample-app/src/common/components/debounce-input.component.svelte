<script lang="typescript">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let value: string;

    let timeout: NodeJS.Timeout;

    $: {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(() => {
            dispatch('debounce', value);
        }, 1000);
    }
</script>

<style>
   
</style>

<input type="text" bind:value="{value}" />
