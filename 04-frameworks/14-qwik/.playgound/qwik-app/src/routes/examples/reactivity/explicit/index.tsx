import { component$, useStore, useTask$ } from "@builder.io/qwik";
import { DisplayCount } from "~/components/display-count.component";
import { DisplayDelayCount } from "~/components/display-delay-count.component";

interface AppStore {
  count: number;
  delayCount: number;
}

export default component$(() => {
  const store = useStore<AppStore>({
    count: 0,
    delayCount: 0,
  });
  console.log("Render: <App>");
  useTask$(({ track, cleanup }) => {
    track(() => store.count);
    const id = setTimeout(() => {
        console.log('inside timeout')
        store.delayCount = store.count;
    }, 2000);
    cleanup(() => {
        console.log('calling clean-up')
        clearTimeout(id);
    });
  });
  return (
    <>
      <DisplayCount store={store} />
      <DisplayDelayCount store={store} />
      <button onClick$={() => store.count++}>b++</button>
    </>
  );
});
