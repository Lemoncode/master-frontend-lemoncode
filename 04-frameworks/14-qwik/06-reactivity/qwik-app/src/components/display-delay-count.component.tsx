import { component$ } from "@builder.io/qwik";

export const DisplayDelayCount = component$<{ store: { delayCount: number } }>(
  (props) => {
    console.log("Render: <DisplayDelayCount>");
    return <>{props.store.delayCount}</>;
  }
);