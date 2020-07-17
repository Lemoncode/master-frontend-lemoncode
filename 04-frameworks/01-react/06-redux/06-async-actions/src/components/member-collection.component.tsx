import * as React from "react";
import { MemberEntity } from "../model/member.entity";

interface Props {
  memberCollection: MemberEntity[];
  loadMemberCollection: () => void;
}

export const MemberCollectionComponent = (props: Props) => {
  const { memberCollection, loadMemberCollection } = props;

  // TODO Excercise port this to a table
  return (
    <>
      <button onClick={loadMemberCollection}>Load</button>
      <ul>
        {memberCollection.map((member) => (
          <li>{member.login}</li>
        ))}
      </ul>
    </>
  );
};
