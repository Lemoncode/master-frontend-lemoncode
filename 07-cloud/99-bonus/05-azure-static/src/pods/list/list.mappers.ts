import * as apiModel from './api/list.api-model';
import * as viewModel from './list.vm';
import { mapToCollection } from '@/common/mappers';

const mapMemberFromApiToVm = (member: apiModel.Member): viewModel.Member => ({
  id: member.id,
  name: member.login,
  imageUrl: member.avatar_url,
});

export const mapMemberListFromApiToVm = (
  memberList: apiModel.Member[]
): viewModel.Member[] => mapToCollection(memberList, mapMemberFromApiToVm);
