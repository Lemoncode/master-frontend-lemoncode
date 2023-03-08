import Axios from 'axios';
import { Member } from './list.api-model';

export const getMemberList = async (
  organization: string
): Promise<Member[]> => {
  const { data } = await Axios.get(
    `https://api.github.com/orgs/${organization}/members`
  );
  return data;
};
