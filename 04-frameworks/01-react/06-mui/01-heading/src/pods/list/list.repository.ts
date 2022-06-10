import { MemberEntity } from "./list.vm";
import { getMemberCollection as getMemberCollectionApi } from "./list.api";
import { mapMemberCollectionFromApiToVm } from "./list.mapper";

export const getMemberCollection = (): Promise<MemberEntity[]> => {
  return new Promise<MemberEntity[]>((resolve) => {
    getMemberCollectionApi().then((result) => {
      resolve(mapMemberCollectionFromApiToVm(result));
    });
  });
};
