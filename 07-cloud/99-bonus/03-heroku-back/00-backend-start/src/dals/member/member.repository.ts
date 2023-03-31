import { Member } from './member.model';
import { getMemberContext } from './member.context';

export const getMemberList = async (organization: string): Promise<Member[]> =>
  await getMemberContext()
    .find(
      {
        organization,
      },
      {
        projection: {
          _id: 1,
          avatarUrl: 1,
          login: 1,
        },
      }
    )
    .toArray();

export const insertMemberList = async (memberList: Member[]) =>
  await getMemberContext().insertMany(memberList);
