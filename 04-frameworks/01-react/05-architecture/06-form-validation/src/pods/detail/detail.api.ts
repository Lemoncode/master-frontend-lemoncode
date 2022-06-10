import { MemberDetailEntityApi } from "./detail.api-model";

export const getMemberDetail = (id: string): Promise<MemberDetailEntityApi> =>
  fetch(`https://api.github.com/users/${id}`).then((response) =>
    response.json()
  );
