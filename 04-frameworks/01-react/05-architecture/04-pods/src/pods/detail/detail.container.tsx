import React from "react";
import { MemberDetailEntity, createDefaultMemberDetail } from "./detail.vm";
import { DetailComponent } from "./detail.component";

interface Props {
  id: string;
}

export const DetailContainer: React.FC<Props> = (props) => {
  const { id } = props;
  const [member, setMember] = React.useState<MemberDetailEntity>(
    createDefaultMemberDetail()
  );

  React.useEffect(() => {
    fetch(`https://api.github.com/users/${id}`)
      .then((response) => response.json())
      .then((json) => setMember(json));
  }, []);

  return <DetailComponent member={member} />;
};
