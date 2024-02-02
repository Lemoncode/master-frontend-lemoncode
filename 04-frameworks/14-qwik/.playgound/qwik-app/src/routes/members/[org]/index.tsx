import { component$ } from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
import { getMembersByOrg } from "../../../services/github.service";

export const useMembersOrg = routeLoader$(async (requestEvent) => {
  const { org } = requestEvent.params;
  const members = await getMembersByOrg(org);
  return members;
});

export default component$(() => {
  const location = useLocation();
  const members = useMembersOrg();
  return (
    <>
      <h1>{location.params.org} members</h1>
      <ul>
        {members.value.map((m) => (
          <li key={m.id}>{m.login}</li>
        ))}
      </ul>
    </>
  );
});
