<script lang="typescript">
    import type { Member } from './members-list.vm';
    import DebounceInput from 'common/components/debounce-input.component.svelte';

    export let members: Member[];

    let searchTerm: string;
</script>

<style>
    div {
        padding: 8px;
        border-bottom: 1px solid #999;
        font-size: 20px;
    }

    div img {
        width: 100px;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 16px;
    }
</style>

<DebounceInput value="{searchTerm}" on:debounce />
{#each members as member (member.login)}
    <div>
        <img src="{member.avatarUrl}" alt="{member.login}" />
        {member.login}
    </div>
{/each}