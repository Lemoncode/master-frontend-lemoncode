import { createStore, SetStoreFunction, Store } from "solid-js/store";
import { createContext, ParentComponent } from "solid-js";

interface Member {
  id: string;
  login: string;
  avatar_url: string;
}

interface Context {
  members: Store<Member[]>;
  setMembers: SetStoreFunction<Member[]>;
}

export const MemberContext = createContext<Context>();

export const MemberProvider: ParentComponent = (props) => {
  const [members, setMembers] = createStore<Member[]>([
    {
      id: "4374977",
      login: "nasdan",
      avatar_url: "https://avatars.githubusercontent.com/u/4374977?v=4",
    },
    {
      id: "43609530",
      login: "v-borrego",
      avatar_url: "https://avatars.githubusercontent.com/u/43609530?v=4",
    },
  ]);

  return (
    <MemberContext.Provider value={{ members, setMembers }}>
      {props.children}
    </MemberContext.Provider>
  );
};
