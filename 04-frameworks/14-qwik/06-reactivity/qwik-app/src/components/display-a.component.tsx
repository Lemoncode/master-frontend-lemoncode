import { component$ } from "@builder.io/qwik";

export const DisplayA = component$<{ store: { countA: number } }>((props) => {
  console.log("Render: <DisplayA>");
  return <>{props.store.countA}</>;
});
