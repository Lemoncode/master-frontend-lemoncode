import { actionsIds } from "../common/actionIds";
import { MemberEntity } from "../model/member.entity";

export type memberState = MemberEntity[];

export const memberReducer = (state: memberState = [], action) => {
  switch (action.type) {
    case actionsIds.MEMBER_REQUEST_COMPLETED:
      return handleMemberRequestCompletedAction(state, action.payload);
  }

  return state;
};

const handleMemberRequestCompletedAction = (state: memberState, members) => {
  return members;
};
