import { MemberDetailEntity } from "./detail.vm";
import { getMemberDetail as getMemberDetailApi } from "./detail.api";
import { mapMemberFromApiToVm } from "./detail.mapper";

export const getMemberCollection = (
  id: string
): Promise<MemberDetailEntity> => {
  return new Promise<MemberDetailEntity>((resolve) => {
    getMemberDetailApi(id).then((result) => {
      resolve(mapMemberFromApiToVm(result));
    });
  });
};
