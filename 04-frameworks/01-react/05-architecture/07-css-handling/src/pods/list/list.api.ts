import { MemberEntityApi } from "./list.api-model";
import { MemberEntity } from "./list.vm";

export const getMemberCollection = (): Promise<MemberEntityApi[]> =>
  fetch(`https://api.github.com/orgs/lemoncode/members`).then((response) =>
    response.json()
  );
