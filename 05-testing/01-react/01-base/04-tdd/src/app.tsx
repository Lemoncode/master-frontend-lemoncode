import * as React from 'react';
import { getMembers } from './api';
import { mapMemberListFromApiToVm } from './mapper';

export const App: React.FunctionComponent = () => {
  React.useEffect(() => {
    getMembers().then((members) => {
      console.log(mapMemberListFromApiToVm(members));
    });
  }, []);

  return <h1>05-Testing / 01 React</h1>;
};
