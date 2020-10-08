import * as model from 'dals/member/member.model';
import * as apiModel from './member.api-model';

const mapMemberFromModelToApi = (member: model.Member): apiModel.Member => ({
  id: member._id,
  avatar_url: member.avatarUrl,
  login: member.login,
});

export const mapMemberListFromModelToApi = (
  memberList: model.Member[]
): apiModel.Member[] => memberList.map(mapMemberFromModelToApi);
