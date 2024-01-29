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
