import React from "react";
import { GithubMemberVm } from "./github-member.vm";
import classes from "./github-member.component.module.css";

interface Props {
  githubMember: GithubMemberVm;
}

export const GithubMemberComponent: React.FC<Props> = (props) => {
  const { githubMember } = props;

  return (
    <div className={classes.container}>
      <img src={githubMember.avatarUrl} />
      <span>{githubMember.name}</span>
      <span>{githubMember.bio}</span>
    </div>
  );
};
