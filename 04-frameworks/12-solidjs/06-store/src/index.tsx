import { For, useContext } from "solid-js";
import { render } from "solid-js/web";
import "./styles.css";
import { MemberContext, MemberProvider } from "./members.store";

const App = () => {
  const { members, setMembers } = useContext(MemberContext);
  const handleDelete = (id) => {
    setMembers((members) => members.filter((member) => member.id !== id));
  };

  return (
    <>
      <div class="list">
        <For each={members}>
          {(member, index) => {
            console.log("Member");
            return (
              <>
                <img
                  onClick={() => handleDelete(member.id)}
                  src={member.avatar_url}
                />
                <input
                  value={member.login}
                  onInput={(e) =>
                    setMembers(index(), "login", e.currentTarget.value)
                  }
                />
              </>
            );
          }}
        </For>
      </div>
    </>
  );
};

render(
  () => (
    <div
      style={{
        display: "flex",
        "justify-content": "space-between",
      }}
    >
      <MemberProvider>
        <App />
      </MemberProvider>
      <MemberProvider>
        <App />
      </MemberProvider>
    </div>
  ),
  document.getElementById("root")
);
