import React from "react";
import { GithubMemberVm } from "./github-collection.vm";
import classNames from "classnames";
import { Link, generatePath } from "react-router-dom";
import { ROUTES } from "@/core/routing";
import classes from "./github-collection.component.module.css";

interface Props {
  githubMembers: GithubMemberVm[];
}

export const GithubCollectionComponent: React.FC<Props> = (props) => {
  const { githubMembers } = props;

  return (
    <div className={classNames(classes.container, classes.someAdditionalClass)}>
      <span className={classes.header}>Avatar</span>
      <span className={classes.header}>Id</span>
      <span className={classes.header}>Name</span>
      {githubMembers.map((member) => (
        <React.Fragment key={member.id}>
          <img src={member.avatarUrl} />
          <span>{member.id}</span>
          <Link to={generatePath(ROUTES.GITHUB_MEMBER, { id: member.name })}>
            {member.name}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
};
