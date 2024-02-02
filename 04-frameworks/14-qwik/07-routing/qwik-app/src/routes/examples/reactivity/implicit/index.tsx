import { component$, useStore } from "@builder.io/qwik";
import { DisplayA } from "~/components/display-a.component";
import { DisplayB } from "~/components/display-b.component";

interface AppStore {
  countA: number;
  countB: number;
}

export default component$(() => {
  const store = useStore<AppStore>({
    countA: 0,
    countB: 0,
  });
  console.log("Render: <App>");
  return (
    <>
      <button onClick$={() => store.countA++}>a++</button>
      <DisplayA store={store} />
      <hr />
      <button onClick$={() => store.countB}>b++</button>
      <DisplayB store={store} />
    </>
  );
});
