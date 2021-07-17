<script lang="typescript">    
    import type { Member } from './members-list.vm';
    import { getMembersList } from './api';
    import { mapMembersToVM } from './members-list.mappers';
    import MembersListComponent from './members-list.component.svelte';

    let members: Member[] = [];

    const handleSearch = async (event: CustomEvent<string>) => {
        members = !event.detail ? [] : await getMembersList(event.detail).then(mapMembersToVM);		
    }
</script>

<MembersListComponent members={members} on:debounce={handleSearch} />