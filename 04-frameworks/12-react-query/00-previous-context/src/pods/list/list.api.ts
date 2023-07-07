import { MemberEntityApi } from "./list.api-model";

export const getMemberCollection = (): Promise<MemberEntityApi[]> => {
  const promise = new Promise<MemberEntityApi[]>((resolve, reject) => {
    setTimeout(() => {
      fetch(`https://api.github.com/orgs/lemoncode/members`).then((response) =>
        resolve(response.json()));
    }, 3000);
  });
  
  return promise;
}

