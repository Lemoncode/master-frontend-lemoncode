<script lang="ts">
  import type { Member } from './member.vm';

  export let member: Member;
</script>

<div>
  <img src={member.avatar_url} alt={member.login} />
  <div>{member.login}</div>
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  div > img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: 10px;
  }
</style>
