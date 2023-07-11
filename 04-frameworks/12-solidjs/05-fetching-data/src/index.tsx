import { createResource, For } from "solid-js";
import { render } from "solid-js/web";
import "./styles.css";

interface Member {
  id: string;
  login: string;
  avatar_url: string;
}

const getMembers = (): Promise<Member[]> =>
  fetch(`https://api.github.com/orgs/lemoncode/members`).then((response) =>
    response.json()
  );

const App = () => {
  const [members, { mutate }] = createResource(getMembers, {
    initialValue: [],
  });

  const handleDelete = (id) => {
    mutate((members) => members.filter((member) => member.id !== id));
  };

  return (
    <>
      {members.loading && <p>Loading...</p>}
      {members.error && <p>Error...</p>}
      <div class="list">
        <For each={members()}>
          {(member) => {
            console.log("Member");
            return (
              <>
                <img
                  onClick={() => handleDelete(member.id)}
                  src={member.avatar_url}
                />
                <span>{member.login}</span>
              </>
            );
          }}
        </For>
      </div>
    </>
  );
};

render(() => <App />, document.getElementById("root"));
