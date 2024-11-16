# Fetching Data 

## `useResource$()`

We would like to fetch the list of repositories for a given GitHub organization.

Create `qwik-app/src/services/github.service.ts`

```ts
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

```

Update `qwik-app/src/routes/index.tsx`

```diff
-import { component$, useSignal, $ } from "@builder.io/qwik";
+import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
-import { Title } from "../components/title.component";
import { Footer } from '../components/footer.component';

export default component$(() => {
- const displayTitle = useSignal(false);
- const onClick = $(() => {
-   displayTitle.value = !displayTitle.value;
- });
- return (
   <>
-     <Title display={displayTitle.value} />
-     <p>
-       Can't wait to see what you build with qwik!
-       <br />
-       Happy coding.
-     </p>
-     <button
-       onClick$={onClick}
-     >
-       Toggle Title
-     </button>
      <Footer />
    </>
  );
});
```

Update `qwik-app/src/routes/index.tsx`

```tsx
import { component$, useResource$, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Footer } from "../components/footer.component";
import { getRepositories } from "~/services/github.service";

export default component$(() => {
  const github = useStore({
    org: "lemoncode",
  });
  // [1]
  const orgRepos = useResource$<string[]>(({ track, cleanup }) => {
    // [2]
    track(() => github.org);

    // [3]
    const controller = new AbortController();
    cleanup(() => controller.abort());

    // [4]
    return getRepositories(github.org, controller);
  });

  return (
    <main>
      <p>
        <label>
          GitHub username:
          <input
            value={github.org}
            onInput$={(_, el) => (github.org = el.value)}
          />
        </label>
      </p>
      <Footer />
    </main>
  );
});

export const head: DocumentHead = {
  // title: "Welcome to Qwik",
  title: "Welcome to My Awesome App",
  meta: [
    {
      name: "description",
      // content: "Qwik site description",
      content: "Awesome App",
    },
  ],
};

```

1. Use `useResource$()` to set up how the data is fetched from the server.
2. We need a way to re-run fetching data whenever the `github.org` changes. Use `track` to trigger re-running of the this data fetching function.
3. A good practice is to use `AbortController` to abort the fetching of data if new request comes in. We create a new `AbortController` and register a `cleanup` function which is called when this function re-runs.
4. Fetch the data and return the promises.

Qwik provides [useResource$()](https://qwik.builder.io/docs/components/state/#useresource) and `<Resource>` to help you fetch and display data from the server. When fetching data the application can be in one of three states:

- `pending`: the data is being fetched from the server => Render `loading...` indicator.
- `resolved`: the data has successfully been fetched from the server => Render the data.
- `rejected`: the data could not be fetched from the server due to an error => Render the error.

Use [useResource$()](https://qwik.builder.io/docs/components/state/#useresource) function to set up how the data is fetched from the server. Use `<Resource>` to display the data.

## Fetching data

The `useResource$()` function returns a `ResourceReturn` object, which is a **Promise-like object** that can be serialized by Qwik. 

The `useResource$()` function allows you to `track` store properties so that the `useResource$()` function can be reactive on store changes. 

The `cleanup` function allows you to register a code that needs to be run to release resources from the previous run. 

Finally, the `useResource$()` function returns a promise that will resolve to the value.

## Rendering data

Use `<Resource>` to display the data of the `useResource$()` function. The `<Resource>` allows you to render different content depending if the resource is pending, resolved or rejected.

On the server the `<Resource>` does not render loading state, instead, it pauses rendering until the resource is resolved and will always render as either resolved or rejected. (On the client, the `<Resource>` renders all states including pending.)

```tsx
<Resource
  value={resourceToRender}
  onPending={() => <div>Loading...</div>}
  onRejected={(reason) => <div>Error: {reason}</div>}
  onResolved={(data) => <div>{data}</div>}
/>
```

## SSR vs Client

> Notice that the same code can render on both server and client (with slightly different behavior, which skips the pending state rendering on the server.)

Update `qwik-app/src/routes/index.tsx`

```diff
-import { component$, useResource$, useStore } from "@builder.io/qwik";
+import { Resource, component$, useResource$, useStore } from "@builder.io/qwik";
```

```tsx
export default component$(() => {
  const github = useStore({
    org: "lemoncode",
  });

  const orgRepos = useResource$<string[]>(({ track, cleanup }) => {
    track(() => github.org);

    const controller = new AbortController();
    cleanup(() => controller.abort());

    return getRepositories(github.org, controller);
  });

  return (
    <main>
      <p>
        <label>
          GitHub username:
          <input
            value={github.org}
            onInput$={(_, el) => (github.org = el.value)}
          />
        </label>
      </p>
      {/*diff*/}
      <section>
        <Resource
          value={orgRepos}
          onPending={() => <div>Loading...</div>}
          onRejected={(reason: Error) => <div>Error: {reason.message}</div>}
          onResolved={(repos) => (
            <ul>
              {repos.map((repo) => (
                <li key={repo}>
                  <a href={`https://github.com/${github.org}/${repo}`}>
                    {repo}
                  </a>
                </li>
              ))}
            </ul>
          )}
        />
      </section>
      {/*diff*/}
      <Footer />
    </main>
  );
});

```

```bash
npm run dev
```