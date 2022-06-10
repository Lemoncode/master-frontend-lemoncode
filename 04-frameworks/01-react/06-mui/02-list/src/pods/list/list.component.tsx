import { routes } from "@/core";
import React from "react";
import { Link } from "react-router-dom";
import { MemberEntity } from "./list.vm";
import css from "./list.styles.css";
import classNames from "classnames";

interface Props {
  members: MemberEntity[];
}

export const ListComponent: React.FC<Props> = (props) => {
  const { members } = props;
  return (
    <>
      <h2>Hello from List page</h2>
      <div className={classNames(css.container, css.someAdditionalClass)}>
        <span className={css.header}>Avatar</span>
        <span className={css.header}>Id</span>
        <span className={css.header}>Name</span>
        {members.map((member) => (
          <>
            <img src={member.avatar_url} />
            <span>{member.id}</span>
            <Link to={routes.details(member.login)}>{member.login}</Link>
          </>
        ))}
      </div>
    </>
  );
};
