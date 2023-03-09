import Axios from 'axios';
import { Member } from './list.api-model';
import { envConstants } from 'core/constants';

const url = `${envConstants.BASE_API_URL}/members`;

export const getMemberList = async (
  organization: string
): Promise<Member[]> => {
  const { data } = await Axios.get(
    `${url}/${organization}`
  );
  return data;
};
