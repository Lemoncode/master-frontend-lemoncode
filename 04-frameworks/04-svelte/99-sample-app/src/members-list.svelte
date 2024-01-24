<script lang="ts">
  import Member from './member.svelte';
  import { members } from './members.store';

  let organization = '';

  const handleClick = () => {
    members.loadMembers(organization);
  };
</script>

<input bind:value={organization} placeholder="Search by organization" />
<button on:click={handleClick}>Search</button>

{#each $members as member}
  <Member member={member} />
{/each}
