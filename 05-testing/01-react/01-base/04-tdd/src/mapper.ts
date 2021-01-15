import * as apiModel from './api-model';
import * as viewModel from './view-model';

export const mapToMemberVMList = (
  members: apiModel.Member[]
): viewModel.Member[] =>
  Array.isArray(members) ? members.map((member) => mapToMemberVM(member)) : [];

const mapToMemberVM = (member: apiModel.Member): viewModel.Member => ({
  id: member.id.toString(),
  login: member.login,
  avatarUrl: member.avatar_url,
});
