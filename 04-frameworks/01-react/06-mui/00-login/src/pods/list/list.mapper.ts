import * as vm from "./list.vm";
import * as api from "./list.api-model";

export const mapMemberFromApiToVm = (
  member: api.MemberEntityApi
): vm.MemberEntity => ({
  id: member.id.toString(),
  login: member.login,
  avatar_url: member.avatar_url,
});

export const mapMemberCollectionFromApiToVm = (
  memberCollection: api.MemberEntityApi[]
): vm.MemberEntity[] =>
  memberCollection.map((member) => mapMemberFromApiToVm(member));
