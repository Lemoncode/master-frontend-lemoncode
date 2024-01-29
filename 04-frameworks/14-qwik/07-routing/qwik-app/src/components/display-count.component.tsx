import { component$ } from "@builder.io/qwik";

export const DisplayCount = component$<{ store: { count: number } }>(
  (props) => {
    console.log("Render: <DisplayCount>");
    return <>{props.store.count}</>;
  }
);
