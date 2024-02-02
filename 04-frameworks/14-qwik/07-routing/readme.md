# Routing

Update `qwik-app/src/services/github.service.ts`

```tsx
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
```

Update `qwik-app/src/components/footer.component.tsx`

```tsx
import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

interface FooterProps {
  org: string;
}

export const Footer = component$<FooterProps>(({ org }) => {
  return (
    <div>
      <a
        preventdefault:click
        href={`https://github.com/${org}`}
        onClick$={() => {
          if (window.confirm("Do you really want to leave?")) {
            window.open(`https://github.com/${org}`);
          }
        }}
      >
        Go To {org}
      </a>
      <Link href={`/members/${org}`}>Organization members</Link>
    </div>
  );
});
```

Update `qwik-app/src/routes/index.tsx`

```diff
-<Footer />
+<Footer org={github.org} />
```

Create `qwik-app/src/routes/members/[org]/index.tsx`

```tsx
import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

export const useMembersOrg = routeLoader$((requestEvent) => {
  console.log(requestEvent.params);
  return [];
});

export default component$(() => {
  const members = useMembersOrg();
  return <h2>Hello World</h2>;
});
```

If we have a look on console:

```javascript
{ org: 'lemoncode' }
```

Update `qwik-app/src/routes/members/[org]/index.tsx`

```tsx
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

```