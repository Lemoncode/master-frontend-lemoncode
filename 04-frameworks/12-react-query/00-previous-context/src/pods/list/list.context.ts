import React from "react";
import { MemberEntity } from "./list.vm";

export interface MemberListContextVm {
  memberList: MemberEntity[];
  loadMemberList: () => void;
}

export const MemberListContext = React.createContext<MemberListContextVm>({
  memberList: [],
  loadMemberList: () => {
    console.log(
      "If you are reading this, likely you forgot to wrap your component with the MemberListContext.Provider"
    );
  },
});
