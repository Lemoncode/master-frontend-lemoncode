import React from "react";
import { Link } from "react-router-dom";
import { routes } from "core";
import { AccountVm } from "./account-list.vm";

interface Props {
  accountList: AccountVm[];
}

export const AccountList: React.FC<Props> = (props) => {
  const { accountList } = props;

  return (
    <div className="container">
      <h1 className="selected">My accounts</h1>
      <div className="account-list-container">
        <span className="account-list-header">Iban</span>
        <span className="account-list-header">Name</span>
        {accountList.map((account) => (
          <React.Fragment key={account.id}>
            <Link to={routes.movementList(account.id)}>
              <span className="color-iban">{account.iban}</span>
            </Link>
            <span>{account.name}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
