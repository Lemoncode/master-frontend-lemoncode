import React from "react";
import { getGithubMemberDetail } from "./github-member.repository";
import { createDefaultMemberDetail } from "./github-member.vm";
import { GithubMemberComponent } from "./github-member.component";

interface Props {
  id: string;
}

export const GithubMemberPod: React.FC<Props> = (props) => {
  const { id } = props;
  const [member, setMember] = React.useState(createDefaultMemberDetail());

  React.useEffect(() => {
    const loadGithubMember = async () => {
      const member = await getGithubMemberDetail(id);
      setMember(member);
    };
    loadGithubMember();
  }, []);

  return (
    <div>
      <GithubMemberComponent githubMember={member} />
    </div>
  );
};
