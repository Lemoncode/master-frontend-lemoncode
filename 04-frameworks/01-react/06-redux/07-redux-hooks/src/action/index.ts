import { actionsIds } from "../common/actionIds";
import { MemberEntity } from "../model/member.entity";
import { getMembersCollection } from "../api/member.api";

export const memberRequestCompleted = (members: MemberEntity[]) => {
  return {
    type: actionsIds.MEMBER_REQUEST_COMPLETED,
    payload: members,
  };
};

export const memberRequest = () => (dispatcher) => {
  const promise = getMembersCollection();

  promise.then((data) => dispatcher(memberRequestCompleted(data)));

  return promise;
};
