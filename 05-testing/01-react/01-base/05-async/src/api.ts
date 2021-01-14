import Axios, { AxiosError } from 'axios';
import { Member } from './api-model';

const url = 'https://api.github.com/orgs/lemoncode/members';

export const getMembers = (): Promise<Member[]> =>
  Axios.get(url)
    .then(({ data }) => data)
    .catch((error: AxiosError) => {
      switch (error.response.status) {
        case 403:
          throw 'Too much Github API calls!';
        case 503:
          throw 'Unavailable service';
      }
    });
