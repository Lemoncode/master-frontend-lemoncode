import { writable } from 'svelte/store';
import type { Member } from './member.vm';

const createMembersStore = () => {
  const members = writable<Member[]>([]);

  const loadMembers = async (org: string) => {
    fetch(`https://api.github.com/orgs/${org}/members`)
      .then(results => results.json())
      .then(data => members.set(data));
  };

  return {
    subscribe: members.subscribe,
    loadMembers,
  };
};

export const members = createMembersStore();
