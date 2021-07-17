import axios from "axios";
import { Member } from "./models/members-list.model";

export const getMembersList = (organization: string) => {
  return axios
    .get<Member[]>(`https://api.github.com/orgs/${organization}/members`)
    .then((r) => r.data);
};
