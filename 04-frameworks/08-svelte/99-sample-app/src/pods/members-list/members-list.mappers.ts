import * as am from "./api/models/members-list.model";
import * as vm from "./members-list.vm";

export const mapMembersToVM = (list: am.Member[]): vm.Member[] =>
  list.map(mapMemberToVM);

export const mapMemberToVM = (item: am.Member): vm.Member => ({
  login: item.login,
  firstName: item.login,
  avatarUrl: item.avatar_url,
});
