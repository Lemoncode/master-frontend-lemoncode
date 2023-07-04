import React from "react";
import { ListComponent } from "./list.component";
import { useMemberListContext } from "./list.provider";

export const ListContainer: React.FC = () => {
  const { memberList, loadMemberList } = useMemberListContext();

  React.useEffect(() => {
    loadMemberList();
  }, []);

  return <ListComponent members={memberList} />;
};
