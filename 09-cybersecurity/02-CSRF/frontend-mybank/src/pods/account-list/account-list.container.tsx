import React from "react";
import { useAuthContext } from "core/auth";
import { AccountVm } from "./account-list.vm";
import { AccountList } from "./account-list.component";
import { mapAccountListFromApiToVm } from "./account-list.mappers";
import { getAccountList } from "./api";

export const AccountListContainer = () => {
  const { user } = useAuthContext();
  const [accountList, setAccountList] = React.useState<AccountVm[]>([]);

  const loadAccountList = async () => {
    const acountList = await getAccountList(user.id);
    setAccountList(mapAccountListFromApiToVm(acountList));
  };

  React.useEffect(() => {
    loadAccountList();
  }, []);

  return <AccountList accountList={accountList} />;
};
