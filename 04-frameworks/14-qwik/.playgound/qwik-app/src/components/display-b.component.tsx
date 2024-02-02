import { component$ } from "@builder.io/qwik";

export const DisplayB = component$<{ store: { countB: number } }>((props) => {
  console.log("Render: <DisplayB>");
  return <>{props.store.countB}</>;
});
