import * as React from "react";
import { MemberEntity } from "../model/member.entity";
import { State } from "../reducer";
import { useSelector, useDispatch } from "react-redux";
import { memberRequest } from "../action";

interface Props {}

export const MemberCollectionComponent = (props: Props) => {
  const memberCollection = useSelector((state: State) => state.memberReducer);
  const dispatch = useDispatch();
  
  // TODO Excercise port this to a table
  return (
    <>
      <button onClick={() => dispatch(memberRequest())}>Load</button>
      <ul>
        {memberCollection.map((member) => (
          <li>{member.login}</li>
        ))}
      </ul>
    </>
  );
};
