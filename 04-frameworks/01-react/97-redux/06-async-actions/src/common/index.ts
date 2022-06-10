import { actionsIds } from "../common/actionIds";
import { MemberEntity } from "../model/member.entity";

export const memberRequestCompleted = (members: MemberEntity[]) => {
  return {
    type: actionsIds.MEMBER_REQUEST_COMPLETED,
    payload: members,
  };
};
