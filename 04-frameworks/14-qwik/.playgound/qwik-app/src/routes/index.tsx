import { Resource, component$, useResource$, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Footer } from "../components/footer.component";
import { getRepositories } from "~/services/github.service";

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
      <Footer org={github.org} />
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
