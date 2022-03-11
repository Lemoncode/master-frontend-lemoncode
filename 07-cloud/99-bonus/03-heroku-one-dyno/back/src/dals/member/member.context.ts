import { Collection } from 'mongodb';
import { getDBInstance } from 'core/servers';
import { Member } from './member.model';

export const getMemberContext = (): Collection<Member> => {
  const db = getDBInstance();
  return db.collection<Member>('members');
};
