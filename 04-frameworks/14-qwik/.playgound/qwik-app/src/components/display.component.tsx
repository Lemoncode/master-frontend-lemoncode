import { component$ } from "@builder.io/qwik";

interface DisplayProps {
  counter: { count: number };
  list: number[];
}

export const Display = component$((props: DisplayProps) => {
  return (
    <p>
      Count: {props.counter.count}, List length: {props.list.length}
    </p>
  );
});
