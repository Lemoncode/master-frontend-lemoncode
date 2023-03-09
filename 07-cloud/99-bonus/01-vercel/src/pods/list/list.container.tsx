import React from 'react';
import { envConstants } from 'core/constants';
import * as api from './api';
import { mapMemberListFromApiToVm } from './list.mappers';
import { ListComponent } from './list.component';
import { Member } from './list.vm';

interface Props {
  className?: string;
}

export const ListContainer: React.FC<Props> = (props) => {
  const { className } = props;
  const [organization] = React.useState(envConstants.ORGANIZATION);
  const [memberList, setMemberList] = React.useState<Member[]>([]);

  const handleLoadMemberList = async () => {
    const apiMemberList = await api.getMemberList(organization);
    const vmMemberList = mapMemberListFromApiToVm(apiMemberList);
    setMemberList(vmMemberList);
  };

  React.useEffect(() => {
    handleLoadMemberList();
  }, [organization]);

  return (
    <ListComponent
      className={className}
      organization={organization}
      memberList={memberList}
    />
  );
};
