import { Member } from './member.model';
import { MemberContext } from './member.context';

export const getMemberList = async (organization: string): Promise<Member[]> =>
  await MemberContext.find({
    organization,
  })
    .select({
      _id: 1,
      avatarUrl: 1,
      login: 1,
    })
    .lean();

export const insertMemberList = async (memberList: Member[]) =>
  await MemberContext.insertMany(memberList);
