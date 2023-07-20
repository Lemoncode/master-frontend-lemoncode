import { For, useContext } from "solid-js";
import "./styles.css";
import { MemberContext } from "./members.store";
import { A } from "@solidjs/router";

export const MemberListPage = () => {
  const { members, setMembers } = useContext(MemberContext);
  const handleDelete = (id) => {
    setMembers((members) => members.filter((member) => member.id !== id));
  };

  return (
    <>
      <div class="list">
        <For each={members}>
          {(member, index) => {
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
                <A href={`/member/${member.login}`}>View Details</A>
              </>
            );
          }}
        </For>
      </div>
    </>
  );
};
