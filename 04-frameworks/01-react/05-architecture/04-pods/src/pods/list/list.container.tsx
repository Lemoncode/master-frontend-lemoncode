import React from "react";
import { ListComponent } from "./list.component";
import { MemberEntity } from "./list.vm";

export const ListContainer: React.FC = () => {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);

  React.useEffect(() => {
    fetch(`https://api.github.com/orgs/lemoncode/members`)
      .then((response) => response.json())
      .then((json) => setMembers(json));
  }, []);

  return <ListComponent members={members} />;
};
