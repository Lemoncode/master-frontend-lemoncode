export async function getRepositories(
  username: string,
  controller?: AbortController
): Promise<string[]> {
  console.log("FETCH", `https://api.github.com/users/${username}/repos`);
  const resp = await fetch(`https://api.github.com/users/${username}/repos`, {
    signal: controller?.signal,
  });
  console.log("FETCH resolved");
  const json = await resp.json();
  return Array.isArray(json)
    ? json.map((repo: { name: string }) => repo.name)
    : Promise.reject(json);
}


export interface OrgMember {
  login: string;
  id: number;
  avatarUrl: string;
}

const mapOrgMember = (member: { login: string; id: number; avatar_url: string; }) => (({
  login: member.login,
  id: member.id,
  avatarUrl: member.avatar_url
}));

export async function getMembersByOrg(
  org: string,
  controller?: AbortController
): Promise<OrgMember[]> {
  console.log("FETCH", `https://api.github.com/orgs/${org}/members`);
  const resp = await fetch(`https://api.github.com/orgs/${org}/members`, {
    signal: controller?.signal,
  });
  console.log("FETCH resolved");
  const json = await resp.json();
  return Array.isArray(json)
    ? json.map(mapOrgMember)
    : Promise.reject(json);
}

// https://api.github.com/users/${id}
// export async function getMemberDetail() {}
