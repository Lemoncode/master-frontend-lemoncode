import React from "react";
import { MemberEntity } from "./model";
import { MemberTableRow } from "./member-table-row";

export const MemberTable = () => {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);

  React.useEffect(() => {
    fetch(`https://api.github.com/orgs/lemoncode/members`)
      .then((response) => response.json())
      .then((json) => setMembers(json));
  }, []);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Avatar</th>
          <th>Id</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <MemberTableRow member={member} />
        ))}
      </tbody>
    </table>
  );
}