<script lang="typescript">
    import EditName from './edit-name.component.svelte';    

    export let name: string;
</script>

<p>Edit your data:</p>
<EditName name={name} on:nameChanged />