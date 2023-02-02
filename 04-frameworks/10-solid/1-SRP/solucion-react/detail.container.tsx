import React from "react";
import { MemberDetailEntity, createDefaultMemberDetail } from "./detail.vm";
import { DetailComponent } from "./detail.component";
import { getMemberCollection } from "./detail.repository";

interface Props {
  id: string;
}

export const DetailContainer: React.FC<Props> = (props) => {
  const { id } = props;
  const [member, setMember] = React.useState<MemberDetailEntity>(
    createDefaultMemberDetail()
  );

  React.useEffect(() => {
    getMemberCollection(id).then((memberDetail) => setMember(memberDetail));
  }, []);

  return <DetailComponent member={member} />;
};
